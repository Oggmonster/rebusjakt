using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class UserScore
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        public virtual User User { get; set; }
        
        [Required]
        public int HuntId { get; set; }

        public virtual Hunt Hunt { get; set; }

        [Required]
        public int TimeInSeconds { get; set; }

        [Required]
        public int Score { get; set; }

        public DateTime CreatedDate { get; set; }

    }
}