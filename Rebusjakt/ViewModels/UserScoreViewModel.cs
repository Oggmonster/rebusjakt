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

        public string HuntName { get; set; }

        public string HuntUrl { get; set; }

        public DateTime CreatedDate { get; set; }

        public string TimeDisplay
        {
            get
            {
                var timeSpan = new TimeSpan(0, 0, TimeInSeconds);

                return string.Format("{0}.{1}.{2}", timeSpan.Hours, (timeSpan.Minutes < 10 ? "0" + timeSpan.Minutes : timeSpan.Minutes.ToString()), (timeSpan.Seconds < 10 ? "0" + timeSpan.Seconds : timeSpan.Seconds.ToString()));
            }
        }

        

    }
}