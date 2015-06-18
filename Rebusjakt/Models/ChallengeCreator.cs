using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class ChallengeCreator
    {
        public int HuntId { get; set; }
        public string UserId { get; set; }
        public string Message { get; set; }
        public DateTime StartDate { get; set; }
        public List<String> Emails { get; set; }
    }
}