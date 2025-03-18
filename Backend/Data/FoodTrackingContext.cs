using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class FoodTrackingContext : DbContext
    {
        public FoodTrackingContext(DbContextOptions<FoodTrackingContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<Favorites> Favorites { get; set; }
        public DbSet<DailyCalories> DailyCalories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.UserId);
        }
    }
}
