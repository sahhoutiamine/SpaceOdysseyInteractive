// =========================
// Burger Menu Functionality
// =========================
const burgerMenu = document.getElementById("burgerMenu");
const navContainer = document.getElementById("navContainer");

if (burgerMenu && navContainer) {
  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("active");
    navContainer.classList.toggle("active");
  });

  navContainer.addEventListener("click", (e) => {
    if (e.target === navContainer && window.innerWidth <= 1024) {
      burgerMenu.classList.remove("active");
      navContainer.classList.remove("active");
    }
  });
}

// =========================
// Navbar Active Link Control
// =========================
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navLinks.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");

    if (window.innerWidth <= 1024) {
      burgerMenu.classList.remove("active");
      navContainer.classList.remove("active");
    }
  });
});

// =========================
// Slideshow Feature
// =========================
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

if (slides.length > 0 && dots.length > 0 && prev && next) {
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  prev.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  next.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      current = i;
      showSlide(current);
    });
  });
}

// =========================
// Fetching Missions
// =========================

fetch("missions.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load missions.json");
    }
    return response.json();
  })
  .then((missions) => {
    let container = document.getElementById("missionsContainer");
    missions.forEach((mission) => {
      const section = document.createElement("section");
      section.classList.add("missions-card");
      section.innerHTML = `
              <div class="card-background"
                style="background: url('${mission.image}') no-repeat center center/cover;">
              </div>
              <div class="content-card">
                <h2>${mission.name}</h2>
                <p>${mission.description}</p>
                <button class="learn-btn">Learn More</button>
              </div>
            `;

      container.appendChild(section);
    });
  })
  .catch((error) => console.error("Error loading missions:", error));

// // ===============================
// // Projet : Missions Spatiales Interactives
// // Objectif : Manipuler le DOM, gÃ©rer des donnÃ©es JSON,
// // et ajouter des fonctionnalitÃ©s dynamiques avec JavaScript.
// // ===============================

// // --- DonnÃ©es principales ---
// let missions = [];
// let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// // ===============================
// // 1. CHARGEMENT DES DONNÃ‰ES
// // ===============================
// async function loadMissions() {
//   try {
//     const response = await fetch("missions.json");
//     missions = await response.json();

//     // Afficher les missions au chargement
//     // Utilise la fonction displayMissions(missions)
//   } catch (error) {
//     console.error("Erreur lors du chargement des missions :", error);
//   }
// }

// // ===============================
// // 2. AFFICHAGE DES MISSIONS
// // ===============================
// function displayMissions(list) {
//   const container = document.getElementById("missions-container");
//   container.innerHTML = "";

//   // Boucler sur la liste des missions et crÃ©er dynamiquement des cartes
//   // Exemple :
//   // list.forEach(mission => { ... })
//   // Utilise innerHTML pour afficher : image, nom, agence, objectif, date + bouton Favori
// }

// // ===============================
// // 3. RECHERCHE ET FILTRAGE
// // ===============================
// function searchMissions(keyword) {
//   // Filtrer les missions selon le nom ou lâ€™objectif
//   // Utilise la mÃ©thode .filter() sur le tableau missions
// }

// function filterByAgency(agency) {
//   // Filtrer selon lâ€™agence sÃ©lectionnÃ©e dans un menu dÃ©roulant
//   // Si "all" est sÃ©lectionnÃ©, afficher toutes les missions
// }

// // ===============================
// // 4. FAVORIS (Bonus)
// // ===============================
// function toggleFavorite(id) {
//   //  Ajouter ou retirer un favori selon sâ€™il est dÃ©jÃ  dans la liste
//   // Mets Ã  jour le localStorage aprÃ¨s chaque modification
//   // Affiche un message ou un style visuel (Ã©toile jaune, etc.)
// }

// // ===============================
// // 5. CRUD - AJOUT, Ã‰DITION, SUPPRESSION
// // ===============================

// // --- AJOUT ---
// function addMission(newMission) {
//   // Ajouter une nouvelle mission Ã  la liste
//   // VÃ©rifie les champs avec une validation de base avant lâ€™ajout
//   // Mets Ã  jour lâ€™affichage
// }

// // --- Ã‰DITION ---
// function editMission(id, updatedData) {
//   //  Trouver la mission correspondante et modifier ses donnÃ©es
//   // Mets Ã  jour lâ€™affichage
// }

// // --- SUPPRESSION ---
// function deleteMission(id) {
//   // Supprimer une mission aprÃ¨s confirmation (window.confirm)
//   // Mets Ã  jour lâ€™affichage
// }

// // ===============================
// // 6. VALIDATION DE FORMULAIRE
// // ===============================
// function validateForm(data) {
//   //  VÃ©rifier que tous les champs obligatoires sont remplis
//   // BONUS : Utiliser Regex pour valider les emails et formats de dates
//   // Retourne true ou false
// }

// // ===============================
// // 7. INITIALISATION ET Ã‰VÃ‰NEMENTS
// // ===============================
// document.addEventListener("DOMContentLoaded", () => {
//   // 1. Charger les missions
//   loadMissions();

//   // 2. Ã‰vÃ©nements :
//   // - Recherche (input)
//   // - Filtrage (select)
//   // - Favoris (clic sur bouton)
//   // - CRUD (formulaires dâ€™ajout/Ã©dition/suppression)

//   // Ajouter les Ã©couteurs dâ€™Ã©vÃ©nements ici
//   // Exemple :
//   // document.getElementById('search').addEventListener('input', (e) => searchMissions(e.target.value))
// });
