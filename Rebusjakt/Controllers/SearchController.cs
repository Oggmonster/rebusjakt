using Rebusjakt.Models;
using Rebusjakt.Search;
using Rebusjakt.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            ViewBag.Query = q;
            return View(hunts);
        }               

        public ActionResult ByLocation(string latStr, string lngStr)
        {
            if (string.IsNullOrEmpty(latStr) || string.IsNullOrEmpty(lngStr))
            {
                return Redirect("/search/index/?q=");
            }
            double lat = 0, lng = 0;
            double.TryParse(latStr.Replace(".", ","), out lat);
            double.TryParse(lngStr.Replace(".", ","), out lng);
            var result = searcher.SearchByLocation(lat,lng, 10);
            var hunts = new List<Hunt>();
            if (result.Total > 0)
            {
                hunts = result.Hits.Select(h => h.Source).ToList();
                CalculateDistances(hunts, lat, lng);
            }
            ViewBag.UseLocation = true;
            return View("Index", hunts);
        }

        public JsonResult Search(string q, string latStr, string lngStr, int radius)
        {
            Nest.ISearchResponse<Hunt> result = null;
            var hunts = new List<Hunt>();
            double lat = 0, lng = 0;
            double.TryParse(latStr.Replace(".", ","), out lat);
            double.TryParse(lngStr.Replace(".", ","), out lng);
            if (lat > 0)
            {
                if (!string.IsNullOrEmpty(q))
                {
                    result = searcher.SearchByQueryAndLocation(q, lat, lng, radius);
                }
                else
                {
                    result = searcher.SearchByLocation(lat, lng, radius);
                }
                hunts = result.Hits.Select(h => h.Source).ToList();
                CalculateDistances(hunts, lat, lng);
            }
            else
            {
                result = searcher.Search(q);
                hunts = result.Hits.Select(h => h.Source).ToList();
            }
            return Json(hunts.Select(h => new { Id = h.Id, Name = h.Name, Description = h.Description, Distance = h.Distance, Theme = h.Theme, StartLocation = h.StartLocation, TimeLimit = h.TimeLimit }).ToList());           
        }

        private List<Hunt> CalculateDistances(List<Hunt> hunts, double lat, double lng)
        {
            double huntLat, huntLng;
            foreach (var item in hunts)
            {
                huntLat = 0;
                huntLng = 0;
                double.TryParse(item.StartLatitude.Replace(".", ","), out huntLat);
                double.TryParse(item.StartLongitude.Replace(".", ","), out huntLng);
                item.Distance = Math.Round(GeolocationService.CalculateDistance(lat, lng, huntLat, huntLng));
            }
            return hunts;
        }
    }
}