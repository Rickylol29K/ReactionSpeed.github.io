let gridSize, maxTime, grid, activeTile;
let reactionTimes = [];
let totalClicks = 0, correctClicks = 0;
let gameActive = false;
let timer;
let streak = 0, bestStreak = localStorage.getItem("bestStreak") || 0;

// Load leaderboard from localStorage
let bestFastestTime = parseFloat(localStorage.getItem("bestFastestTime")) || null;
let bestAverageTime = parseFloat(localStorage.getItem("bestAverageTime")) || null;
updateLeaderboardDisplay();

// Sounds
const clickSound = new Audio('https://www.fesliyanstudios.com/play-mp3/387');
const failSound = new Audio('https://www.fesliyanstudios.com/play-mp3/435');

// Start game
function startGame() {
    gridSize = parseInt(document.getElementById("gridSize").value);
    maxTime = parseInt(document.getElementById("maxTime").value);

    document.body.style.backgroundColor = "#e3e3e3";
    document.getElementById("setup").style.display = "none";
    document.getElementById("game-container").style.display = "block";

    createGrid();
    document.getElementById("countdown").innerText = "Get ready...";
    
    setTimeout(() => {
        document.getElementById("countdown").innerText = "";
        gameActive = true;
        activateRandomTile();
    }, 3000);
}

// Create grid
function createGrid() {
    grid = document.getElementById("grid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.index = i;
        tile.addEventListener("click", handleTileClick);
        grid.appendChild(tile);
    }
}

// Activate tile
function activateRandomTile() {
    if (!gameActive) return;

    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.classList.remove("active"));

    let randomIndex = Math.floor(Math.random() * tiles.length);
    activeTile = tiles[randomIndex];
    activeTile.classList.add("active");

    let startTime = Date.now();
    totalClicks++;

    timer = setTimeout(() => {
        gameActive = false;
        failSound.play();
        showStats();
    }, maxTime * 1000);

    activeTile.dataset.startTime = startTime;
}

// Handle clicks
function handleTileClick(event) {
    if (!gameActive) return;

    let clickedTile = event.target;
    if (clickedTile === activeTile) {
        clearTimeout(timer);
        clickSound.play();

        let reactionTime = (Date.now() - activeTile.dataset.startTime) / 1000;
        reactionTimes.push(reactionTime);
        correctClicks++;
        streak++;

        activateRandomTile();
    }
}

// Show stats
function showStats() {
    document.getElementById("streak").innerText = `Longest Streak: ${streak}`;
    localStorage.setItem("bestStreak", Math.max(streak, bestStreak));
    updateLeaderboardDisplay();
}

// Reset game
function resetGame() {
    // Hide the stats screen
    document.getElementById("stats").style.display = "none";

    // Show the setup screen
    document.getElementById("setup").style.display = "block";

    // Reset background color
    document.body.style.backgroundColor = "#f4f4f4";

    // Clear previous game data
    reactionTimes = [];
    totalClicks = 0;
    correctClicks = 0;
    gameActive = false;

    // Clear the grid (to ensure fresh tiles)
    if (grid) {
        grid.innerHTML = "";
    }
}

