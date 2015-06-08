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
            var viewModel = new UserIndexViewModel
            {
                UserName = user.UserName
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