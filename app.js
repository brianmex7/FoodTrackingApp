const foodTracker = document.getElementById("foodTracker");
const autocompleteResults = document.getElementById("autocompleteResults");
let fdcId;
const urlKey = "g25JFIap5n0u6RJxnvp5QEDbh7p9RRPvMPhSeGyl";

// //Retrieve the data based on Id
const fetchFood = (fdcId) => {
  const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${urlKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return {
        name: data.description,
        carbs: findNutrientValue(data, "Carbohydrate, by difference"),
        protein: findNutrientValue(data, "Protein"),
        fats: findNutrientValue(data, "Total lipid (fat)"),
      };
    });
};

const displayNutrition = async (fdcId) => {
  try {
    const nutrition = await fetchFood(fdcId);
    let selectedAmount = 100; // Default selected amount

    const updateNutrition = () => {
      const carbsElement = document.querySelector(".card-subtitle.carbs");
      const proteinElement = document.querySelector(".card-subtitle.protein");
      const fatsElement = document.querySelector(".card-subtitle.fats");

      const carbsValue = nutrition.carbs * (selectedAmount / 100);
      const proteinValue = nutrition.protein * (selectedAmount / 100);
      const fatsValue = nutrition.fats * (selectedAmount / 100);

      carbsElement.textContent = carbsValue.toFixed(2);
      proteinElement.textContent = proteinValue.toFixed(2);
      fatsElement.textContent = fatsValue.toFixed(2);
    };

    const nutriHTMLString = `
      <li class="result-card">
        <h3>${nutrition.name}</h3>
        <p class="card-title">Carbs: <span class="card-subtitle carbs">${nutrition.carbs}</span>g</p>
        <p class="card-title">Protein: <span class="card-subtitle protein">${nutrition.protein}</span>g</p>
        <p class="card-title">Fats: <span class="card-subtitle fats">${nutrition.fats}</span>g</p>
        <select class="nutrient-select" id="intake-select">
          <option value="100">100g</option>
          <option value="120">1 cup (120 g)</option>
          <option value="10">10g</option>
          <!-- Add more options as needed -->
        </select>
        <button id="add-nutrition">Add</button>
      </li>
    `;

    const foodTracker = document.getElementById("foodTracker");
    foodTracker.innerHTML = nutriHTMLString;

    const intakeSelect = document.getElementById("intake-select");
    intakeSelect.addEventListener("change", (event) => {
      selectedAmount = parseFloat(event.target.value);
      updateNutrition();
    });

    updateNutrition();
  } catch (error) {
    console.error("Error fetching food data:", error);
    foodTracker.innerHTML = "Error fetching food data. Please try again.";
  }
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
const handleSearchButtonClick = (inputId) => {
  const inputField = document.getElementById(inputId);
  const searchTerm = document.getElementById(inputId).value.trim();
  if (searchTerm) {
    searchFood(searchTerm);
    inputField.value = "";
  } else {
    alert("Please enter a search term.");
  }
};
//Adding all 3 buttons of search
document
  .getElementById("breakfastSearchButton")
  .addEventListener("click", function () {
    handleSearchButtonClick("breakfastSearch");
  });
document
  .getElementById("lunchSearchButton")
  .addEventListener("click", function () {
    handleSearchButtonClick("lunchSearch");
  });
document
  .getElementById("dinnerSearchButton")
  .addEventListener("click", function () {
    handleSearchButtonClick("dinnerSearch");
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
    row.insertCell().textContent = result.description.toUpperCase();
    row.insertCell().textContent = nutritionFacts[index].carbs;
    row.insertCell().textContent = nutritionFacts[index].protein;
    row.insertCell().textContent = nutritionFacts[index].fats;
    const addButtonCell = row.insertCell();
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.classList.add("add-button");
    addButton.addEventListener("click", function () {
      const foodItemId = result.fdcId;
      displayNutrition(foodItemId);
      console.log(foodItemId);
      table.remove();
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
      displayNutrition(result.fdcId);
      clearSearchResults();
    });
    searchResultsList.appendChild(listItem);
  });
};

const clearSearchResults = () => {
  const searchResultsList = document.getElementById("searchResults");
  searchResultsList.innerHTML = "";
};

//////MODAL////
const modal = document.getElementById("myModal");
const btn = document.getElementById("caloriesModal");
const span = document.getElementsByClassName("close")[0];

btn.onclick = () => {
  modal.style.display = "block";
};

span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
