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
      return {
        fdcId: data.fdcId,
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

    //send food object to table
    const sendToBackend = async (data) => {
      try {
        const response = await fetch("http://localhost:5038/api/food/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log("Data successfully sent to backend:", data);
        } else {
          console.error("Failed to send data to backend:", response, data);
        }
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    };

    const addToFavorites = async (data) => {
      try {
        const response = await fetch(
          "http://localhost:5038/api/food/AddToFavorites",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.log("error adding to favorites", error);
      }
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
        <button id="add-to-favorites" class="heart-button">&#9829;</button>
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
          FdcId: nutrition.fdcId,
          FoodName: nutrition.name,
          Calories: nutrition.calories,
          Protein: nutrition.protein,
          Carbs: nutrition.carbs,
          Fats: nutrition.fats,
        };
        const foodCalories = nutrition.calories * (selectedAmount / 100);
        consumedCalories += foodCalories;
        updateActivityRing();
        updateNutrientRing("protein", nutrition.protein);
        updateNutrientRing("fats", nutrition.fats);
        updateNutrientRing("carbs", nutrition.carbs);
        sendToBackend(nutritionData);
      }
      const addHeart = document.getElementById("add-to-favorites");
      addHeart.addEventListener("click", () => {
        addHeart.classList.toggle("clicked");
      });
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
        displayNutrition(result.fdcId);
        table.remove();
      });

      addButtonCell.appendChild(addButton);
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
const caloriesModal = document.getElementById("caloriesModal");
const signUpModal = document.getElementById("signUpModal");
const signInModal = document.getElementById("signInModal");

const caloriesBtn = document.getElementById("caloriesBtn");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");

const signUpClose = document.getElementById("signUpClose");
const caloriesClose = document.getElementById("caloriesClose");
const signInClose = document.getElementById("signInClose");

const openModal = (modal) => {
  modal.style.display = "block";
};

const closeModal = (modal) => {
  modal.style.display = "none";
};

caloriesBtn.onclick = () => {
  openModal(caloriesModal);
};

caloriesClose.onclick = () => {
  closeModal(caloriesModal);
};

signUpClose.onclick = () => {
  closeModal(signUpModal);
};

signUpBtn.onclick = () => {
  openModal(signUpModal);
};

signInBtn.onclick = () => {
  openModal(signInModal);
};

signInClose.onclick = () => {
  closeModal(signInModal);
};

window.onclick = (event) => {
  if (event.target == signInModal) {
    closeModal(signInModal);
  } else if (event.target == signUpModal) {
    closeModal(signUpModal);
  } else if (event.target == caloriesModal) {
    closeModal(caloriesModal);
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
  closeModal(caloriesModal);
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

//SIGNUP OBJECT
const signUpForm = document.getElementById("signUpForm");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signUpUsername").value;
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;

  const userData = {
    username: username,
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:5038/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the error message if any
      console.log("Failed to create user: ", errorMessage);
      return;
    }

    const responseText = await response.text();
    if (responseText) {
      const result = JSON.parse(responseText); // Parse only if there's content
      console.log("User created successfully", result);
      alert("Sign up successful");
    } else {
      console.log("No response body");
    }
  } catch (error) {
    console.log("Error signing up: ", error);
  }

  signUpForm.reset();
  closeModal(signUpModal);
});

document
  .getElementById("signInForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;

    try {
      const response = await fetch("http://localhost:5038/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const username = data.username;
        console.log("Logged in as:", username);

        document.getElementById("signUpBtn").style.display = "none";
        document.getElementById("signInBtn").style.display = "none";
        const userDisplay = document.getElementById("userDisplay");
        userDisplay.style.display = "inline";
        userDisplay.textContent = username;

        closeModal(signInModal);
      } else if (response.status === 400) {
        alert("Please check your email and password.");
      } else {
        alert("Sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred during sign-in.");
    }
  });
