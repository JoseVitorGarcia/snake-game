const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const audio = new Audio("../assets/audio.mp3");
let isGameOver = false; 
let nextDirection = undefined; 
const size = 30;

const initialPosition = { x: 270, y: 240 };

let snake =[initialPosition] ;

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red},${green},${blue})`;
};

const food = { x: randomPosition(), y: randomPosition(), color: randomColor() };

let direction, loopId;

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  ctx.fillStyle = "#ddd";
  snake.forEach((position, index) => {
    if (index === snake.length - 1) {
      ctx.fillStyle = "green";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const moveSnake = () => {
  if (!direction) return; // Se não houver direção definida, não move a cobra

  const head = snake[snake.length - 1];
  let newHead;

  // Movimenta a cobra na direção atual
  if (direction === "right") {
    newHead = { x: head.x + size, y: head.y };
  } else if (direction === "left") {
    newHead = { x: head.x - size, y: head.y };
  } else if (direction === "down") {
    newHead = { x: head.x, y: head.y + size };
  } else if (direction === "up") {
    newHead = { x: head.x, y: head.y - size };
  }

  // Atualiza a posição da cobra
  snake.push(newHead);
  snake.shift(); // Remove a cauda

  // Após o movimento, atualize a direção para a próxima, se houver
  if (nextDirection && nextDirection !== direction) {
    direction = nextDirection;
    nextDirection = undefined;
  }
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);
    audio.play();
    let x = randomPosition();
    let y = randomPosition();
    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }
    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;
  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

const gameOver = () => {
  isGameOver = true;
  direction = undefined;
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
  clearTimeout(loopId)
};

const gameLoop = () => {
  if (isGameOver) return;
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  
  drawSnake();
  checkEat();
  checkCollision();
  loopId = setTimeout(gameLoop, 180);
};


document.addEventListener("keydown", ({ key }) => {
  if (isGameOver) return;

  // Atualiza a direção apenas se a nova direção não for oposta à atual
  if (key === "ArrowRight" && direction !== "left") {
    nextDirection = "right";
    if (!direction) direction = nextDirection; // Define a direção inicial
  } else if (key === "ArrowLeft" && direction !== "right") {
    nextDirection = "left";
    if (!direction) direction = nextDirection;
  } else if (key === "ArrowDown" && direction !== "up") {
    nextDirection = "down";
    if (!direction) direction = nextDirection;
  } else if (key === "ArrowUp" && direction !== "down") {
    nextDirection = "up";
    if (!direction) direction = nextDirection;
  }

  
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";
  snake =[initialPosition];
  isGameOver =  false
  gameLoop()
});

gameLoop();