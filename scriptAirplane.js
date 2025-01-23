const gameContainer = document.getElementById('game-container');
const airplane = document.getElementById('airplane');
const scoreButton = document.getElementById('score-button');

let airplaneX = 0;
const airplaneWidth = 50;
let obstacles = [];
let isGameOver = false;
let startTime = Date.now();
let winObstacle = 0;

function setupAirplane() {
    document.addEventListener('keydown', handleAirplaneMovement);
}

function updateAirplanePosition() {
    airplane.style.left = `${airplaneX}px`;
}

function handleAirplaneMovement(event) {
    if (event.key === 'ArrowLeft' && airplaneX > 0) {
        airplaneX -= 50;
    } else if (event.key === 'ArrowRight' && airplaneX < gameContainer.offsetWidth - airplaneWidth) {
        airplaneX += 50;
    }
    updateAirplanePosition();
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
    obstacle.style.top = '0px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        let obstacleY = parseFloat(obstacle.style.top);
        obstacleY += 5; 
        obstacle.style.top = obstacleY + 'px';
    }
}

function resetObstacles() {
    for (let i = 0; i < obstacles.length; ++i) {
        const obstacle = obstacles[i];
        if (parseFloat(obstacle.style.top) > gameContainer.offsetHeight) {
            gameContainer.removeChild(obstacle);
            obstacles.splice(i, 1);
            ++winObstacle;
            --i;
        }
    }
}

function checkCollision() {
    const airplaneRect = airplane.getBoundingClientRect();
    for (let i = 0; i < obstacles.length; ++i) {
        const obstacleRect = obstacles[i].getBoundingClientRect();
        if (airplaneRect.left < obstacleRect.right &&
            airplaneRect.right > obstacleRect.left &&
            airplaneRect.top < obstacleRect.bottom &&
            airplaneRect.bottom > obstacleRect.top) {
                isGameOver = true;
                break;
        }
    }
}

function endGame() {
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    scoreButton.textContent = 'Game Over! Your score is ' + winObstacle;
    scoreButton.style.display = 'block';
}

function gameLoop() {
    if (isGameOver) {
        endGame();
        return;
    }
    
    if (Math.random() < 0.02) {
        createObstacle();
    }
    
    moveObstacles();
    resetObstacles();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

function initializeGame() {
    setupAirplane();
    updateAirplanePosition();
    gameLoop();
}

initializeGame();
