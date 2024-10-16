using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class FoodTrackingContext : DbContext
    {
        public FoodTrackingContext(DbContextOptions<FoodTrackingContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.UserId);
        }
    }
}
