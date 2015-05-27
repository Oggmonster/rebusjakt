using Rebusjakt.DAL;
using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace Rebusjakt.Controllers
{
    [Authorize]
    public class HuntController : Controller
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
            if(ModelState.IsValid)
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
            if(hunt.UserId != User.Identity.GetUserId()){
                return Json("Det verkar inte vara du som skapat jakten");
            }
            if (IsReadyForPublic(hunt))
            {
                hunt.IsActive = true;
                try
                {
                    unitOfWork.Save();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex.InnerException.Message);
                }
                
                return Json("Aktiverad");
            }
            else
            {
                return Json("Se till så att det finns rebusar först och att alla rebusar har minst en fråga.");
            }
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

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}