using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class RiddleAdminViewModel
    {
        public int HuntId { get; set; }

        public string HuntName { get; set; }

        public List<RiddleViewModel> Riddles { get; set; }
    }
}