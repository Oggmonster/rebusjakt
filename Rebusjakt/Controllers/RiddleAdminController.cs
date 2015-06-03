using AutoMapper;
using Rebusjakt.DAL;
using Rebusjakt.Models;
using Rebusjakt.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace Rebusjakt.Controllers
{
    [Authorize]
    public class RiddleAdminController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        public ActionResult Index()
        {
            string userId = User.Identity.GetUserId();
            var hunts = unitOfWork.HuntRepository.Get().Where(h => h.UserId == userId).ToList();
            return View(hunts);
        }

        public ActionResult Create()
        {
            var hunt = new Hunt();
            return View(hunt);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Hunt hunt)
        {
            if (ModelState.IsValid)
            {
                hunt.UserId = User.Identity.GetUserId();
                unitOfWork.HuntRepository.Insert(hunt);
                unitOfWork.Save();
                return RedirectToAction("Index");
            }
            return View(hunt);
        }

        public ActionResult Edit(int id)
        {

            var hunt = unitOfWork.HuntRepository.GetByID(id);
            if (hunt.UserId != User.Identity.GetUserId())
            {
                return RedirectToAction("Index");
            }
            return View(hunt);
        }



        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Hunt hunt)
        {
            if (hunt.UserId != User.Identity.GetUserId())
            {
                return RedirectToAction("Index");
            }
            if (ModelState.IsValid && hunt.Id > 0)
            {
                unitOfWork.HuntRepository.Update(hunt);
                unitOfWork.Save();
                return RedirectToAction("Index");
            }
            return View(hunt);
        }

        public ActionResult Delete(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            return View(hunt);
        }

        [HttpPost]
        public ActionResult Delete(Hunt model)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(model.Id);
            foreach (var riddle in hunt.Riddles.ToList())
            {
                foreach (var question in riddle.Questions.ToList())
                {
                    unitOfWork.QuestionRepository.Delete(question.Id);
                }
                unitOfWork.RiddleRepository.Delete(riddle.Id);
            }
            unitOfWork.HuntRepository.Delete(hunt.Id);
            unitOfWork.Save();
            return RedirectToAction("Index");
        }

        public JsonResult MakeActive(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            if (hunt.UserId != User.Identity.GetUserId())
            {
                return Json("Det verkar inte vara du som skapat jakten");
            }
            if (IsReadyForPublic(hunt))
            {
                hunt.IsActive = true;
                unitOfWork.Save();
                return Json("ok");
            }
            else
            {
                return Json("Se till så att det finns rebusar först och att alla rebusar har minst en fråga.");
            }
        }

        public JsonResult MakeInActive(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            if (hunt.UserId != User.Identity.GetUserId())
            {
                return Json("Det verkar inte vara du som skapat jakten");
            }
            hunt.IsActive = false;
            unitOfWork.Save();
            return Json("ok");
        }

        /// <summary>
        /// Check if hunt is ready to make public - has riddles and all riddles has questions
        /// </summary>
        private bool IsReadyForPublic(Hunt hunt)
        {
            if (hunt.Riddles.Count == 0)
                return false;

            foreach (var item in hunt.Riddles)
            {
                if (item.Questions.Count == 0)
                    return false;
            }
            return true;
        }


        #region Riddles
        public ActionResult Riddles(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            var viewModel = new GameViewModel
            {
                HuntId = hunt.Id,
                HuntName = hunt.Name
            };
            Mapper.CreateMap<Riddle, RiddleViewModel>();
            Mapper.CreateMap<Question, QuestionViewModel>();
            viewModel.Riddles = Mapper.Map<IEnumerable<Riddle>, IEnumerable<RiddleViewModel>>(hunt.Riddles).ToList();
            return View(viewModel);
        }
        public JsonResult AddRiddle([Bind(Exclude = "Id")]Riddle riddle)
        {
            var errors = new List<string>();
            if (ModelState.IsValid)
            {
                riddle.Answer = riddle.Answer.ToUpper();
                riddle.SortDate = DateTime.Now;
                unitOfWork.RiddleRepository.Insert(riddle);
                unitOfWork.Save();
                riddle.Questions = new List<Question>();
            }
            else
            {
                //get errors
                foreach (ModelState modelState in ViewData.ModelState.Values)
                {
                    foreach (ModelError error in modelState.Errors)
                    {
                        errors.Add(error.ErrorMessage);
                    }
                }
            }
            
            return Json(new { riddle = riddle, errors = errors });
        }

        public JsonResult EditRiddle(Riddle riddle)
        {
            var errors = new List<string>();
            if (ModelState.IsValid)
            {
                riddle.Answer = riddle.Answer.ToUpper();
                riddle.SortDate = DateTime.Now; //fix <<              
                unitOfWork.RiddleRepository.Update(riddle);
                unitOfWork.Save();
            }
            else
            {
                //get errors
                foreach (ModelState modelState in ViewData.ModelState.Values)
                {
                    foreach (ModelError error in modelState.Errors)
                    {
                        errors.Add(error.ErrorMessage);
                    }
                }
            }
            return Json(new { riddle = riddle, errors = errors });
        }

        public void DeleteRiddle(int id)
        {
            var riddle = unitOfWork.RiddleRepository.GetByID(id);
            foreach (var item in riddle.Questions.ToList())
            {
                unitOfWork.QuestionRepository.Delete(item.Id);
            }
            unitOfWork.RiddleRepository.Delete(id);
            unitOfWork.Save();
        }

        
        #endregion

        #region Questions

        public JsonResult AddQuestion([Bind(Exclude = "Id")]Question question)
        {
            var errors = new List<string>();
            if (ModelState.IsValid)
            {
                question.Answer = question.Answer.ToUpper();
                question.SortDate = DateTime.Now;
                unitOfWork.QuestionRepository.Insert(question);
                unitOfWork.Save();
            }
            else
            {
                //get errors
                foreach (ModelState modelState in ViewData.ModelState.Values)
                {
                    foreach (ModelError error in modelState.Errors)
                    {
                        errors.Add(error.ErrorMessage);
                    }
                }
            }
            return Json(new { question = question, errors = errors });
        }

        public JsonResult EditQuestion(Question question)
        {
            var errors = new List<string>();
            if (ModelState.IsValid)
            {
                question.Answer = question.Answer.ToUpper();
                question.SortDate = DateTime.Now; //fix <<              
                unitOfWork.QuestionRepository.Update(question);
                unitOfWork.Save();
            }
            else
            {
                //get errors
                foreach (ModelState modelState in ViewData.ModelState.Values)
                {
                    foreach (ModelError error in modelState.Errors)
                    {
                        errors.Add(error.ErrorMessage);
                    }
                }
            }
            return Json(new { question = question, errors = errors });
        }

        public void DeleteQuestion(int id)
        {
            unitOfWork.QuestionRepository.Delete(id);
            unitOfWork.Save();
        }

        #endregion

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}
