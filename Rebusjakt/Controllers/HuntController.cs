using Rebusjakt.DAL;
using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    [Authorize]
    public class HuntController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        
        public ActionResult Index()
        {
            var hunts = unitOfWork.HuntRepository.Get().ToList();
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
                unitOfWork.HuntRepository.Insert(hunt);
                unitOfWork.Save();
                return RedirectToAction("Index");
            }
            return View(hunt);
        }

        public ActionResult Edit(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            return View(hunt);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Hunt hunt)
        {
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

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}