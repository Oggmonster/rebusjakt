using Rebusjakt.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rebusjakt.DAL
{
    public class RiddleContext : DbContext
    {
        public DbSet<Hunt> Hunts { get; set; }
        public DbSet<Riddle> Riddles { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<UserScore> UserScores { get; set; }
        public DbSet<HuntReview> HuntReviews { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Hunt>()
                .HasMany(h => h.Riddles)
                .WithRequired(r => r.Hunt)
                .HasForeignKey(r => r.HuntId);

            modelBuilder.Entity<Riddle>()
                .HasMany(r => r.Questions)
                .WithRequired(q => q.Riddle)
                .HasForeignKey(q => q.RiddleId);

            modelBuilder.Entity<User>()
                .ToTable("AspNetUsers");


        }
    }
}
