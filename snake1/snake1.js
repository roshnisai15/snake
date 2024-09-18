const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = 'black';
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let audioturn=new Audio("game-over.mp3");
let snake = [
    
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener('click', resetGame);
gameStart();

function gameStart() {
    running = true;
    
    scoreText.textContent = score;
    
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize); // Changed from gameWidth to gameHeight
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize); // Changed '=' to '()'
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity,
    };
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        
        score += 1;
        audioturn.play();
        scoreText.textContent = `Score : ${score}`;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize); // Changed '=' to '()'
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize); // Changed '=' to '()'
    });
}

function changeDirection(event) {
    const keyPressed = event.key; // Changed from keyCode
    const LEFT = 'ArrowLeft';
    const UP = 'ArrowUp';
    const RIGHT = 'ArrowRight';
    const DOWN = 'ArrowDown';
    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (keyPressed) {
        case LEFT:
            if (!goingRight) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;
        case UP:
            if (!goingDown) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case RIGHT:
            if (!goingLeft) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;
        case DOWN:
            if (!goingUp) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
}

function checkGameOver() {
    if (snake[0].x < 0 || snake[0].x >= gameWidth || snake[0].y < 0 || snake[0].y >= gameHeight) {
        running = false;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
}

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    gameStart();
}
