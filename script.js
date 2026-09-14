// ==========================================
// NORTH STAR BAKERY - INTERACTION & VALIDATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initFavoritesTracker();
  initFormValidation();
});

// ------------------------------------------
// 1. PRODUCT FAVORITES TRACKER (localStorage)
// ------------------------------------------
const favoriteProducts = [];

function initFavoritesTracker() {
  const favoriteButtons = document.querySelectorAll(".btn-favorite");
  const favoritesListContainer = document.getElementById("favorites-list");

  // Cargar datos almacenados desde localStorage
  const savedFavorites = localStorage.getItem("bakeryFavorites");
  if (savedFavorites) {
    const parsed = JSON.parse(savedFavorites);
    parsed.forEach((item) => favoriteProducts.push(item));
    updateFavoritesUI();
  }

  // Escuchar clics en botones de favoritos
  favoriteButtons.forEach((button) => {
    const productId = button.dataset.id;
    const productName = button.dataset.name;

    // Marcar botón si ya está guardado
    if (favoriteProducts.some((fav) => fav.id === productId)) {
      button.textContent = "♥ Guardado";
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      toggleFavorite(productId, productName, button);
    });
  });
}

function toggleFavorite(id, name, button) {
  const index = favoriteProducts.findIndex((fav) => fav.id === id);

  if (index === -1) {
    favoriteProducts.push({ id, name });
    button.textContent = "♥ Guardado";
    button.classList.add("active");
  } else {
    favoriteProducts.splice(index, 1);
    button.textContent = "♡ Agregar a Favoritos";
    button.classList.remove("active");
  }

  // Guardar en el almacenamiento del navegador
  localStorage.setItem("bakeryFavorites", JSON.stringify(favoriteProducts));
  updateFavoritesUI();
}

function updateFavoritesUI() {
  const favoritesContainer = document.getElementById("favorites-list");
  if (!favoritesContainer) return;

  favoritesContainer.innerHTML = "";

  if (favoriteProducts.length === 0) {
    favoritesContainer.innerHTML =
      "<li>No has guardado productos favoritos aún.</li>";
    return;
  }

  favoriteProducts.forEach((prod) => {
    const li = document.createElement("li");
    li.textContent = prod.name;
    favoritesContainer.appendChild(li);
  });
}

// ------------------------------------------
// 2. FORM VALIDATION (contact.html)
// ------------------------------------------
function initFormValidation() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    let isValid = true;

    // Limpiar errores previos
    clearErrors();

    // Validar Nombre
    const nameInput = document.getElementById("name");
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      showError(
        nameInput,
        "Por favor ingrese su nombre completo (mínimo 3 caracteres).",
      );
      isValid = false;
    }

    // Validar Email
    const emailInput = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(
        emailInput,
        "Ingrese un correo electrónico válido (ej. usuario@dominio.com).",
      );
      isValid = false;
    }

    // Validar Fecha de Recogida (no puede ser pasada)
    const dateInput = document.getElementById("pickup-date");
    if (dateInput.value) {
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        showError(dateInput, "La fecha de recogida no puede ser en el pasado.");
        isValid = false;
      }
    }

    if (!isValid) {
      event.preventDefault(); // Detener envío
    }
  });
}

function showError(inputElement, message) {
  const formGroup = inputElement.closest(".form-group");
  inputElement.classList.add("input-error");

  const errorMessage = document.createElement("span");
  errorMessage.className = "error-text";
  errorMessage.textContent = message;

  formGroup.appendChild(errorMessage);
}

function clearErrors() {
  document
    .querySelectorAll(".input-error")
    .forEach((el) => el.classList.remove("input-error"));
  document.querySelectorAll(".error-text").forEach((el) => el.remove());
}
