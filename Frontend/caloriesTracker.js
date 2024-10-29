let consumedCalories = 0;
let totalCaloriesRequired = null;

function calculateCalories(age, height, weight, gender) {
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

function updateActivityRing() {
  const circle = document.querySelector(".circle");
  const percentage = 100 * (1 - consumedCalories / totalCaloriesRequired);
  const strokeLength = 100 - percentage;

  circle.computedStyleMap.strokeDasharray = `${strokeLength} 100`;
  circle.style.strokeDashoffset = 0;

  totalCaloriesRequired -= consumedCalories;
  consumedCalories = 0;

  if (totalCaloriesRequired <= 0) {
    totalCaloriesRequired = 0;
    updateCaloriesRequired(totalCaloriesRequired);
    showCongratsModal();
  }
  updateCaloriesDisplay(totalCaloriesRequired);
}

function updateCaloriesDisplay(calories) {
  const caloriesDisplayElement = document.getElementById("result");
  if (caloriesDisplayElement) {
    caloriesDisplayElement.textContent = `${calories.toFixed(0)}`;
  }
}

document.getElementById("bmrCalc").addEventListener("submit", (e) => {
  e.preventDefault();
  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;

  let result = calculateCalories(age, height, weight, gender);
  displayResult(result);
  localStorage.setItem("caloriesResult", JSON.stringify(result));
  closeModal(caloriesModal);
});
