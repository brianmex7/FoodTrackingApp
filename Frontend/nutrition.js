let selectedAmount = 100; // Default selected amount

function displayNutrition(nutrition) {
  const carbsElement = document.getElementById("carbs-value");
  const proteinElement = document.getElementById("protein-value");
  const fatsElement = document.getElementById("fats-value");
  const caloriesElement = document.getElementById("calories-value");

  const carbsValue = nutrition.carbs * (selectedAmount / 100);
  const proteinValue = nutrition.protein * (selectedAmount / 100);
  const fatsValue = nutrition.fats * (selectedAmount / 100);
  const caloriesValue = nutrition.calories * (selectedAmount / 100);

  carbsElement.textContent = carbsValue.toFixed(1) + "g";
  proteinElement.textContent = proteinValue.toFixed(1) + "g";
  fatsElement.textContent = fatsValue.toFixed(1) + "g";
  caloriesElement.textContent = caloriesValue.toFixed(1) + "g";
}

function updateNutrientRing(nutrient, amount) {
  const maxAmount = 100;
  let percentage = (amount / maxAmount) * 100;
  percentage = Math.min(percentage, 100);

  switch (nutrient) {
    case "protein":
      const proteinCircle = document.getElementById("proteinCircle");
      proteinCircle.style.strokeDasharray = `${percentage}, 100`;
      proteinCircle.style.stroke = "#ff0000";
      break;
    case "fats":
      const fatsCircle = document.getElementById("fatsCircle");
      fatsCircle.style.strokeDasharray = `${percentage}, 100`;
      fatsCircle.style.stroke = "#00ff00";
      break;
    case "carbs":
      const carbsCircle = document.getElementById("carbsCircle");
      carbsCircle.style.strokeDasharray = `${percentage}, 100`;
      carbsCircle.style.stroke = "#f4d03f";
      break;
  }
}
