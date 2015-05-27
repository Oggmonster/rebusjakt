using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class Hunt
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string UserId { get; set; }

        public string Description { get; set; }

        [Required(ErrorMessage="Du skriva in startplats")]
        public string StartLocation { get; set; }

        [Required(ErrorMessage = "Du måste välja startposition")]
        public string StartLatitude { get; set; }

        public string StartLongitude { get; set; }

        public bool IsActive { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }

        public virtual ICollection<Riddle> Riddles { get; set; }
    }
}