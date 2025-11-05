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
// Global Variables
// =========================
let missionsData = JSON.parse(localStorage.getItem("missionsData")) || [];
let favoriteMissions =
  JSON.parse(localStorage.getItem("favoriteMissions")) || [];
let currentMissionCard = null;
const container = document.getElementById("missionsContainer");
const agencyFilter = document.getElementById("agencyFilter");
const yearFilter = document.getElementById("yearFilter");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");

// =========================
// Favorites Button Setup
// =========================
function setupFavoritesButton() {
  const filtersSection = document.querySelector(".missions-filters");
  if (!filtersSection) return;

  // Check if add button container exists, if not create it
  let addButtonContainer = document.querySelector(".add-mission-container");
  if (!addButtonContainer) {
    addButtonContainer = document.createElement("div");
    addButtonContainer.className = "add-mission-container";
    filtersSection.appendChild(addButtonContainer);
  }

  // Create favorites button
  const favButton = document.createElement("button");
  favButton.id = "favoritesBtn";
  favButton.className = "favorites-btn";
  favButton.title = "View Favorites";
  favButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="fav-count">${favoriteMissions.length}</span>
  `;

  // Insert favorites button AFTER add button (to the right)
  const addButton = document.getElementById("addMissionBtn");
  if (addButton) {
    addButton.parentNode.insertBefore(favButton, addButton.nextSibling);
  } else {
    addButtonContainer.appendChild(favButton);
  }

  // Add event listener
  favButton.addEventListener("click", toggleFavoritesSidebar);

  // Add styles
  addFavoritesStyles();
}

// =========================
// Favorites Sidebar
// =========================
function toggleFavoritesSidebar() {
  let sidebar = document.getElementById("favoritesSidebar");

  if (sidebar) {
    // Close sidebar
    sidebar.classList.remove("active");
    setTimeout(() => {
      if (sidebar.parentNode) {
        document.body.removeChild(sidebar);
      }
    }, 300);
  } else {
    // Open sidebar
    createFavoritesSidebar();
  }
}

function createFavoritesSidebar() {
  const sidebar = document.createElement("div");
  sidebar.id = "favoritesSidebar";
  sidebar.className = "favorites-sidebar";

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        Favorite Missions
      </h2>
      <div class="header-actions">
        <button class="download-pdf-btn" title="Export to PDF">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
        <button class="close-sidebar" title="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    <div class="sidebar-content" id="favoritesContent">
      ${renderFavorites()}
    </div>
  `;

  document.body.appendChild(sidebar);

  // Trigger animation
  setTimeout(() => {
    sidebar.classList.add("active");
  }, 10);

  // Download PDF button handler
  sidebar.querySelector(".download-pdf-btn").addEventListener("click", () => {
    exportFavoritesToPDF(); // or exportFavoritesToHTML() if using the HTML version
  });
  // Close button handler
  sidebar.querySelector(".close-sidebar").addEventListener("click", () => {
    toggleFavoritesSidebar();
  });

  // Close when clicking overlay
  sidebar.addEventListener("click", (e) => {
    if (e.target === sidebar) {
      toggleFavoritesSidebar();
    }
  });

  // ATTACH EVENT LISTENERS IMMEDIATELY after creating sidebar
  attachFavoriteEventListeners();
}

function renderFavorites() {
  if (favoriteMissions.length === 0) {
    return `
      <div class="empty-favorites">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <p>No favorite missions yet</p>
        <span>Right-click on a mission to add it to favorites</span>
      </div>
    `;
  }

  return favoriteMissions
    .map(
      (mission) => `
    <div class="favorite-card" data-mission-id="${mission.id}">
      <div class="favorite-image" style="background-image: url('${
        mission.image
      }')"></div>
      <div class="favorite-info">
        <h3>${mission.name}</h3>
        <div class="favorite-meta">
          <span class="meta-badge">${mission.agency}</span>
          <span class="meta-badge">${mission.type}</span>
        </div>
        <p class="favorite-desc">${mission.description.substring(0, 100)}${
        mission.description.length > 100 ? "..." : ""
      }</p>
      </div>
      <button class="remove-favorite" data-mission-id="${
        mission.id
      }" title="Remove from favorites">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `
    )
    .join("");
}

function updateFavoritesSidebar() {
  const content = document.getElementById("favoritesContent");
  if (content) {
    content.innerHTML = renderFavorites();
    attachFavoriteEventListeners();
  }

  // Update counter on button
  const favCount = document.querySelector(".fav-count");
  if (favCount) {
    favCount.textContent = favoriteMissions.length;
  }
}

