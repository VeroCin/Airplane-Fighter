const gameContainer = document.getElementById('game-container');
const scoreButton = document.getElementById('score-button');
const airplaneWidth = 50;
const five = 5;

const obstacles = [];
const projectiles = [];
let isGameOver = false;
let score = 0;

const airplane = {
    element: document.getElementById('airplane'),
    x: 0, 
    y: 450,
    width: 50,
};

function initializeGame() {
    setupAndHandleAirplaneMovement(airplane);
    gameLoop();
}

function gameLoop() {
    if (isGameOver) {
        endGame();
        return;
    }
    
    if (Math.random() < 0.02) {
        createObstacle();
    }
    
    updateObstacles();
    updateProjectiles();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

function setupAndHandleAirplaneMovement(airplane) {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' && airplane.x > 0) {
            airplane.x -= airplaneWidth;
        } else if (event.key === 'ArrowRight' &&
             airplane.x < gameContainer.offsetWidth - airplane.width) {
            airplane.x += airplaneWidth;
        } else if (event.key === ' ') {
            createProjectile();
        }
        airplane.element.style.left = `${airplane.x}px`;
        airplane.element.style.top = `${airplane.y}px`;
    });
}

function createProjectile() {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = `${airplane.x}px`;
    projectile.style.top = `${airplane.y}px`;
    gameContainer.appendChild(projectile);
    projectiles.push(projectile);
}

function updateProjectiles() {
    for (let i = 0; i < projectiles.length; ++i) {
        const projectile = projectiles[i];
        let projectileY = parseFloat(projectile.style.top);
        projectileY -= five; 
        projectile.style.top = `${projectileY}px`;
        if (projectileY < 0) {
            gameContainer.removeChild(projectile);
            projectiles.splice(i, 1);
            --i;
        } else {
            checkProjectileCollision(projectile, i);
        }
    }
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
    obstacle.style.top = '0px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; ++i) {
        const obstacle = obstacles[i];
        let obstacleY = parseFloat(obstacle.style.top);
        obstacleY += five; 
        obstacle.style.top = `${obstacleY}px`;
        if (obstacleY > gameContainer.offsetHeight) {
            gameContainer.removeChild(obstacle);
            obstacles.splice(i, 1);
            ++score;
            --i;
        }
    }
}

function checkProjectileCollision(projectile, projectileIndex) {
    const projectileRect = projectile.getBoundingClientRect();
    for (let i = 0; i < obstacles.length; ++i) {
        const obstacle = obstacles[i];
        const obstacleRect = obstacle.getBoundingClientRect();
        if (projectileRect.left < obstacleRect.right &&
            projectileRect.right > obstacleRect.left &&
            projectileRect.top < obstacleRect.bottom &&
            projectileRect.bottom > obstacleRect.top) {
            gameContainer.removeChild(obstacle);
            obstacles.splice(i, 1);
            gameContainer.removeChild(projectile);
            projectiles.splice(projectileIndex, 1);
            ++score;
            return;
        }
    }
}

function checkCollision() {
    const airplaneRect = airplane.element.getBoundingClientRect();
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
    scoreButton.textContent = 'Game Over! Your score is ' + score;
    scoreButton.style.display = 'block';
}

initializeGame();

