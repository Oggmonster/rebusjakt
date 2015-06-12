using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Description { get; set; }

        public string ImageSrc { get; set; }

        /// <summary>
        /// text, number or multi
        /// </summary>
        public string AnswerType { get; set; }

        /// <summary>
        /// Answer options in JSON
        /// </summary>
        public string AnswerOptions { get; set; }

        [Required]
        public string Answer { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }

        public DateTime SortDate { get; set; }

        public int RiddleId { get; set; }

        public virtual Riddle Riddle { get; set; }

    }
}