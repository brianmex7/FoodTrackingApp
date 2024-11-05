using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Food
    {
        [Key]
        public int FoodId { get; set; }
        public int FdcId { get; set; }
        public required string FoodName { get; set; }
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fats { get; set; }
    }
}
