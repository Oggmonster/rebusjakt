using Rebusjakt.DAL;
using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class HomeController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        public ActionResult Index()
        {
            var hunts = unitOfWork.HuntRepository.Get().Where(h => h.IsActive).Take(10).ToList().OrderByDescending(h => h.CreatedDate).ToList();
            return View(hunts);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult HowTo()
        {
            return View();
        }

        public ActionResult Error()
        {
            return View("Error");
        }

        public ActionResult NotFound()
        {
            return View("NotFound");
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}