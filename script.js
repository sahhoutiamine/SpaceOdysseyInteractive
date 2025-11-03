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
// Context Menu for Missions
// =========================
let currentMissionCard = null;
let pressTimer;
let longPressActive = false;

// Create context menu element
function createContextMenu() {
  let contextMenu = document.getElementById("missionContextMenu");
  if (!contextMenu) {
    contextMenu = document.createElement("div");
    contextMenu.id = "missionContextMenu";
    contextMenu.className = "context-menu";
    contextMenu.innerHTML = `
      <ul>
        <li class="edit" id="editMission">Edit</li>
        <li class="delete" id="deleteMission">Delete</li>
        <li class="cancel" id="cancelMenu">Cancel</li>
      </ul>
    `;
    document.body.appendChild(contextMenu);

    // Setup event listeners immediately after creating the menu
    setupContextMenuListeners(contextMenu);
  }
  return contextMenu;
}

// Setup context menu event listeners
function setupContextMenuListeners(contextMenu) {
  // Use event delegation on the context menu
  contextMenu.addEventListener("click", (e) => {
    e.stopPropagation();

    if (e.target.closest("#editMission") || e.target.id === "editMission") {
      editMissionHandler();
    } else if (
      e.target.closest("#deleteMission") ||
      e.target.id === "deleteMission"
    ) {
      deleteMissionHandler();
    } else if (
      e.target.closest("#cancelMenu") ||
      e.target.id === "cancelMenu"
    ) {
      hideContextMenu();
    }
  });
}

// Show context menu
function showContextMenu(e, missionCard) {
  const contextMenu = createContextMenu();
  currentMissionCard = missionCard;

  contextMenu.style.display = "block";

  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = e.pageX || e.clientX;
  let y = e.pageY || e.clientY;

  if (e.pageX === undefined) {
    x += window.scrollX;
    y += window.scrollY;
  }

  if (x + menuWidth > viewportWidth + window.scrollX) {
    x = viewportWidth + window.scrollX - menuWidth - 10;
  }
  if (y + menuHeight > viewportHeight + window.scrollY) {
    y = viewportHeight + window.scrollY - menuHeight - 10;
  }

  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
}

// Hide context menu
function hideContextMenu() {
  const contextMenu = document.getElementById("missionContextMenu");
  if (contextMenu) {
    contextMenu.style.display = "none";
  }
  currentMissionCard = null;
}

// Edit mission function - FIXED VERSION
function editMissionHandler() {
  if (!currentMissionCard) {
    console.error("No mission card selected");
    return;
  }

  const missionName = currentMissionCard.querySelector("h2").textContent;
  const missionDesc = currentMissionCard.querySelector("p").textContent;

  // Store reference to the mission card before hiding context menu
  const missionCardToEdit = currentMissionCard;

  // Create edit modal
  const modal = document.createElement("div");
  modal.className = "edit-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Mission</h2>
      <form id="editForm">
        <label for="editName">Mission Name:</label>
        <input type="text" id="editName" value="${missionName.replace(
          /"/g,
          "&quot;"
        )}" required>
        
        <label for="editDesc">Description:</label>
        <textarea id="editDesc" rows="4" required>${missionDesc}</textarea>
        
        <div class="modal-buttons">
          <button type="submit" class="save-btn">Save Changes</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // FIXED: Use local variable instead of global currentMissionCard
  const editForm = modal.querySelector("#editForm");
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newName = document.getElementById("editName").value;
    const newDesc = document.getElementById("editDesc").value;

    if (newName && newDesc) {
      // Use the local variable that stores the mission card reference
      missionCardToEdit.querySelector("h2").textContent = newName;
      missionCardToEdit.querySelector("p").textContent = newDesc;

      // Update in missionsData
      const index = Array.from(container.children).indexOf(missionCardToEdit);
      if (missionsData[index]) {
        missionsData[index].name = newName;
        missionsData[index].description = newDesc;
      }

      document.body.removeChild(modal);
      hideContextMenu();
      showNotification("Mission updated successfully!", "success");
    }
  });

  // Handle cancel button
  modal.querySelector(".cancel-btn").addEventListener("click", function () {
    document.body.removeChild(modal);
    hideContextMenu();
  });

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
      hideContextMenu();
    }
  });

  // Focus on first input
  setTimeout(() => {
    const nameInput = modal.querySelector("#editName");
    if (nameInput) nameInput.focus();
  }, 100);
}

