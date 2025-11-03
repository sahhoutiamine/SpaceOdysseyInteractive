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
// Add Mission Button Setup
// =========================
function setupAddMissionButton() {
  const filtersSection = document.querySelector(".missions-filters");
  if (!filtersSection) return;

  // Create add button container
  const addButtonContainer = document.createElement("div");
  addButtonContainer.className = "add-mission-container";
  addButtonContainer.innerHTML = `
    <button id="addMissionBtn" class="add-mission-btn" title="Add New Mission">
      <span>Add Mission</span>
    </button>
  `;

  filtersSection.appendChild(addButtonContainer);

  // Add event listener
  document
    .getElementById("addMissionBtn")
    .addEventListener("click", showAddMissionModal);
}

// Call setup after DOM is loaded
document.addEventListener("DOMContentLoaded", setupAddMissionButton);

// =========================
// Add Mission Modal
// =========================
function showAddMissionModal() {
  const modal = document.createElement("div");
  modal.className = "edit-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Mission</h2>
      <form id="addMissionForm">
        <label for="addName">Mission Name: *</label>
        <input type="text" id="addName" placeholder="Enter mission name" required>
        
        <label for="addAgency">Agency: *</label>
        <select id="addAgency" required>
          <option value="">Select Agency</option>
          <option value="NASA">NASA</option>
          <option value="ESA">ESA</option>
          <option value="CNSA (China)">CNSA (China)</option>
          <option value="SpaceX">SpaceX</option>
          <option value="NASA/ESA/CSA">NASA/ESA/CSA</option>
          <option value="NASA/ESA/ASI">NASA/ESA/ASI</option>
        </select>

        <label for="addLaunchDate">Launch Date: *</label>
        <input type="date" id="addLaunchDate" required>
        
        <label for="addType">Type: *</label>
        <select id="addType" required>
          <option value="">Select Type</option>
          <option value="Rover">Rover</option>
          <option value="Telescope">Telescope</option>
          <option value="Lunar Mission">Lunar Mission</option>
          <option value="Probe">Probe</option>
          <option value="Rocket">Rocket</option>
        </select>

        <label for="addImage">Image URL: *</label>
        <input type="url" id="addImage" placeholder="https://example.com/image.jpg" required>
        
        <label for="addDesc">Description: *</label>
        <textarea id="addDesc" rows="4" placeholder="Enter mission description" required></textarea>
        
        <div class="modal-buttons">
          <button type="submit" class="save-btn">Add Mission</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Set min and max dates for the date input (optional)
  const dateInput = modal.querySelector("#addLaunchDate");
  const currentYear = new Date().getFullYear();
  dateInput.min = "1957-01-01"; // First satellite launch
  dateInput.max = `${currentYear + 10}-12-31`; // 10 years from now

  // Handle form submission
  const addForm = modal.querySelector("#addMissionForm");
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newMission = {
      name: document.getElementById("addName").value.trim(),
      agency: document.getElementById("addAgency").value,
      launchDate: document.getElementById("addLaunchDate").value, // This will be in "YYYY-MM-DD" format
      type: document.getElementById("addType").value,
      image: document.getElementById("addImage").value.trim(),
      description: document.getElementById("addDesc").value.trim(),
    };

    // Add to missionsData array
    missionsData.push(newMission);

    // Refresh display
    filterMissions();

    // Close modal
    document.body.removeChild(modal);
    showNotification("Mission added successfully!", "success");
  });

  // Handle cancel button
  modal.querySelector(".cancel-btn").addEventListener("click", function () {
    document.body.removeChild(modal);
  });

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // Focus on first input
  setTimeout(() => {
    const nameInput = modal.querySelector("#addName");
    if (nameInput) nameInput.focus();
  }, 100);
}

// =========================
// Context Menu for Missions
// =========================
let currentMissionCard = null;
let favoriteMissions =
  JSON.parse(localStorage.getItem("favoriteMissions")) || [];

