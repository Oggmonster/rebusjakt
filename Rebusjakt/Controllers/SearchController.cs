using Rebusjakt.Models;
using Rebusjakt.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rebusjakt.Controllers
{
    public class SearchController : Controller
    {
        private Searcher searcher = new Searcher();

        // GET: Search
        public ActionResult Index(string q)
        {
            var result = searcher.Search(q);
            var hunts = new List<Hunt>();
            if(result.Total > 0){
                hunts = result.Hits.Select(h => h.Source).ToList();
            }            
            return View(hunts);
        }

        public ActionResult ByLocation()
        {
            double lat = 0, lng = 0;
            string latStr = "59.3257856", lngStr = "18.070420499999955";
            double.TryParse(latStr.Replace(".", ","), out lat);
            double.TryParse(lngStr.Replace(".", ","), out lng);
            var result = searcher.SearchByLocation(lat,lng);
            var hunts = new List<Hunt>();
            if (result.Total > 0)
            {
                hunts = result.Hits.Select(h => h.Source).ToList();
            }
            return View("Index", hunts);
        }


        public JsonResult Search(string q)
        {            
            var result = searcher.Search(q);
            return Json(result);
        }
    }
}