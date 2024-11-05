using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Favorites
    {
        [Key]

        public int UserId { get; set; }
        public int FoodId { get; set; }

    }
}