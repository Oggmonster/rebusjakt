using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Rebusjakt.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Slug { get; set; }

        public string Email { get; set; }

    }
}