function attachFavoriteEventListeners() {
  const removeButtons = document.querySelectorAll(".remove-favorite");
  removeButtons.forEach((btn) => {
    // Remove any existing event listeners to prevent duplicates
    btn.replaceWith(btn.cloneNode(true));
  });

  // Re-select the buttons after cloning
  const freshRemoveButtons = document.querySelectorAll(".remove-favorite");
  freshRemoveButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const missionId = parseInt(btn.dataset.missionId);
      removeFromFavorite(missionId);
    });
  });
}

function removeFromFavorite(missionId) {
  favoriteMissions = favoriteMissions.filter(
    (mission) => mission.id !== missionId
  );
  localStorage.setItem("favoriteMissions", JSON.stringify(favoriteMissions));
  showNotification("Mission removed from favorites!", "success");
  updateFavoritesSidebar();
}

// =========================
// PDF Export Functionality
// =========================
function exportFavoritesToPDF() {
  if (favoriteMissions.length === 0) {
    showNotification("No favorites to export!", "warning");
    return;
  }

  showNotification("Generating PDF...", "info");

  // Create a temporary container for PDF content
  const pdfContainer = document.createElement("div");
  pdfContainer.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 800px;
    padding: 40px;
    background: white;
    color: #333;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  // Get current date for the report
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Build HTML content for PDF
  pdfContainer.innerHTML = `
    <div id="pdfContent" style="max-width: 800px; margin: 0 auto;">
      <div class="header" style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #ec4899; padding-bottom: 20px;">
        <h1 style="font-size: 36px; color: #1a1a2e; margin-bottom: 10px;">🚀 My Favorite Space Missions</h1>
        <p style="font-size: 16px; color: #666;">Generated on ${currentDate}</p>
        <span class="mission-count" style="background: linear-gradient(135deg, #ec4899, #ef4444); color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 10px; font-weight: 600;">
          ${favoriteMissions.length} Mission${
    favoriteMissions.length !== 1 ? "s" : ""
  }
        </span>
      </div>
      
      ${favoriteMissions
        .map(
          (mission, index) => `
        <div class="mission" style="page-break-inside: avoid; margin-bottom: 30px; border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <div class="mission-header" style="background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 20px;">
            <div class="mission-title" style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">${
              index + 1
            }. ${mission.name}</div>
            <div class="mission-badges" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <span class="badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(236, 72, 153, 0.3);">🏢 ${
                mission.agency
              }</span>
              <span class="badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(236, 72, 153, 0.3);">🔬 ${
                mission.type
              }</span>
              <span class="badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(236, 72, 153, 0.3);">📅 ${new Date(
                mission.launchDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}</span>
            </div>
          </div>
          <div class="mission-body" style="padding: 20px; background: white;">
            ${
              mission.image
                ? `<img src="${mission.image}" alt="${mission.name}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" onerror="this.style.display='none'">`
                : ""
            }
            <div class="mission-description" style="font-size: 15px; line-height: 1.6; color: #444;">
              ${mission.description}
            </div>
            <div class="mission-meta" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #666;">
              Added to favorites: ${new Date(
                mission.addedDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      `
        )
        .join("")}
      
      <div class="footer" style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #999; font-size: 12px;">
        <p>Generated from Space Missions Explorer</p>
        <p>Total Favorites: ${
          favoriteMissions.length
        } | Export Date: ${currentDate}</p>
      </div>
    </div>
  `;

  document.body.appendChild(pdfContainer);

  // Use html2canvas and jsPDF to generate and download PDF
  setTimeout(() => {
    const element = document.getElementById("pdfContent");

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf.jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Download the PDF
        pdf.save(
          `Favorite-Space-Missions-${
            new Date().toISOString().split("T")[0]
          }.pdf`
        );

        // Clean up
        document.body.removeChild(pdfContainer);
        showNotification("PDF downloaded successfully!", "success");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        document.body.removeChild(pdfContainer);
        showNotification("Error generating PDF. Please try again.", "error");

        // Fallback to simple text PDF
        generateSimplePDF();
      });
  }, 1000);
}

