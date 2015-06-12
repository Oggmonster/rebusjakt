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
using Rebusjakt.Services;
using System.Globalization;

namespace Rebusjakt.Controllers
{
    [Authorize]
    public class GameController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        
        public ActionResult Index(int id, bool? isRandom)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            if (hunt == null)
            {
                return View("NotFound");
            }
            if (!hunt.IsActive)
            {
                return View("NotActiveHunt");
            }
            Mapper.CreateMap<Riddle, RiddleViewModel>();
            Mapper.CreateMap<Question, QuestionViewModel>();
            var viewModel = new GameViewModel
            {
                HuntId = hunt.Id,
                HuntName = hunt.Name,
                EndLocation = hunt.EndLocation,
                EndLatitude = hunt.EndLatitude,
                EndLongitude = hunt.EndLongitude,
                TimeLimit = hunt.TimeLimit,
                UserId = User.Identity.GetUserId(),
                IsRandom = isRandom.HasValue,
                Riddles = Mapper.Map<IEnumerable<Riddle>, IEnumerable<RiddleViewModel>>(hunt.Riddles).ToList()
            };
            
            ViewBag.HideTopNavigation = true;
            return View(viewModel);
        }
        
        public JsonResult CalculateDistance(FormCollection form)
        {
            double sLatitude = 0, sLongitude = 0, eLatitude = 0, eLongitude = 0;
            double.TryParse(form["sLatitude"].Replace(".",","), out sLatitude);
            double.TryParse(form["sLongitude"].Replace(".", ","), out sLongitude);
            double.TryParse(form["eLatitude"].Replace(".", ","), out eLatitude);
            double.TryParse(form["eLongitude"].Replace(".", ","), out eLongitude);
            var distance = GeolocationService.CalculateDistance(sLatitude, sLongitude, eLatitude, eLongitude);
            return Json(distance);
        }

        public JsonResult SaveScore([Bind(Exclude = "Id")]UserScore userScore)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(userScore.HuntId);
            if (hunt.UserId == userScore.UserId)
            {
                return Json("Din poäng sparas inte till topplistan eftersom det är du som har har skapat jakten.");
            }
            var existingScore = unitOfWork.UserScoreRepository.Get().FirstOrDefault(s => s.UserId == userScore.UserId && s.HuntId == userScore.HuntId);
            if (existingScore == null)
            {
                userScore.CreatedDate = DateTime.Now;
                unitOfWork.UserScoreRepository.Insert(userScore);
                unitOfWork.Save();
                return Json("");
            }
            return Json("Du har genomfört den här jakten tidigare och fick då " + existingScore.Score + "p. Det är endast din första poäng som sparas till topplistan.");
        }

        public JsonResult AddReview([Bind(Exclude = "Id")]HuntReview huntReview)
        {
            if (ModelState.IsValid)
            {
                var existingReview = unitOfWork.HuntReviewRepository.Get().FirstOrDefault(r => r.HuntId == huntReview.HuntId && r.UserId == huntReview.UserId);
                if(existingReview != null)
                    Json(new { error = "Du har redan betygsatt den här jakten" });

                huntReview.CreatedDate = DateTime.Now;
                unitOfWork.HuntReviewRepository.Insert(huntReview);
                unitOfWork.Save();
                return Json(huntReview.Id);
            }
            return Json(new { error = "Kunde inte spara" });
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}