using Rebusjakt.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace Rebusjakt.Controllers
{
    public class SiteMapController : Controller
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        // GET: SiteMap
        public ActionResult Index()
        {
            XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
            const string huntUrl = "http://rebusjakt.se/jakt/{0}/{1}";
            const string userUrl = "http://rebusjakt.se/u/{0}";
            var hunts = unitOfWork.HuntRepository.Get().Where(h => h.IsActive).ToList();
            var users = unitOfWork.UserRepository.Get().ToList();
            var urls = new List<string>();
            urls.Add("http://rebusjakt.se");
            urls.Add("http://rebusjakt.se/om");
            urls.Add("http://rebusjakt.se/guide");

            foreach (var item in hunts)
            {
                urls.Add(string.Format(huntUrl, item.Id, item.Slug));
            }
            foreach (var item in users)
            {
                urls.Add(string.Format(userUrl, item.Slug));                
            }

            var sitemap = new XDocument(
            new XDeclaration("1.0", "utf-8", "yes"),
            new XElement(ns + "urlset",
                from url in urls
                select
                new XElement(ns + "url",
                    new XElement(ns + "loc", url),
                    new XElement(ns + "lastmod", String.Format("{0:yyyy-MM-dd}", DateTime.Now)),
                    new XElement(ns + "changefreq", "always"),
                    new XElement(ns + "priority", "0.5")
            )));
            return Content("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + sitemap.ToString(), "text/xml");
        }

        protected override void Dispose(bool disposing)
        {
            unitOfWork.Dispose();
            base.Dispose(disposing);
        }
    }
}