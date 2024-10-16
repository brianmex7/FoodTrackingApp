using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FoodTrackingContext _context;

        public UsersController(FoodTrackingContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/users
        [HttpPost("signup")]
        public async Task<ActionResult<User>> PostUser(User user)
        {

            if (string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Please enter your password");
            }
            user.Password = HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            user.Password = null;
            return CreatedAtAction(nameof(GetUsers), new { id = user.UserId }, user);
        }

        private string HashPassword(string password)
        {

            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Password cannot be null or empty.");
            }
            using (SHA256 sha256Hash = SHA256.Create())  // Properly create the SHA256 instance
            {
                // Convert the input string to a byte array
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Convert the byte array to a string (hexadecimal format)
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));  // Converts each byte to a hex string
                }
                return builder.ToString();
            }
        }
    }
}
