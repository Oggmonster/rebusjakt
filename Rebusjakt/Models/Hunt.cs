﻿using Nest;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class Hunt
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Slug { get; set; }

        public string UserId { get; set; }

        public string Description { get; set; }

        public string Theme { get; set; }

        [Required(ErrorMessage="Du måste skriva in startplats")]
        public string StartLocation { get; set; }

        [Required(ErrorMessage = "Du måste välja startposition")]
        public string StartLatitude { get; set; }

        public string StartLongitude { get; set; }

        [Required(ErrorMessage = "Du måste skriva in målgång")]
        public string EndLocation { get; set; }

        [Required(ErrorMessage = "Du måste välja målgångsposition")]
        public string EndLatitude { get; set; }

        public string EndLongitude { get; set; }

        public int TimeLimit { get; set; }

        public bool IsActive { get; set; }

        [NotMapped]
        [ElasticProperty(Type=FieldType.GeoPoint)]
        public Location Location
        {
            get
            {
                double lat = 0, lng = 0;
                double.TryParse(StartLatitude.Replace(".",","), out lat);
                double.TryParse(StartLongitude.Replace(".", ","), out lng);
                return new Location(lat, lng);
            }
        }

        [NotMapped]
        public double Distance { get; set; }

        //public DateTime? StartDate { get; set; }        

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }

        public virtual ICollection<Riddle> Riddles { get; set; }

    }

    public class Location
    {
        public Location(double lat, double lon)
        {
            Lat = lat;
            Lon = lon;
        }

        public double Lat { get; set; }
        public double Lon { get; set; }
    }
}