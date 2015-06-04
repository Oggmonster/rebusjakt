using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class UserScoreViewModel
    {
        public string UserId { get; set; }

        public string UserName { get; set; }

        public string UserUrl { get; set; }

        public int TimeInSeconds { get; set; }

        public int Score { get; set; }

        public DateTime CreatedDate { get; set; }


    }
}