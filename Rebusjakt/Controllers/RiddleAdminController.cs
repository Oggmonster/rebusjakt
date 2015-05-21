using AutoMapper;
using Rebusjakt.DAL;
using Rebusjakt.Models;
using Rebusjakt.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class RiddleAdminController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        
        public ActionResult Index(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            var viewModel = new HuntViewModel{
                HuntId = hunt.Id,
                HuntName = hunt.Name
            };
            Mapper.CreateMap<Riddle, RiddleViewModel>();
            Mapper.CreateMap<Question, QuestionViewModel>();
            viewModel.Riddles = Mapper.Map<IEnumerable<Riddle>, IEnumerable<RiddleViewModel>>(hunt.Riddles).ToList();
            return View(viewModel);
        }

        #region Riddles
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
