using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class HuntIndexViewModel
    {
        public Hunt Hunt { get; set; }

        public List<HuntReviewViewModel> HuntReviews { get; set; }

        public List<UserScoreViewModel> TopScores { get; set; }
    }
}