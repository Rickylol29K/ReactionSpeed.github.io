let gridSize, maxTime, grid, activeTile;
let reactionTimes = [];
let totalClicks = 0, correctClicks = 0;
let gameActive = false;
let timer;

// Load leaderboard from localStorage
let bestFastestTime = parseFloat(localStorage.getItem("bestFastestTime")) || null;
let bestAverageTime = parseFloat(localStorage.getItem("bestAverageTime")) || null;
updateLeaderboardDisplay();

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
        showStats();
    }, maxTime * 1000);

    activeTile.dataset.startTime = startTime;
}

function handleTileClick(event) {
    if (!gameActive) return;

    let clickedTile = event.target;
    if (clickedTile === activeTile) {
        clearTimeout(timer);

        clickedTile.style.transform = "scale(0.9)";
        setTimeout(() => clickedTile.style.transform = "scale(1)", 150);

        let reactionTime = (Date.now() - activeTile.dataset.startTime) / 1000;
        reactionTimes.push(reactionTime);
        correctClicks++;

        activateRandomTile();
    }
}

function endGame() {
    gameActive = false;
    showStats();
}

function showStats() {
    document.body.style.backgroundColor = "#f4f4f4";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("stats").style.display = "block";

    if (reactionTimes.length > 0) {
        let fastest = Math.min(...reactionTimes).toFixed(2);
        let avg = (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2);

        document.getElementById("fastest-time").innerText = `Fastest Time: ${fastest} sec`;
        document.getElementById("average-time").innerText = `Average Time: ${avg} sec`;

        if (!bestFastestTime || fastest < bestFastestTime) {
            localStorage.setItem("bestFastestTime", fastest);
            bestFastestTime = fastest;
        }
        if (!bestAverageTime || avg < bestAverageTime) {
            localStorage.setItem("bestAverageTime", avg);
            bestAverageTime = avg;
        }

        updateLeaderboardDisplay();
    }
}

function updateLeaderboardDisplay() {
    document.getElementById("best-fastest-time").innerText = `Fastest Time: ${bestFastestTime || "--"} sec`;
    document.getElementById("best-average-time").innerText = `Best Average Time: ${bestAverageTime || "--"} sec`;
}
