using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class HuntReview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Description { get; set; }

        public bool IsPositive { get; set; }

        public int HuntId { get; set; }

        [Required]
        public string UserId { get; set; }

        public virtual User User { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}