using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key]
        
        public int UserId { get; set; }
        
        public required string Username { get; set; }
        
        public required string Email { get; set; }
        
        public required string Password { get; set; }
    }
}
