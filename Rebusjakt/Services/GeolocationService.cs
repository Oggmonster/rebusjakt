using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Web;

namespace Rebusjakt.Services
{
    public static class GeolocationService
    {
        public static double CalculateDistance(double sLatitude, double sLongitude, double eLatitude, double eLongitude)
        {
            var sCoord = new GeoCoordinate(sLatitude, sLongitude);
            var eCoord = new GeoCoordinate(eLatitude, eLongitude);
            return sCoord.GetDistanceTo(eCoord);
        }
        
    }
}