const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const highScoreDisplay = document.getElementById("high-score");

let basketX = window.innerWidth / 2;
let score = 0;
let lives = 3;

// ✅ Load high score from localStorage
let highScore = localStorage.getItem("appleHighScore") || 0;
highScoreDisplay.textContent = highScore;

// ✅ Move basket with arrow keys
document.addEventListener("keydown", (e) => {
  const step = 20;
  if (e.key === "ArrowLeft") {
    basketX -= step;
  } else if (e.key === "ArrowRight") {
    basketX += step;
  }
  updateBasketPosition();
});

// ✅ Move basket with mouse drag / touch
function enableDragControl() {
  let dragging = false;

  function moveBasket(clientX) {
    basketX = clientX - 50; // Center basket
    updateBasketPosition();
  }

  gameContainer.addEventListener("mousedown", (e) => {
    dragging = true;
    moveBasket(e.clientX);
  });

  gameContainer.addEventListener("mousemove", (e) => {
    if (dragging) moveBasket(e.clientX);
  });

  gameContainer.addEventListener("mouseup", () => {
    dragging = false;
  });

  // Touch events (for mobile)
  gameContainer.addEventListener("touchstart", (e) => {
    moveBasket(e.touches[0].clientX);
  });

  gameContainer.addEventListener("touchmove", (e) => {
    moveBasket(e.touches[0].clientX);
  });
}

function updateBasketPosition() {
  basketX = Math.max(0, Math.min(window.innerWidth - 100, basketX));
  basket.style.left = basketX + "px";
}

enableDragControl();

// ✅ Create apples
function createApple() {
  const apple = document.createElement("div");
  apple.classList.add("apple");
  apple.style.left = Math.random() * (window.innerWidth - 30) + "px";
  gameContainer.appendChild(apple);
  fallApple(apple);
}

// ✅ Apple falling logic
function fallApple(apple) {
  let top = 0;
  const fallSpeed = 2 + Math.random() * 3;

  const interval = setInterval(() => {
    top += fallSpeed;
    apple.style.top = top + "px";

    const basketRect = basket.getBoundingClientRect();
    const appleRect = apple.getBoundingClientRect();

    // Collision detection
    if (
      appleRect.bottom >= basketRect.top &&
      appleRect.left < basketRect.right &&
      appleRect.right > basketRect.left &&
      appleRect.bottom <= basketRect.bottom + 40
    ) {
      score++;
      scoreDisplay.textContent = score;

      // ✅ Update high score
      if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem("appleHighScore", highScore);
      }

      apple.remove();
      clearInterval(interval);
    }

    // Missed apple
    if (top > window.innerHeight) {
      apple.remove();
      clearInterval(interval);
      lives--;
      livesDisplay.textContent = lives;
      if (lives <= 0) {
        alert("Game Over! Final Score: " + score);
        location.reload();
      }
    }
  }, 20);
}

// ✅ Spawn apples at intervals
setInterval(createApple, 1000);
