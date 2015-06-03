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
    public class HuntController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        public ActionResult Index(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            var viewModel = new HuntIndexViewModel
            {
                Hunt = hunt
            };            
            
            viewModel.HuntReviews = unitOfWork.HuntReviewRepository.Get().Where(h => h.HuntId == id)
                .Select(r => new HuntReviewViewModel
                {
                    Description = r.Description,
                    IsPositive = r.IsPositive,
                    UserName = r.User.UserName,
                    CreatedDate = r.CreatedDate                    
                }).ToList();

            viewModel.TopScores = unitOfWork.UserScoreRepository.Get().Where(u => u.HuntId == id).Select(s =>
                new UserScoreViewModel
                {
                    UserName = s.User.UserName,
                    Score = s.Score,
                    TimeInSeconds = s.TimeInSeconds,
                    CreatedDate = s.CreatedDate
                }).ToList().OrderByDescending(s => s.Score).ThenBy(s => s.TimeInSeconds).ToList();

            return View(viewModel);
        }
        
        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}