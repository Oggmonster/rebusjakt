using Rebusjakt.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class Challenge
    {
        public string Id { get; set; }

        public int HuntId { get; set; }

        public string HuntSlug { get; set; }

        public string HuntName { get; set; }

        public string HuntTheme { get; set; }

        public string HuntDescription { get; set; }

        public string ChallengerUserId { get; set; }

        public string ChallengerName { get; set; }

        public string ChallengerUserName { get; set; }

        public string ChallengedUserId { get; set; }

        public string ChallengedEmail { get; set; }

        public string ChallengedName { get; set; }

        public string Message { get; set; }        

        public DateTime StartDate { get; set; }

        public bool IsAccepted { get; set; }

        public UserScoreViewModel UserScore { get; set;  }

    }
}