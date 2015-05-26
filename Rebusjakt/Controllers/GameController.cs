using AutoMapper;
using Rebusjakt.DAL;
using Rebusjakt.Models;
using Rebusjakt.ViewModels;
using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    [Authorize]
    public class GameController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        
        public ActionResult Index(int id)
        {
            var hunt = unitOfWork.HuntRepository.GetByID(id);
            Mapper.CreateMap<Riddle, RiddleViewModel>();
            Mapper.CreateMap<Question, QuestionViewModel>();
            var viewModel = new HuntViewModel
            {
                HuntId = hunt.Id,
                HuntName = hunt.Name,
                Riddles = Mapper.Map<IEnumerable<Riddle>, IEnumerable<RiddleViewModel>>(hunt.Riddles).ToList()
            };
            ViewBag.HideTopNavigation = true;
            return View(viewModel);
        }
        //double sLatitude, double sLongitude, double eLatitude, double eLongitude
        public JsonResult CalculateDistance(FormCollection form)
        {
            double sLatitude = 0, sLongitude = 0, eLatitude = 0, eLongitude = 0;
            double.TryParse(form["sLatitude"].Replace(".",","), out sLatitude);
            double.TryParse(form["sLongitude"].Replace(".", ","), out sLongitude);
            double.TryParse(form["eLatitude"].Replace(".", ","), out eLatitude);
            double.TryParse(form["eLongitude"].Replace(".", ","), out eLongitude);
            var sCoord = new GeoCoordinate(sLatitude, sLongitude);
            var eCoord = new GeoCoordinate(eLatitude, eLongitude);
            return Json(sCoord.GetDistanceTo(eCoord));
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}