let gridSize, maxTime, grid, activeTile;
let reactionTimes = [];
let totalClicks = 0, correctClicks = 0;
let gameActive = false;
let timer;
let streak = 0;
let bestStreak = localStorage.getItem("bestStreak") || 0;

// Load leaderboard from localStorage
let bestFastestTime = parseFloat(localStorage.getItem("bestFastestTime")) || null;
let bestAverageTime = parseFloat(localStorage.getItem("bestAverageTime")) || null;
updateLeaderboardDisplay();

// Sounds
const clickSound = new Audio('https://www.fesliyanstudios.com/play-mp3/387');
const failSound = new Audio('https://www.fesliyanstudios.com/play-mp3/435');

function startGame() {
    gridSize = parseInt(document.getElementById("gridSize").value);
    maxTime = parseInt(document.getElementById("maxTime").value);
    
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

function endGame() {
    gameActive = false;
    showStats();
}

function showStats() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("stats").style.display = "block";
    document.getElementById("streak").innerText = `Longest Streak: ${streak}`;
    
    localStorage.setItem("bestStreak", Math.max(streak, bestStreak));
    updateLeaderboardDisplay();
}

function resetGame() {
    document.getElementById("stats").style.display = "none";
    document.getElementById("setup").style.display = "block";
    gameActive = false;
}

function updateLeaderboardDisplay() {
    document.getElementById("best-fastest-time").innerText = `Fastest Time: ${bestFastestTime || "--"} sec`;
    document.getElementById("best-average-time").innerText = `Best Average Time: ${bestAverageTime || "--"} sec`;
    document.getElementById("best-streak").innerText = `Best Streak: ${bestStreak || "--"}`;
}
