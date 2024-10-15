import { fetchFood } from "./foodApi.js";

const displayNutrition = async (fdcId) => {
  try {
    const nutrition = await fetchFood(fdcId);
    let selectedAmount = 100; // Default amount

    const foodTracker = document.getElementById("foodTracker");

    // Function to update nutritional values
    const updateNutrition = () => {
      const carbsValue = (nutrition.carbs * selectedAmount) / 100;
      const proteinValue = (nutrition.protein * selectedAmount) / 100;
      const fatsValue = (nutrition.fats * selectedAmount) / 100;
      const caloriesValue = (nutrition.calories * selectedAmount) / 100;

      document.getElementById(
        "carbs-value"
      ).textContent = `${carbsValue.toFixed(1)}g`;
      document.getElementById(
        "protein-value"
      ).textContent = `${proteinValue.toFixed(1)}g`;
      document.getElementById("fats-value").textContent = `${fatsValue.toFixed(
        1
      )}g`;
      document.getElementById(
        "calories-value"
      ).textContent = `${caloriesValue.toFixed(1)}g`;
    };

    // HTML template for displaying the nutrition
    const nutriHTMLString = `
      <div class="result-card" id="resultCard">
        <h3>${nutrition.name}</h3>
        <p>Calories: <span id="calories-value">${nutrition.calories}</span></p>
        <p>Carbs: <span id="carbs-value">${nutrition.carbs}</span></p>
        <p>Protein: <span id="protein-value">${nutrition.protein}</span></p>
        <p>Fats: <span id="fats-value">${nutrition.fats}</span></p>
        <select id="intake-select">
          <option value="100">100g</option>
          <option value="120">1 cup (120g)</option>
          <option value="10">10g</option>
          <option value="30">1oz (30g)</option>
        </select>
        <button id="add-nutrition" class="add-button">Add</button>
      </div>
    `;

    // Display nutrition data on the page
    foodTracker.innerHTML = nutriHTMLString;

    // Event listener for intake selection
    document
      .getElementById("intake-select")
      .addEventListener("change", (event) => {
        selectedAmount = parseFloat(event.target.value);
        updateNutrition();
      });

    // Event listener for adding food entry
    document.getElementById("add-nutrition").addEventListener("click", () => {
      if (totalCaloriesRequired === null || totalCaloriesRequired === 0) {
        alert("Please calculate your calories first.");
        return;
      }

      const foodCalories = (nutrition.calories * selectedAmount) / 100;
      consumedCalories += foodCalories;

      updateActivityRing();
      updateNutrientRing("protein", nutrition.protein);
      updateNutrientRing("fats", nutrition.fats);
      updateNutrientRing("carbs", nutrition.carbs);

      const nutritionData = {
        name: nutrition.name,
        calories: foodCalories,
        carbs: (nutrition.carbs * selectedAmount) / 100,
        protein: (nutrition.protein * selectedAmount) / 100,
        fats: (nutrition.fats * selectedAmount) / 100,
        amount: selectedAmount,
      };

      // Save entry to localStorage
      let entries = JSON.parse(localStorage.getItem("nutritionEntries")) || [];
      entries.push(nutritionData);
      localStorage.setItem("nutritionEntries", JSON.stringify(entries));

      document.getElementById("resultCard").remove();
      showRing();
    });

    // Initial update for the default selected amount (100g)
    updateNutrition();
  } catch (error) {
    console.error("Error fetching food data:", error);
    foodTracker.innerHTML = "Error fetching food data. Please try again.";
  }
};
