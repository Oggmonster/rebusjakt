using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class RiddleViewModel
    {
        public int Id { get; set; }

        public int HuntId { get; set; }

        public string Description { get; set; }

        public string Answer { get; set; }

        public string LocationName { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime SortDate { get; set; }

        public List<QuestionViewModel> Questions { get; set; }
    }
}