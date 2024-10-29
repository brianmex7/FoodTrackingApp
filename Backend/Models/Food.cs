using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Food
    {
        [Key]

        public required string FdcId { get; set; }
        public required string FoodName { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fats { get; set; }
    }
}
