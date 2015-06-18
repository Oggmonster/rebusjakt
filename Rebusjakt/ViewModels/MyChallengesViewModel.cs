using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class MyChallengesViewModel
    {
        public List<Challenge> Created { get; set; }
        public List<Challenge> Challenged { get; set; }
    }
}