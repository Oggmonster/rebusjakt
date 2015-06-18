using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Rebusjakt
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "User Profile",
                url: "u/{id}",
                defaults: new { controller = "User", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Hunt page",
                url: "jakt/{id}/{slug}",
                defaults: new { controller = "Hunt", action = "Index", id = UrlParameter.Optional, slug = UrlParameter.Optional }
                );

            routes.MapRoute(
                name: "Guide",
                url: "guide",
                defaults : new { controller = "Home", action = "HowTo" }
                );

            routes.MapRoute(
                name: "Om",
                url: "om",
                defaults: new { controller = "Home", action = "About" }
                );

            routes.MapRoute(
                name: "Errorpage",
                url: "error",
                defaults: new { controller = "Home", action = "Error" }
                );

            routes.MapRoute(
                name: "NotFoundPage",
                url: "notfound",
                defaults: new { controller = "Home", action = "NotFound" }
                );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
