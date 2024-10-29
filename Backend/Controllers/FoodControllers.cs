using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FoodController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddFood([FromBody] Food food)
        {
            string? connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString!))
            {
                await connection.OpenAsync();
                string query = "INSERT INTO foods (fdcId, food_name, calories, protein, carbs, fats) VALUES (@fdc_id, @food_name, @calories, @protein, @carbs, @fats)";
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
    }
}
