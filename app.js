const foodTracker = document.getElementById("foodTracker");
const autocompleteResults = document.getElementById("autocompleteResults");
let fdcId;
const urlKey = "g25JFIap5n0u6RJxnvp5QEDbh7p9RRPvMPhSeGyl";
let consumedCalories = 0;
let totalCaloriesRequired = null;

// //Retrieve the data based on Id
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

const displayNutrition = async (fdcId) => {
  try {
    const nutrition = await fetchFood(fdcId);
    let selectedAmount = 100; // Default selected amount

    const updateNutrition = () => {
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
    };

    const nutriHTMLString = `
      <div class="result-card" id="resultCard">
        <h3>${nutrition.name}</h3>
        <p class="card-title">Calories: <span class="card-subtitle" id="calories-value">${nutrition.calories}</span></p>
        <p class="card-title">Carbs: <span class="card-subtitle" id="carbs-value">${nutrition.carbs}</span></p>
        <p class="card-title">Protein: <span class="card-subtitle" id="protein-value">${nutrition.protein}</span></p>
        <p class="card-title">Fats: <span class="card-subtitle" id="fats-value">${nutrition.fats}</span></p>
        <select class="nutrient-select" id="intake-select">
          <option value="100">100g</option>
          <option value="120">1 cup (120 g)</option>
          <option value="10">10g</option>
          <option value="30">1oz</option>
        </select>
        <button id="add-nutrition" class="add-button">Add</button>
      </div>
    `;

    const foodTracker = document.getElementById("foodTracker");
    foodTracker.innerHTML = nutriHTMLString;

    const intakeSelect = document.getElementById("intake-select");
    intakeSelect.addEventListener("change", (event) => {
      console.log(event.target.value);
      selectedAmount = parseFloat(event.target.value);
      updateNutrition();
    });

    const addButton = document.getElementById("add-nutrition");
    addButton.addEventListener("click", () => {
      if (totalCaloriesRequired === null || totalCaloriesRequired === 0) {
        alert("Please calculate your calories first");
      }
      const resultCard = document.getElementById("resultCard");
      if (resultCard) {
        resultCard.remove();
        showRing();
        const nutritionData = {
          name: nutrition.name,
          calories: nutrition.calories * (selectedAmount / 100),
          carbs: nutrition.carbs * (selectedAmount / 100),
          protein: nutrition.protein * (selectedAmount / 100),
          fats: nutrition.fats * (selectedAmount / 100),
          amount: selectedAmount,
        };
        const foodCalories = nutrition.calories * (selectedAmount / 100);
        consumedCalories += foodCalories;

        updateActivityRing();

        updateNutrientRing("protein", nutrition.protein);
        updateNutrientRing("fats", nutrition.fats);
        updateNutrientRing("carbs", nutrition.carbs);

        let entries = localStorage.getItem("nutritionEntries");
        if (entries) {
          entries = JSON.parse(entries);
        } else {
          entries = [];
        }
        entries.push(nutritionData);
        localStorage.setItem("nutritionEntries", JSON.stringify(entries));
      }
    });
    updateNutrition();
  } catch (error) {
    console.error("Error fetching food data:", error);
    foodTracker.innerHTML = "Error fetching food data. Please try again.";
  }
};
function updateCaloriesDisplay(calories) {
  const caloriesDisplayElement = document.getElementById("result");
  if (caloriesDisplayElement) {
    caloriesDisplayElement.textContent = `${calories.toFixed(0)}`;
  }
}

