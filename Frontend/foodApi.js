const urlKey = "g25JFIap5n0u6RJxnvp5QEDbh7p9RRPvMPhSeGyl";

const fetchFood = (fdcId) => {
  const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${urlKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return {
        name: data.description,
        calories: findNutrientValue(data, "Energy"),
        carbs: findNutrientValue(data, "Carbohydrate, by difference"),
        protein: findNutrientValue(data, "Protein"),
        fats: findNutrientValue(data, "Total lipid (fat)"),
      };
    });
};

const searchFood = (searchTerm) => {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchTerm}&api_key=${urlKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const searchResults = data.foods;
      const nutritionPromises = searchResults.map((result) => {
        return fetchFood(result.fdcId);
      });
      Promise.all(nutritionPromises).then((nutritionFacts) => {
        displayNutritionTable(searchResults, nutritionFacts);
      });
    })
    .catch((error) => {
      console.error("Error searching for food:", error);
      alert("Error with database");
    });
};

const findNutrientValue = (data, nutrientName) => {
  const nutrient = data.foodNutrients.find(
    (nutrient) => nutrient.nutrient.name === nutrientName
  );
  return nutrient ? nutrient.amount : null;
};