function createContextMenu() {
  let contextMenu = document.getElementById("missionContextMenu");
  if (!contextMenu) {
    contextMenu = document.createElement("div");
    contextMenu.id = "missionContextMenu";
    contextMenu.className = "context-menu";
    contextMenu.innerHTML = `
      <ul>
        <li class="edit" id="editMission">Edit</li>
        <li class="favorite" id="addToFavorite">Add to Favorite</li>
        <li class="delete" id="deleteMission">Delete</li>
        <li class="cancel" id="cancelMenu">Cancel</li>
      </ul>
    `;
    document.body.appendChild(contextMenu);
    setupContextMenuListeners(contextMenu);
  }
  return contextMenu;
}

function setupContextMenuListeners(contextMenu) {
  contextMenu.addEventListener("click", (e) => {
    e.stopPropagation();

    if (e.target.closest("#editMission") || e.target.id === "editMission") {
      editMissionHandler();
    } else if (
      e.target.closest("#addToFavorite") ||
      e.target.id === "addToFavorite"
    ) {
      addToFavoriteHandler();
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

function addToFavoriteHandler() {
  if (!currentMissionCard) {
    console.error("No mission card selected");
    return;
  }

  // Find the mission data from missionsData array
  const index = Array.from(container.children).indexOf(currentMissionCard);
  const missionData = missionsData[index];

  if (!missionData) {
    console.error("Mission data not found");
    return;
  }

  // Check if mission is already in favorites
  const isAlreadyFavorite = favoriteMissions.some(
    (fav) => fav.name === missionData.name
  );

  if (isAlreadyFavorite) {
    showNotification("Mission is already in favorites!", "info");
    hideContextMenu();
    return;
  }

  // Create favorite mission object
  const favoriteMission = {
    id: Date.now(), // Generate unique ID
    name: missionData.name,
    image: missionData.image,
    agency: missionData.agency,
    type: missionData.type,
    launchDate: missionData.launchDate,
    description: missionData.description,
    addedDate: new Date().toISOString(),
  };

  // Add to favorites array
  favoriteMissions.push(favoriteMission);

  // Save to localStorage
  localStorage.setItem("favoriteMissions", JSON.stringify(favoriteMissions));

  showNotification("Mission added to favorites!", "success");
  hideContextMenu();
}

// Optional: Function to remove from favorites
function removeFromFavorite(missionId) {
  favoriteMissions = favoriteMissions.filter(
    (mission) => mission.id !== missionId
  );
  localStorage.setItem("favoriteMissions", JSON.stringify(favoriteMissions));
  showNotification("Mission removed from favorites!", "success");
}

// Optional: Function to check if mission is favorite
function isMissionFavorite(missionName) {
  return favoriteMissions.some((mission) => mission.name === missionName);
}
function showContextMenu(e, missionCard) {
  e.preventDefault();
  e.stopPropagation();

  const contextMenu = createContextMenu();
  currentMissionCard = missionCard;

  contextMenu.style.display = "block";
  contextMenu.style.position = "fixed";

  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = e.clientX;
  let y = e.clientY;

  if (x + menuWidth > viewportWidth) {
    x = viewportWidth - menuWidth - 10;
  }

  if (y + menuHeight > viewportHeight) {
    y = viewportHeight - menuHeight - 10;
  }

  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";

  document.body.style.overflow = "hidden";
}

function hideContextMenu() {
  const contextMenu = document.getElementById("missionContextMenu");
  if (contextMenu) {
    contextMenu.style.display = "none";
  }
  currentMissionCard = null;
  document.body.style.overflow = "";
}

document.addEventListener("click", () => {
  const contextMenu = document.getElementById("missionContextMenu");
  if (contextMenu) {
    hideContextMenu();
  }
});

function editMissionHandler() {
  if (!currentMissionCard) {
    console.error("No mission card selected");
    return;
  }

  const missionName = currentMissionCard.querySelector("h2").textContent;
  const missionDesc = currentMissionCard.querySelector("p").textContent;
  const missionCardToEdit = currentMissionCard;

  // Find the mission data from missionsData array
  const index = Array.from(container.children).indexOf(missionCardToEdit);
  const missionData = missionsData[index];

  if (!missionData) {
    console.error("Mission data not found");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "edit-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Mission</h2>
      <form id="editForm">
        <label for="editName">Mission Name: *</label>
        <input type="text" id="editName" value="${missionData.name.replace(
          /"/g,
          "&quot;"
        )}" placeholder="Enter mission name" required>
        
        <label for="editAgency">Agency: *</label>
        <select id="editAgency" required>
          <option value="">Select Agency</option>
          <option value="NASA" ${
            missionData.agency === "NASA" ? "selected" : ""
          }>NASA</option>
          <option value="ESA" ${
            missionData.agency === "ESA" ? "selected" : ""
          }>ESA</option>
          <option value="CNSA (China)" ${
            missionData.agency === "CNSA (China)" ? "selected" : ""
          }>CNSA (China)</option>
          <option value="SpaceX" ${
            missionData.agency === "SpaceX" ? "selected" : ""
          }>SpaceX</option>
          <option value="NASA/ESA/CSA" ${
            missionData.agency === "NASA/ESA/CSA" ? "selected" : ""
          }>NASA/ESA/CSA</option>
          <option value="NASA/ESA/ASI" ${
            missionData.agency === "NASA/ESA/ASI" ? "selected" : ""
          }>NASA/ESA/ASI</option>
        </select>

        <label for="editLaunchDate">Launch Date: *</label>
        <input type="date" id="editLaunchDate" value="${
          missionData.launchDate
        }" required>
        
        <label for="editType">Type: *</label>
        <select id="editType" required>
          <option value="">Select Type</option>
          <option value="Rover" ${
            missionData.type === "Rover" ? "selected" : ""
          }>Rover</option>
          <option value="Telescope" ${
            missionData.type === "Telescope" ? "selected" : ""
          }>Telescope</option>
          <option value="Lunar Mission" ${
            missionData.type === "Lunar Mission" ? "selected" : ""
          }>Lunar Mission</option>
          <option value="Probe" ${
            missionData.type === "Probe" ? "selected" : ""
          }>Probe</option>
          <option value="Rocket" ${
            missionData.type === "Rocket" ? "selected" : ""
          }>Rocket</option>
        </select>

        <label for="editImage">Image URL: *</label>
        <input type="text" id="editImage" value="${
          missionData.image
        }" placeholder="https://example.com/image.jpg" required>
        
        <label for="editDesc">Description: *</label>
        <textarea id="editDesc" rows="4" placeholder="Enter mission description" required>${
          missionData.description
        }</textarea>
        
        <div class="modal-buttons">
          <button type="submit" class="save-btn">Save Changes</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Set min and max dates for the date input
  const dateInput = modal.querySelector("#editLaunchDate");
  const currentYear = new Date().getFullYear();
  dateInput.min = "1957-01-01";
  dateInput.max = `${currentYear + 10}-12-31`;

  // Handle form submission
  const editForm = modal.querySelector("#editForm");
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedMission = {
      name: document.getElementById("editName").value.trim(),
      agency: document.getElementById("editAgency").value,
      launchDate: document.getElementById("editLaunchDate").value,
      type: document.getElementById("editType").value,
      image: document.getElementById("editImage").value.trim(),
      description: document.getElementById("editDesc").value.trim(),
    };

    // Update mission card display
    missionCardToEdit.querySelector("h2").textContent = updatedMission.name;
    missionCardToEdit.querySelector("p").textContent =
      updatedMission.description;

    // Update the image if it exists in the card
    const missionImage = missionCardToEdit.querySelector("img");
    if (missionImage) {
      missionImage.src = updatedMission.image;
      missionImage.alt = updatedMission.name;
    }

    // Update agency badge if it exists
    const agencyBadge = missionCardToEdit.querySelector(".agency-badge");
    if (agencyBadge) {
      agencyBadge.textContent = updatedMission.agency;
    }

    // Update type badge if it exists
    const typeBadge = missionCardToEdit.querySelector(".type-badge");
    if (typeBadge) {
      typeBadge.textContent = updatedMission.type;
    }

    // Update launch date if displayed
    const launchDateElement = missionCardToEdit.querySelector(".launch-date");
    if (launchDateElement) {
      launchDateElement.textContent = `Launched: ${formatLaunchDate(
        updatedMission.launchDate
      )}`;
    }

    // Update missionsData array
    if (missionsData[index]) {
      missionsData[index] = { ...missionsData[index], ...updatedMission };
    }

    // Save to backend (if implemented)
    if (typeof saveMissionToBackend === "function") {
      saveMissionToBackend(updatedMission, index);
    }

    // Refresh display to ensure filters work correctly
    filterMissions();

    // Close modal
    document.body.removeChild(modal);
    hideContextMenu();
    showNotification("Mission updated successfully!", "success");
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

// Helper function to format launch date for display (optional)
function formatLaunchDate(dateString) {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
}
function deleteMissionHandler() {
  if (!currentMissionCard) {
    console.error("No mission card selected");
    return;
  }

  const missionName = currentMissionCard.querySelector("h2").textContent;
  const missionCardToDelete = currentMissionCard;

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

  modal
    .querySelector(".delete-confirm-btn")
    .addEventListener("click", function () {
      const index = Array.from(container.children).indexOf(missionCardToDelete);

      document.body.removeChild(modal);
      hideContextMenu();

      missionCardToDelete.style.transition = "opacity 0.3s, transform 0.3s";
      missionCardToDelete.style.opacity = "0";
      missionCardToDelete.style.transform = "scale(0.8)";

      setTimeout(() => {
        if (missionCardToDelete && missionCardToDelete.parentNode) {
          missionCardToDelete.remove();

          if (index !== -1 && missionsData[index]) {
            missionsData.splice(index, 1);
          }

          showNotification("Mission deleted successfully!", "success");
        }
      }, 300);
    });

  modal.querySelector(".cancel-btn").addEventListener("click", function () {
    document.body.removeChild(modal);
    hideContextMenu();
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
      hideContextMenu();
    }
  });
}

function showNotification(message, type) {
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // Create notification content with icon
  const icon = getNotificationIcon(type);
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    padding: 16px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: 0;
    max-width: 90vw;
    width: auto;
    min-width: 280px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
  `;

  // Set colors based on type with modern gradient backgrounds
  if (type === "success") {
    notification.style.background = "linear-gradient(135deg, #10b981, #059669)";
  } else if (type === "error") {
    notification.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
  } else if (type === "warning") {
    notification.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
  } else {
    notification.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
  }

  document.body.appendChild(notification);

  // Force reflow
  notification.offsetHeight;

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  // Auto remove after delay
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 400);
  }, 4000);
}

// Helper function to get appropriate icons
function getNotificationIcon(type) {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[type] || icons.info;
}

// Optional: Add CSS for better mobile appearance
const style = document.createElement("style");
style.textContent = `
  .notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .notification-icon {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 480px) {
    .notification {
      top: 16px !important;
      padding: 14px 20px !important;
      min-width: 260px !important;
      max-width: 85vw !important;
      font-size: 15px !important;
    }
  }
  
  @media (max-width: 360px) {
    .notification {
      padding: 12px 16px !important;
      min-width: 240px !important;
    }
    
    .notification-content {
      gap: 10px;
    }
  }
`;
document.head.appendChild(style);

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

    section.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e, section);
    });

    let touchTimer;
    let touchMoved = false;

    section.addEventListener("touchstart", (e) => {
      touchMoved = false;
      touchTimer = setTimeout(() => {
        if (!touchMoved) {
          e.preventDefault();
          const touch = e.touches[0];
          const syntheticEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => {},
            stopPropagation: () => {},
          };
          showContextMenu(syntheticEvent, section);

          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }, 500);
    });

    section.addEventListener("touchmove", () => {
      touchMoved = true;
      clearTimeout(touchTimer);
    });

    section.addEventListener("touchend", () => {
      clearTimeout(touchTimer);
    });

    section.addEventListener("touchcancel", () => {
      clearTimeout(touchTimer);
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
