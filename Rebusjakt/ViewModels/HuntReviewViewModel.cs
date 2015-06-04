using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class HuntReviewViewModel
    {
        public string UserName { get; set; }

        public string UserUrl { get; set; }

        public bool IsPositive { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}