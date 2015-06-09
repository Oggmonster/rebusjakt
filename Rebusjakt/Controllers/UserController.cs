using Rebusjakt.DAL;
using Rebusjakt.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class UserController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        /// <summary>
        /// Id = slug
        /// </summary>
        /// <param name="id">Slug</param>
        /// <returns></returns>
        public ActionResult Index(string id)
        {
            var user = unitOfWork.UserRepository.Get().FirstOrDefault(u => u.Slug == id);
            if (user == null)
            {
                return View("UserNotFound");
            }
            var userScores = unitOfWork.UserScoreRepository.Get().Where(u => u.UserId == user.Id).Select(s => new UserScoreViewModel
            {
                Score = s.Score,
                TimeInSeconds = s.TimeInSeconds,
                CreatedDate = s.CreatedDate,
                HuntName = s.Hunt.Name,
                HuntUrl = "/jakt/" + s.HuntId + "/" + s.Hunt.Slug
            }).ToList();

            var userHunts = unitOfWork.HuntRepository.Get().Where(h => h.UserId == user.Id).ToList();
            var viewModel = new UserIndexViewModel
            {
                UserName = user.UserName,
                UserScores = userScores,
                Hunts = userHunts
            };
            return View(viewModel);
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}