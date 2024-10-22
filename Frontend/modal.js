export function handleModalVisibility(triggerId, modalId, closeId) {
  const modal = document.getElementById(modalId);
  const trigger = document.getElementById(triggerId);
  const closeButton = document.getElementById(closeId);

  trigger.onclick = () => {
    modal.style.display = "block";
  };

  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
