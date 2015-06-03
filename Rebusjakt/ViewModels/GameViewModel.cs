using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class GameViewModel
    {
        public int HuntId { get; set; }

        public string UserId { get; set; }

        public int TimeLimit { get; set; }

        public string HuntName { get; set; }

        public string EndLocation { get; set; }

        public string EndLatitude { get; set; }

        public string EndLongitude { get; set; }

        public bool IsRandom { get; set; }

        public List<RiddleViewModel> Riddles { get; set; }

        

    }
}