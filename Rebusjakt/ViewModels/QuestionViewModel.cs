using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rebusjakt.ViewModels
{
    public class QuestionViewModel
    {
        public int Id { get; set; }

        public int RiddleId { get; set; }

        public string Description { get; set; }

        /// <summary>
        /// text, number or multi
        /// </summary>
        public string AnswerType { get; set; }

        /// <summary>
        /// Answer options in JSON
        /// </summary>
        public string AnswerOptions { get; set; }

        public string Answer { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime SortDate { get; set; }

    }
}