//FIND THE NAME INSIDE THE API OBJECT
const findNutrientValue = (data, nutrientName) => {
  const nutrient = data.foodNutrients.find(
    (nutrient) => nutrient.nutrient.name === nutrientName
  );
  return nutrient ? nutrient.amount : null;
};

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
  const itemsPerPage = 10;
  let currentPage = 1;

  const foodTracker = document.getElementById("foodTracker");
  foodTracker.innerHTML = "";

  const renderTable = () => {
    foodTracker.innerHTML = ""; // Clear previous content
    const table = document.createElement("table");
    table.classList.add("nutrient-table");
    const headerRow = table.insertRow();
    const headers = ["Name", "Calories", "Carbs", "Protein", "Fats"];
    headers.forEach((headerText) => {
      const header = document.createElement("th");
      header.textContent = headerText;
      headerRow.appendChild(header);
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, searchResults.length);
    const pageResults = searchResults.slice(startIndex, endIndex);
    const pageNutritionFacts = nutritionFacts.slice(startIndex, endIndex);

    pageResults.forEach((result, index) => {
      const row = table.insertRow();
      row.insertCell().textContent = result.description.toUpperCase();
      row.insertCell().textContent = pageNutritionFacts[index].calories;
      row.insertCell().textContent = pageNutritionFacts[index].carbs;
      row.insertCell().textContent = pageNutritionFacts[index].protein;
      row.insertCell().textContent = pageNutritionFacts[index].fats;
      const addButtonCell = row.insertCell();
      const addHeartCell = row.insertCell();
      const addButton = document.createElement("button");
      addButton.textContent = "Add";
      addButton.classList.add("add-button");
      addButton.addEventListener("click", () => {
        const foodItemId = result.fdcId;
        displayNutrition(foodItemId);
        console.log(foodItemId);
        table.remove();
      });

      const addHeart = document.createElement("button");
      addHeart.innerHTML = "&#9829";
      addHeart.classList.add("heart-button");
      addHeart.addEventListener("click", () => {
        addHeart.classList.toggle("clicked");
      });
      addButtonCell.appendChild(addButton);
      addHeartCell.appendChild(addHeart);
    });

    foodTracker.appendChild(table);
    renderPagination();
  };

  const renderPagination = () => {
    const pagination = document.createElement("div");
    pagination.className = "pagination";

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = "add-button";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "add-button";
    nextButton.disabled =
      currentPage >= Math.ceil(searchResults.length / itemsPerPage);
    nextButton.addEventListener("click", () => {
      if (currentPage < Math.ceil(searchResults.length / itemsPerPage)) {
        currentPage++;
        renderTable();
      }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
    foodTracker.appendChild(pagination);
  };
  hideRing();
  renderTable();
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

function updateActivityRing() {
  const circle = document.querySelector(".circle");
  const percentage = 100 * (1 - consumedCalories / totalCaloriesRequired);
  const strokeLength = 100 - percentage;

  circle.style.strokeDasharray = `${strokeLength} 100`;
  circle.style.strokeDashoffset = 0;

  totalCaloriesRequired -= consumedCalories;

  consumedCalories = 0;

  if (totalCaloriesRequired <= 0) {
    totalCaloriesRequired = 0;
    updateCaloriesDisplay(totalCaloriesRequired);
    const congratsModal = document.getElementById("congratsModal");
    congratsModal.style.display = "block";
    const span = document.getElementsByClassName("congratsClose")[0];

    span.onclick = () => {
      congratsModal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target == modal) {
        congratsModal.style.display = "none";
      }
    };
  }

  updateCaloriesDisplay(totalCaloriesRequired);

  console.log(
    `Current Calories: ${consumedCalories} / ${totalCaloriesRequired}`
  );
}

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

//Mifflin St Jeor Formula
const form = document.getElementById("bmrCalc");
const trackingRing = document.getElementById("trackingRing");
const resultCard = document.getElementById("resultCard");
const resultElement = document.getElementById("result");

function calculateCalories() {
  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;

  if (gender === "male") {
    totalCaloriesRequired =
      88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    totalCaloriesRequired =
      447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  consumedCalories = 0;
  updateActivityRing();
  return totalCaloriesRequired;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let result = calculateCalories();
  currentCalories = result;
  displayResult(result);
  localStorage.setItem("caloriesResult", JSON.stringify(result));
  modal.style.display = "none";
});

function displayResult(calories) {
  resultElement.textContent = calories.toFixed(0);
}

function hideRing() {
  trackingRing.style.display = "none";
}

function showRing() {
  trackingRing.style.display = "block";
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

const OneDay = 24 * 60 * 60 * 1000;

function resetData() {
  consumedCalories = 0;
  localStorage.removeItem("nutritionEntries");
  localStorage.setItem("lastResetTime", new Date().getTime());
}

function checkResetTime() {
  const lastResetTime = localStorage.getItem("lastResetTime");
  if (!lastResetTime) {
    resetData();
    return;
  }
  const currentTime = new Date().getTime();
  const timeSinceLastReset = currentTime - parseInt(lastResetTime);

  if (timeSinceLastReset >= OneDay) {
    resetData();
  }
}

window.onload = function () {
  checkResetTime();
};
