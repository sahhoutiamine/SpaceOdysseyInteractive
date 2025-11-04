const targetDate = new Date("2027-05-01T00:00:00");

const display = document.querySelector(".time-display");

const tu = document.querySelectorAll(".time-unit");

function updateCountdown() {
  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) {
    display.innerHTML = "<span class='time-unit'>🚀 Mission Complete!</span>";
    clearInterval(timer);
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  tu[0].innerText = `${days}D`;
  tu[1].innerText = `${hours}H`;
  tu[2].innerText = `${minutes}M`;
  tu[3].innerText = `${seconds}S`;
}

// Run immediately
updateCountdown();

// Update every second
const timer = setInterval(updateCountdown, 1000);
