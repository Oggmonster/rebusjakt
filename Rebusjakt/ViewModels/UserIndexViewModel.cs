using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class UserIndexViewModel
    {
        public string UserName { get; set; }

        public List<Hunt> Hunts { get; set; }

        public List<UserScoreViewModel> UserScores { get; set; }
    }
}