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

        public ActionResult Index(int id, string slug)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            if (slug != hunt.Slug)
            {
                return RedirectPermanent(string.Format("/jakt/{0}/{1}", hunt.Id, hunt.Slug));
            }
            var creator = unitOfWork.UserRepository.GetByID(hunt.UserId);
            var viewModel = new HuntIndexViewModel
            {
                Hunt = hunt,
                Creator = creator.UserName,
                CreatorUrl = "/u/" + creator.Slug
            };            
            
            viewModel.HuntReviews = unitOfWork.HuntReviewRepository.Get().Where(h => h.HuntId == id)
                .Select(r => new HuntReviewViewModel
                {
                    Description = r.Description,
                    IsPositive = r.IsPositive,
                    UserName = r.User.UserName,
                    UserUrl = "/u/" + r.User.Slug,
                    CreatedDate = r.CreatedDate                    
                }).ToList();

            viewModel.TopScores = unitOfWork.UserScoreRepository.Get().Where(u => u.HuntId == id).Select(s =>
                new UserScoreViewModel
                {
                    UserName = s.User.UserName,
                    UserUrl = "/u/" + s.User.Slug,
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