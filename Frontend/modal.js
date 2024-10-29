const caloriesModal = document.getElementById("caloriesModal");
const signUpModal = document.getElementById("signUpModal");
const signInModal = document.getElementById("signInModal");

const caloriesBtn = document.getElementById("caloriesBtn");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");

const signUpClose = document.getElementById("signUpClose");
const caloriesClose = document.getElementById("caloriesClose");
const signInClose = document.getElementById("signInClose");

function openModal(modal) {
  modal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}

// Event listeners
caloriesBtn.onclick = () => openModal(caloriesModal);
caloriesClose.onclick = () => closeModal(caloriesModal);

signUpBtn.onclick = () => openModal(signUpModal);
signUpClose.onclick = () => closeModal(signUpModal);

signInBtn.onclick = () => openModal(signInModal);
signInClose.onclick = () => closeModal(signInModal);

// Close modals when clicking outside
window.onclick = (event) => {
  if (event.target == signInModal) {
    closeModal(signInModal);
  } else if (event.target == signUpModal) {
    closeModal(signUpModal);
  } else if (event.target == caloriesModal) {
    closeModal(caloriesModal);
  }
};