// Delete mission function - FIXED VERSION
function deleteMissionHandler() {
  if (!currentMissionCard) {
    console.error("No mission card selected");
    return;
  }

  const missionName = currentMissionCard.querySelector("h2").textContent;
  const missionCardToDelete = currentMissionCard; // Store reference

  // Create delete confirmation modal
  const modal = document.createElement("div");
  modal.className = "edit-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="color: #e74c3c;">Delete Mission</h2>
      <p style="margin-bottom: 20px; color: #333; font-size: 16px; line-height: 1.5;">
        Are you sure you want to delete <strong>"${missionName}"</strong>? This action cannot be undone.
      </p>
      <div class="modal-buttons">
        <button type="button" class="delete-confirm-btn" style="background: #e74c3c;">Delete Mission</button>
        <button type="button" class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle delete confirmation - FIXED: Use stored reference and proper timing
  modal
    .querySelector(".delete-confirm-btn")
    .addEventListener("click", function () {
      const index = Array.from(container.children).indexOf(missionCardToDelete);

      // Remove modal and hide context menu immediately
      document.body.removeChild(modal);
      hideContextMenu();

      // Remove from DOM with animation
      missionCardToDelete.style.transition = "opacity 0.3s, transform 0.3s";
      missionCardToDelete.style.opacity = "0";
      missionCardToDelete.style.transform = "scale(0.8)";

      setTimeout(() => {
        if (missionCardToDelete && missionCardToDelete.parentNode) {
          missionCardToDelete.remove();

          // Remove from missionsData
          if (index !== -1 && missionsData[index]) {
            missionsData.splice(index, 1);
          }

          // FIXED: Show notification after animation completes
          showNotification("Mission deleted successfully!", "success");
        }
      }, 300);
    });

  // Handle cancel
  modal.querySelector(".cancel-btn").addEventListener("click", function () {
    document.body.removeChild(modal);
    hideContextMenu();
  });

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
      hideContextMenu();
    }
  });
}

// Show notification - ENHANCED VERSION
function showNotification(message, type) {
  // Remove any existing notifications first
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add some basic styling if not already in CSS
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-20px);
  `;

  // Set background color based on type
  if (type === "success") {
    notification.style.background = "#27ae60";
  } else if (type === "error") {
    notification.style.background = "#e74c3c";
  } else {
    notification.style.background = "#3498db";
  }

  document.body.appendChild(notification);

  // Force reflow
  notification.offsetHeight;

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// =========================
// Fetching and Filtering Missions
// =========================
let missionsData = [];
const container = document.getElementById("missionsContainer");
const agencyFilter = document.getElementById("agencyFilter");
const yearFilter = document.getElementById("yearFilter");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");

function displayMissions(missions) {
  container.innerHTML = "";

  missions.forEach((mission) => {
    const section = document.createElement("section");
    section.classList.add("missions-card");
    section.innerHTML = `
      <div class="card-background" style="background: url('${mission.image}') no-repeat center center/cover;"></div>
      <div class="content-card">
        <h2>${mission.name}</h2>
        <p>${mission.description}</p>
        <button class="learn-btn">Learn More</button>
      </div>
    `;

    // Desktop: Right-click context menu
    section.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e, section);
    });

    // Mobile: Long press
    section.addEventListener("touchstart", (e) => {
      longPressActive = false;
      pressTimer = setTimeout(() => {
        longPressActive = true;
        showContextMenu(e.touches[0], section);

        // Visual feedback
        const effect = document.createElement("div");
        effect.className = "long-press-effect";
        effect.style.left = e.touches[0].pageX + "px";
        effect.style.top = e.touches[0].pageY + "px";
        document.body.appendChild(effect);
        setTimeout(() => {
          if (effect.parentNode) {
            document.body.removeChild(effect);
          }
        }, 1000);
      }, 500);
    });

    section.addEventListener("touchend", (e) => {
      clearTimeout(pressTimer);
      if (longPressActive) {
        e.preventDefault();
      }
    });

    section.addEventListener("touchmove", () => {
      clearTimeout(pressTimer);
      longPressActive = false;
    });

    container.appendChild(section);
  });
}

function filterMissions() {
  const agencyVal = agencyFilter.value;
  const yearVal = yearFilter.value;
  const typeVal = typeFilter.value.toLowerCase();
  const searchVal = searchInput.value.toLowerCase();

  const filtered = missionsData.filter((mission) => {
    const matchAgency = agencyVal === "" || mission.agency === agencyVal;
    const matchYear = yearVal === "" || mission.launchDate.startsWith(yearVal);
    const matchType =
      typeVal === "" ||
      (mission.type && mission.type.toLowerCase() === typeVal);
    const matchSearch =
      mission.name.toLowerCase().includes(searchVal) ||
      mission.agency.toLowerCase().includes(searchVal) ||
      mission.launchDate.toLowerCase().includes(searchVal);
    return matchAgency && matchYear && matchType && matchSearch;
  });

  displayMissions(filtered);
}

fetch("missions.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load missions.json");
    }
    return response.json();
  })
  .then((missions) => {
    missionsData = missions;
    missionsData.forEach((m) => {
      if (m.name.toLowerCase().includes("rover")) m.type = "Rover";
      else if (m.name.toLowerCase().includes("telescope")) m.type = "Telescope";
      else if (m.name.toLowerCase().includes("falcon")) m.type = "Rocket";
      else if (
        m.name.toLowerCase().includes("moon") ||
        m.name.toLowerCase().includes("lunar") ||
        m.name.toLowerCase().includes("apollo")
      )
        m.type = "Lunar Mission";
      else m.type = "Probe";
    });
    displayMissions(missionsData);
  })
  .catch((error) => console.error("Error loading missions:", error));

[agencyFilter, yearFilter, typeFilter, searchInput].forEach((el) =>
  el.addEventListener("input", filterMissions)
);
