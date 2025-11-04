// =========================
// Enhanced Form Validation
// =========================
document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const contactForm = document.querySelector("form");
  if (!contactForm) return;

  // Get all required input fields
  const requiredFields = contactForm.querySelectorAll(
    "input[required], textarea[required]"
  );

  // Get specific fields
  const emailField = contactForm.querySelector('input[type="email"]');
  const phoneField = contactForm.querySelector(
    'input[type="tel"], input[placeholder*="Phone"]'
  );
  const messageField = contactForm.querySelector("textarea");

  // Add event listeners for enhanced real-time validation
  requiredFields.forEach((field) => {
    field.addEventListener("blur", validateField);
    field.addEventListener("input", handleRealTimeValidation);
    field.addEventListener("focus", handleFieldFocus);
  });

  // Special handling for specific fields
  if (emailField) {
    emailField.addEventListener("blur", validateEmail);
  }

  if (phoneField) {
    phoneField.addEventListener("blur", validatePhone);
  }

  if (messageField) {
    messageField.addEventListener("blur", validateMessage);
    messageField.addEventListener("input", handleMessageInput);
  }

  // Form submission handler
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!validateField.call(field)) {
        isFormValid = false;
      }
    });

    // Validate email format
    if (emailField && !validateEmail.call(emailField)) {
      isFormValid = false;
    }

    // Validate phone
    if (phoneField && !validatePhone.call(phoneField)) {
      isFormValid = false;
    }

    // Validate message
    if (messageField && !validateMessage.call(messageField)) {
      isFormValid = false;
    }

    // If form is valid, submit it
    if (isFormValid) {
      showFormSuccess();
      // In a real application, you would submit the form data to a server
      setTimeout(() => {
        window.location.href = "contact-success.html";
      }, 1500);
    } else {
      // Scroll to first error with smooth animation
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      // Add shake animation to invalid fields
      shakeInvalidFields();
    }
  });

  // Enhanced field validation function
  function validateField() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;

    // Clear any existing error
    clearFieldError.call(field);

    // Check if field is empty
    if (value === "") {
      showFieldError(field, "This field is required");
      isValid = false;
    }

    // Update field styling with animation
    updateFieldStyle(field, isValid);

    return isValid;
  }

  // Enhanced email validation function
  function validateEmail() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;

    // Clear any existing error
    clearFieldError.call(field);

    // Check if email is empty
    if (value === "") {
      showFieldError(field, "Email is required");
      isValid = false;
    }
    // Check email format
    else if (!isValidEmail(value)) {
      showFieldError(field, "Please enter a valid email address");
      isValid = false;
    }

    // Update field styling with animation
    updateFieldStyle(field, isValid);

    return isValid;
  }

  // Enhanced phone validation
  function validatePhone() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;

    // Clear any existing error
    clearFieldError.call(field);

    // Check if phone is empty (now required)
    if (value === "") {
      showFieldError(field, "Phone number is required");
      updateFieldStyle(field, false);
      return false;
    }

    // Remove all non-digit characters to count actual digits
    const digitsOnly = value.replace(/\D/g, "");

    // Check if exactly 10 digits
    if (digitsOnly.length !== 10) {
      showFieldError(
        field,
        `Please enter exactly 10 digits (currently ${digitsOnly.length})`
      );
      updateFieldStyle(field, false);
      return false;
    }

    updateFieldStyle(field, true);
    return true;
  }

  // Enhanced message validation
  function validateMessage() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;

    // Clear any existing error
    clearFieldError.call(field);

    // Check if message is empty
    if (value === "") {
      showFieldError(field, "Message is required");
      isValid = false;
    }
    // Check minimum length
    else if (value.length < 10) {
      showFieldError(
        field,
        `Message too short (${value.length}/10 characters)`
      );
      isValid = false;
    }
    // Check maximum length
    else if (value.length > 1000) {
      showFieldError(
        field,
        `Message too long (${value.length}/1000 characters)`
      );
      isValid = false;
    }

    // Update field styling with animation
    updateFieldStyle(field, isValid);

    return isValid;
  }

  // Real-time validation with debouncing
  function handleRealTimeValidation() {
    const field = this;
    const value = field.value.trim();

    // Clear existing timeout
    if (field.validationTimeout) {
      clearTimeout(field.validationTimeout);
    }

    // Set new timeout for real-time validation
    field.validationTimeout = setTimeout(() => {
      if (value !== "") {
        if (field === emailField && value !== "") {
          validateEmail.call(field);
        } else if (field === phoneField && value !== "") {
          validatePhone.call(field);
        } else if (field === messageField && value !== "") {
          validateMessage.call(field);
        } else {
          validateField.call(field);
        }
      } else {
        clearFieldError.call(field);
        updateFieldStyle(field, true);
      }
    }, 500);
  }

  // Handle message input with character counter
  function handleMessageInput() {
    const field = this;
    const value = field.value;
    const charCount = value.length;

    // Update or create character counter
    let counter = field.parentNode.querySelector(".char-counter");
    if (!counter) {
      counter = document.createElement("div");
      counter.className = "char-counter";
      counter.style.fontSize = "0.75rem";
      counter.style.marginTop = "5px";
      counter.style.textAlign = "right";
      counter.style.transition = "color 0.3s ease";
      field.parentNode.appendChild(counter);
    }

    counter.textContent = `${charCount}/1000 characters`;

    // Update color based on length
    if (charCount > 1000) {
      counter.style.color = "#e74c3c";
    } else if (charCount < 10) {
      counter.style.color = "#e67e22";
    } else {
      counter.style.color = "#000000ff";
    }
  }

  // Handle field focus with animation
  function handleFieldFocus() {
    const field = this;

    // Add focus animation
    field.style.transform = "scale(1.02)";
    field.style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.2)";

    // Remove animation after transition
    setTimeout(() => {
      field.style.transform = "scale(1)";
      field.style.boxShadow = "";
    }, 200);

    // Clear any existing errors when user focuses
    clearFieldError.call(field);
  }

  // Email format validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enhanced error message display
  function showFieldError(field, message) {
    // Remove existing error message
    clearFieldError.call(field);

    // Create error message element with better styling
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 5px;
      padding: 8px 12px;
      background: #fdf2f2;
      border-left: 3px solid #e74c3c;
      border-radius: 0 4px 4px 0;
      animation: slideIn 0.3s ease-out;
    `;

    // Insert error message after the field
    field.parentNode.appendChild(errorElement);
  }

  // Clear error message for a field
  function clearFieldError() {
    const field = this;
    const errorElement = field.parentNode.querySelector(".error-message");
    const charCounter = field.parentNode.querySelector(".char-counter");

    if (errorElement) {
      errorElement.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.remove();
        }
      }, 300);
    }

    // Remove character counter for non-message fields
    if (charCounter && field !== messageField) {
      charCounter.remove();
    }
  }

  // Enhanced field styling with full border
  function updateFieldStyle(field, isValid) {
    const transition = "all 0.3s ease";

    field.style.transition = transition;
    field.style.border = "2px solid";
    field.style.borderRadius = "4px";
    field.style.padding = "10px 12px";

    if (!isValid) {
      // Invalid field styling
      field.style.borderColor = "#e74c3c";
      field.style.backgroundColor = "#fdf2f2";
      field.style.boxShadow = "0 2px 8px rgba(231, 76, 60, 0.1)";

      // Add shake animation
      field.style.animation = "shake 0.5s ease-in-out";
    } else {
      // Valid field styling
      field.style.borderColor = "#000000ff";
      field.style.backgroundColor = "#f2f9f7";
      field.style.boxShadow = "0 2px 8px rgba(39, 174, 96, 0.1)";
    }

    // Reset animation after it completes
    setTimeout(() => {
      field.style.animation = "";
    }, 500);
  }

  // Shake animation for invalid fields
  function shakeInvalidFields() {
    const invalidFields = contactForm.querySelectorAll(".error-message");

    invalidFields.forEach((error) => {
      const field = error.parentNode.querySelector("input, textarea");
      if (field) {
        field.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
          field.style.animation = "";
        }, 500);
      }
    });
  }

  // Show form success animation
  function showFormSuccess() {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Update button to show loading state
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitButton.disabled = true;
    submitButton.style.cssText = `
      background: #000000ff;
      transform: scale(0.95);
      transition: all 0.3s ease;
    `;

    // Add success animation to form
    contactForm.style.animation = "formSuccess 1s ease-in-out";
  }

  // Add CSS animations to the document
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-10px);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes formSuccess {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Ensure smooth transitions for all form elements */
    form input, form textarea {
      transition: all 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
});
