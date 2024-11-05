using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly FoodTrackingContext _context;

        public FoodController(IConfiguration configuration, FoodTrackingContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddFood([FromBody] Food food)
        {
            string? connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString!))
            {
                await connection.OpenAsync();
                string query = "INSERT IGNORE INTO foods (fdcId, food_name, calories, protein, carbs, fats) VALUES (@fdc_id, @food_name, @calories, @protein, @carbs, @fats)";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@fdc_id", food.FdcId);
                    command.Parameters.AddWithValue("@food_name", food.FoodName);
                    command.Parameters.AddWithValue("@calories", food.Calories);
                    command.Parameters.AddWithValue("@protein", food.Protein);
                    command.Parameters.AddWithValue("@carbs", food.Carbs);
                    command.Parameters.AddWithValue("@fats", food.Fats);
                    await command.ExecuteNonQueryAsync();
                }
            }
            return Ok(new { message = "Food Item Added!!" });
        }
        [HttpPost("AddToFavorites")]
        public async Task<IActionResult> AddToFavorites([FromBody] Food food)
        {
            int userId = 1;
            int foodId;

            var existingFood = await _context.Foods.FirstOrDefaultAsync(f => f.FdcId == food.FdcId);

            if (existingFood != null)
            {
                foodId = existingFood.FoodId;
            }
            else
            {
                var newFood = new Food
                {
                    FdcId = food.FdcId,
                    FoodName = food.FoodName,
                    Calories = food.Calories,
                    Protein = food.Protein,
                    Carbs = food.Carbs,
                    Fats = food.Fats
                }; _context.Foods.Add(newFood);
                await _context.SaveChangesAsync();
                foodId = newFood.FoodId;
            }
            var existingFavorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.FoodId == foodId);

            if (existingFavorite == null)
            {
                var favorite = new Favorites
                {
                    UserId = userId,
                    FoodId = foodId
                };
                _context.Favorites.Add(favorite);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Food Item To Favorite" });
            }
            return Ok(new { message = "Food Already Exists" });
        }
    }
}
