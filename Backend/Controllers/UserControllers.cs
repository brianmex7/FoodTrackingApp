using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // Add this
using MySql.Data.MySqlClient;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FoodTrackingContext _context;
        private readonly IConfiguration _configuration; // Keep this as required

        public UsersController(FoodTrackingContext context, IConfiguration configuration) // Inject IConfiguration
        {
            _context = context;
            _configuration = configuration; // Assign to field
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/users/signup
        [HttpPost("signup")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Password cannot be null or empty.");
            }

            // Directly save the password as provided (without hashing)
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.UserId }, user);
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
        {
            if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email && u.Password == loginRequest.Password);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new { username = user.Username });
        }

        [HttpPost("saveDailyCalories")]
        public async Task<IActionResult> SaveDailyCalories([FromBody] DailyCalories dailyCalories)
        {
            var existingRecord = await _context.DailyCalories
                .FirstOrDefaultAsync(c => c.UserId == dailyCalories.UserId && c.Date.Date == DateTime.UtcNow.Date);

            if (existingRecord == null)
            {
                _context.DailyCalories.Add(dailyCalories);
            }
            else
            {
                existingRecord.Calories = dailyCalories.Calories;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Daily calories saved." });
        }

        [HttpGet("getDailyCalories/{userId}")]
        public async Task<ActionResult<int>> GetDailyCalories(int userId)
        {
            var latestCalories = await _context.DailyCalories
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.Date)
                .Select(c => c.Calories)
                .FirstOrDefaultAsync();

            return Ok(latestCalories);
        }

    }
}
