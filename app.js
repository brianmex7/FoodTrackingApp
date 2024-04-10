const foodTracker = document.getElementById("foodTracker");
const autocompleteResults = document.getElementById("autocompleteResults");
let fdcId;
const urlKey = "g25JFIap5n0u6RJxnvp5QEDbh7p9RRPvMPhSeGyl";

//Retrieve Food ID from search
const fetchFoodId = (foodName) => {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${urlKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Assuming the first item in the search result matches the food you're looking for
      const fdcId = data.foods[0].fdcId;
      console.log("FDC ID:", fdcId);
      fetchFood(fdcId);
    })
    .catch((error) => {
      console.error("Error fetching food data:", error);
    });
};

// //Retrieve the data based on Id
const fetchFood = (fdcId) => {
  const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${urlKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return {
        carbs: findNutrientValue(data, "Carbohydrate, by difference"),
        protein: findNutrientValue(data, "Protein"),
        fats: findNutrientValue(data, "Total lipid (fat)"),
      };
    });
};

const displayNutrition = (nutrition) => {
  const nutriHTMLString = nutrition
    .map(
      (nutri) =>
        `
  <li class="card">
  <h3>${nutri.name}</h3>
    <p class="card-title">Carbs: <span class="card-subtitle">${nutri.carbs}</span>g</p>
    <p class="card-title">Protein: <span class="card-subtitle">${nutri.protein}</span>g</p>
    <p class="card-title">Fats: <span class="card-subtitle">${nutri.fats}</span>g</p>
    <button class="add-button">Add</button>
  </li>
  `
    )
    .join("");
  foodTracker.innerHTML = nutriHTMLString;
};

//FIND THE NAME INSIDE THE API OBJECT
const findNutrientValue = (data, nutrientName) => {
  const nutrient = data.foodNutrients.find(
    (nutrient) => nutrient.nutrient.name === nutrientName
  );
  return nutrient ? nutrient.amount : null;
};

//Nutrient 8 Carbs
//Nutrient 5 Protein
//Nutrient 6 Fats
//Nutrient 2 atwater general factor system = calories
//Based on 100g

//SEARCH FOR FOOD ITEM
document
  .getElementById("breakfastSearchButton")
  .addEventListener("click", function () {
    const searchTerm = document.getElementById("breakfastSearch").value.trim();
    if (searchTerm) {
      searchFood(searchTerm);
      console.log("button works");
    } else {
      alert("Please enter a search term.");
    }
  });

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

const displayNutritionTable = (searchResults, nutritionFacts) => {
  const table = document.createElement("table");
  table.classList.add("nutrient-table");
  const headerRow = table.insertRow();
  const headers = ["Name", "Carbs", "Protein", "Fats"];
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  searchResults.forEach((result, index) => {
    const row = table.insertRow();
    row.insertCell().textContent = result.description;
    row.insertCell().textContent = nutritionFacts[index].carbs;
    row.insertCell().textContent = nutritionFacts[index].protein;
    row.insertCell().textContent = nutritionFacts[index].fats;
    const addButtonCell = row.insertCell();
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.classList.add("add-button");
    addButton.addEventListener("click", function () {
      // Add functionality when the "Add" button is clicked
      // For example, you can add the item to a list, etc.
      alert("Added: " + result.description);
    });
    addButtonCell.appendChild(addButton);
  });

  const foodTracker = document.getElementById("foodTracker");
  foodTracker.innerHTML = "";
  foodTracker.appendChild(table);
};

const displaySearchResults = (results) => {
  const searchResultsList = document.getElementById("searchResults");
  searchResultsList.innerHTML = "";

  results.forEach((result) => {
    const listItem = document.createElement("li");
    listItem.textContent = result.description;
    listItem.classList.add("search-list-item");
    listItem.addEventListener("click", function () {
      fetchFood(result.fdcId);
      clearSearchResults();
    });
    searchResultsList.appendChild(listItem);
  });
};

document
  .getElementsByClassName("add-button")
  .addEventListener("click", function () {});

const clearSearchResults = () => {
  const searchResultsList = document.getElementById("searchResults");
  searchResultsList.innerHTML = "";
};