// Fallback PDF generation without images
function generateSimplePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Add title
  pdf.setFontSize(20);
  pdf.setTextColor(26, 26, 46);
  pdf.text("🚀 My Favorite Space Missions", 20, 20);

  // Add date
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  pdf.text(`Generated on ${currentDate}`, 20, 30);

  // Add mission count
  pdf.text(`Total Favorites: ${favoriteMissions.length} missions`, 20, 40);

  let yPosition = 60;

  favoriteMissions.forEach((mission, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }

    // Mission title
    pdf.setFontSize(16);
    pdf.setTextColor(26, 26, 46);
    pdf.text(`${index + 1}. ${mission.name}`, 20, yPosition);
    yPosition += 10;

    // Mission details
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Agency: ${mission.agency} | Type: ${mission.type} | Launch: ${new Date(
        mission.launchDate
      ).toLocaleDateString()}`,
      20,
      yPosition
    );
    yPosition += 8;

    // Mission description (truncated if too long)
    const description =
      mission.description.length > 200
        ? mission.description.substring(0, 200) + "..."
        : mission.description;

    const splitDescription = pdf.splitTextToSize(description, 170);
    pdf.text(splitDescription, 20, yPosition);
    yPosition += splitDescription.length * 5 + 15;

    // Add separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition - 5, 190, yPosition - 5);
    yPosition += 10;
  });

  // Add footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Generated from Space Missions Explorer", 20, 285);

  // Download the PDF
  pdf.save(
    `Favorite-Space-Missions-${new Date().toISOString().split("T")[0]}.pdf`
  );
  showNotification("PDF downloaded successfully!", "success");
}

// =========================
// Favorites Styles
// =========================
function addFavoritesStyles() {
  const style = document.createElement("style");
  style.id = "favorites-styles";
  style.textContent = `
    /* Add Mission Container */
    .add-mission-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }

    /* Favorites Button */
    .favorites-btn {
      position: relative;
      padding: 12px 20px;
      background: linear-gradient(135deg, #ec4899, #ef4444);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
      height: 44px;
    }

    .favorites-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    .favorites-btn:active {
      transform: translateY(0);
    }

    .fav-count {
      background: rgba(255, 255, 255, 0.3);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      min-width: 24px;
      text-align: center;
    }

    /* Add Mission Button - ensure same height */
    .add-mission-btn {
      height: 44px;
      padding: 12px 20px;
    }

    /* Sidebar */
    .favorites-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .favorites-sidebar.active {
      transform: translateX(0);
    }

    .favorites-sidebar::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .favorites-sidebar.active::before {
      opacity: 1;
      pointer-events: auto;
    }

    /* Header */
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar-header h2 {
      font-size: 24px;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar-header h2 svg {
      color: #ec4899;
    }

    /* Header Actions Container */
    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    /* Download PDF Button */
    .download-pdf-btn {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #22c55e;
    }
    
    .download-pdf-btn:hover {
      background: rgba(34, 197, 94, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }
    
    .download-pdf-btn:active {
      transform: translateY(0);
    }

    .close-sidebar {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #fff;
    }

    .close-sidebar:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: rotate(90deg);
    }

    /* Content */
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .sidebar-content::-webkit-scrollbar {
      width: 8px;
    }

    .sidebar-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .sidebar-content::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Empty State */
    .empty-favorites {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      padding: 40px;
    }

    .empty-favorites svg {
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .empty-favorites p {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.8);
    }

    .empty-favorites span {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }

    /* Favorite Card */
    .favorite-card {
      position: relative;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .favorite-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .favorite-image {
      width: 100%;
      height: 120px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .favorite-image::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(to top, rgba(26, 26, 46, 0.9), transparent);
    }

    .favorite-info {
      padding: 16px;
    }

    .favorite-info h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #fff;
      font-weight: 600;
    }

    .favorite-meta {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .meta-badge {
      background: rgba(236, 72, 153, 0.2);
      color: #ec4899;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(236, 72, 153, 0.3);
    }

    .favorite-desc {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .remove-favorite {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(239, 68, 68, 0.9);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
      z-index: 10;
    }

    .remove-favorite:hover {
      background: #ef4444;
      transform: scale(1.1);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .favorites-sidebar {
        width: 100%;
      }

      .favorites-btn {
        padding: 10px 16px;
        font-size: 14px;
      }

      .sidebar-header h2 {
        font-size: 20px;
      }

      .favorite-card {
        margin-bottom: 12px;
      }

      .download-pdf-btn {
        width: 36px;
        height: 36px;
      }
      
      .download-pdf-btn svg {
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 480px) {
      .favorites-btn span:not(.fav-count) {
        display: none;
      }

      .favorites-btn {
        padding: 10px;
      }
    }
  `;

  if (!document.getElementById("favorites-styles")) {
    document.head.appendChild(style);
  }
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
      launchDate: document.getElementById("addLaunchDate").value,
      type: document.getElementById("addType").value,
      image: document.getElementById("addImage").value.trim(),
      description: document.getElementById("addDesc").value.trim(),
    };

    // Add to missionsData array
    missionsData.push(newMission);

    // Save to localStorage
    saveMissionsToStorage();

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
  updateFavoritesSidebar();
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

// =========================
// Edit Mission Handler
// =========================
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

    const originalName = missionData.name; // Store original name before updating

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

    // **NEW: Update favorite mission if it exists**
    const favoriteIndex = favoriteMissions.findIndex(
      (fav) => fav.name === originalName
    );
    if (favoriteIndex !== -1) {
      // Update the favorite mission with new data, but keep the id and addedDate
      favoriteMissions[favoriteIndex] = {
        ...favoriteMissions[favoriteIndex],
        name: updatedMission.name,
        agency: updatedMission.agency,
        launchDate: updatedMission.launchDate,
        type: updatedMission.type,
        image: updatedMission.image,
        description: updatedMission.description,
      };

      // Save updated favorites to localStorage
      localStorage.setItem(
        "favoriteMissions",
        JSON.stringify(favoriteMissions)
      );

      // Update favorites sidebar if open
      updateFavoritesSidebar();
    }

    // Save to localStorage
    saveMissionsToStorage();

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
      const missionData = missionsData[index];

      document.body.removeChild(modal);
      hideContextMenu();

      missionCardToDelete.style.transition = "opacity 0.3s, transform 0.3s";
      missionCardToDelete.style.opacity = "0";
      missionCardToDelete.style.transform = "scale(0.8)";

      setTimeout(() => {
        if (missionCardToDelete && missionCardToDelete.parentNode) {
          missionCardToDelete.remove();

          if (index !== -1 && missionsData[index]) {
            // Remove from missions data
            const deletedMission = missionsData.splice(index, 1)[0];

            // ALSO REMOVE FROM FAVORITES if it exists there
            const favoriteIndex = favoriteMissions.findIndex(
              (fav) => fav.name === deletedMission.name
            );
            if (favoriteIndex !== -1) {
              favoriteMissions.splice(favoriteIndex, 1);
              localStorage.setItem(
                "favoriteMissions",
                JSON.stringify(favoriteMissions)
              );
              updateFavoritesSidebar();
            }
          }

          // Save to localStorage after deletion
          saveMissionsToStorage();

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

// =========================
// Notification System
// =========================
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

// =========================
// Fetching and Filtering Missions
// =========================
function saveMissionsToStorage() {
  localStorage.setItem("missionsData", JSON.stringify(missionsData));
}

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

// Load missions - check localStorage first, then fetch from JSON if empty
if (missionsData.length === 0) {
  // Only fetch from missions.json if no data in localStorage
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
        else if (m.name.toLowerCase().includes("telescope"))
          m.type = "Telescope";
        else if (m.name.toLowerCase().includes("falcon")) m.type = "Rocket";
        else if (
          m.name.toLowerCase().includes("moon") ||
          m.name.toLowerCase().includes("lunar") ||
          m.name.toLowerCase().includes("apollo")
        )
          m.type = "Lunar Mission";
        else m.type = "Probe";
      });

      // Save the fetched data to localStorage for next time
      saveMissionsToStorage();
      displayMissions(missionsData);
    })
    .catch((error) => console.error("Error loading missions:", error));
} else {
  // Data already exists in localStorage, just display it
  displayMissions(missionsData);
}

[agencyFilter, yearFilter, typeFilter, searchInput].forEach((el) =>
  el.addEventListener("input", filterMissions)
);

// =========================
// Initialize on DOM Load
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setupAddMissionButton();
  setupFavoritesButton();

  // Update favorites sidebar if it exists
  updateFavoritesSidebar();
});

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
// Reset Missions on Page Load for testing
// =========================
// function resetMissionsOnLoad() {
//   // Clear localStorage of missions data
//   localStorage.removeItem("missionsData");
//   localStorage.removeItem("favoriteMissions");

//   // Clear the global variables
//   missionsData = [];
//   favoriteMissions = [];

//   console.log("Missions data reset to default");
// }

// // Call this function when the page loads
// window.addEventListener("load", resetMissionsOnLoad);
// // OR call it immediately
// resetMissionsOnLoad();
