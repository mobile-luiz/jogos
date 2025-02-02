// Seleciona o canvas
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Configurações do canvas
canvas.width = 800;
canvas.height = 400;

// Variáveis
const paddleWidth = 10;
const paddleHeight = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
const ballRadius = 7;
let balls = [
  { x: canvas.width / 2, y: canvas.height / 2, speedX: 4, speedY: 4, color: "white" },
  { x: canvas.width / 2, y: canvas.height / 2, speedX: -4, speedY: -4, color: "red" }
];
const initialBallSpeed = 4;
const maxBallSpeed = 10;
let speedMultiplier = 1.07;
let playerScore = 0;
let computerScore = 0;
let gameRunning = true;

// Sons
const hitSound = new Audio("sounds/hit.wav");
const scoreSound = new Audio("sounds/score.wav");
const bgMusic = new Audio("sounds/background.mp3");
bgMusic.loop = true;

// Controle do jogador
document.addEventListener("mousemove", (event) => {
  const canvasRect = canvas.getBoundingClientRect();
  playerY = event.clientY - canvasRect.top - paddleHeight / 2;
  playerY = Math.max(0, Math.min(playerY, canvas.height - paddleHeight));
});

// Função para desenhar elementos
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.shadowColor = "rgba(255,255,255,0.5)";
  ctx.shadowBlur = 10;
  ctx.fillRect(x, y, width, height);
  ctx.shadowBlur = 0;
}

function drawBall(ball) {
  ctx.fillStyle = ball.color;
  ctx.shadowColor = "rgba(255,255,255,0.8)";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function updateBalls() {
  balls.forEach(ball => {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
      ball.speedY *= -1;
    }

    if (
      ball.x - ballRadius < paddleWidth &&
      ball.y > playerY &&
      ball.y < playerY + paddleHeight
    ) {
      ball.speedX *= -speedMultiplier;
      ball.speedY *= speedMultiplier;
      ball.speedX = Math.sign(ball.speedX) * Math.min(Math.abs(ball.speedX), maxBallSpeed);
      ball.speedY = Math.sign(ball.speedY) * Math.min(Math.abs(ball.speedY), maxBallSpeed);
      hitSound.play();
    }

    if (
      ball.x + ballRadius > canvas.width - paddleWidth &&
      ball.y > computerY &&
      ball.y < computerY + paddleHeight
    ) {
      ball.speedX *= -speedMultiplier;
      ball.speedY *= speedMultiplier;
      ball.speedX = Math.sign(ball.speedX) * Math.min(Math.abs(ball.speedX), maxBallSpeed);
      ball.speedY = Math.sign(ball.speedY) * Math.min(Math.abs(ball.speedY), maxBallSpeed);
      hitSound.play();
    }

    if (ball.x - ballRadius < 0) {
      computerScore++;
      scoreSound.play();
      resetBall(ball);
      checkSpeedIncrease();
    }

    if (ball.x + ballRadius > canvas.width) {
      playerScore++;
      scoreSound.play();
      resetBall(ball);
      checkSpeedIncrease();
    }
  });
}

function updateComputer() {
  const targetY = balls[0].y - paddleHeight / 2;
  computerY += (targetY - computerY) * 0.2;
}

function resetBall(ball) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
  ball.speedY = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function checkSpeedIncrease() {
  if ((playerScore + computerScore) % 5 === 0) {
    balls.forEach(ball => {
      ball.speedX *= 1.1;
      ball.speedY *= 1.1;
    });
  }
}

function drawScore() {
  ctx.font = "30px Poppins";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`${playerScore}`, canvas.width / 4, 50);
  ctx.fillText(`${computerScore}`, (canvas.width / 4) * 3, 50);
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawRect(0, playerY, paddleWidth, paddleHeight, "white");
  drawRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight, "white");
  balls.forEach(drawBall);
  drawScore();
}

function gameLoop() {
  if (gameRunning) {
    updateBalls();
    updateComputer();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

function toggleGame() {
  gameRunning = !gameRunning;
  document.getElementById("toggleButton").textContent = gameRunning ? "Pausar" : "Continuar";
}

document.addEventListener("keydown", (event) => {
  if (event.key === "r" || event.key === "R") {
    playerScore = 0;
    computerScore = 0;
    balls.forEach(resetBall);
  }
  if (event.key === "m" || event.key === "M") {
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  }
});

gameLoop();
