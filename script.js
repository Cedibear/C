const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const shootButton = document.getElementById('shoot');
const passButton = document.getElementById('pass');
const sprintButton = document.getElementById('sprint');
const throughButton = document.getElementById('through');

canvas.width = 800;
canvas.height = 400;

let score = 0;

let player = {
    x: 50,
    y: 200,
    width: 50,
    height: 50,
    color: 'red',
    speed: 5,
    dx: 0,
    dy: 0,
    isSprinting: false
};

let aiPlayer = {
    x: 700,
    y: 200,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 3,
    dy: 0
};

let ball = {
    x: 400,
    y: 200,
    radius: 10,
    color: 'white',
    speedX: 3,
    speedY: 3
};

let goal = {
    x: 750,
    y: 150,
    width: 50,
    height: 100,
    color: 'yellow'
};

let playerScore = 0;
let aiScore = 0;

function drawPlayer(player) {
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

function drawGoal() {
    context.fillStyle = goal.color;
    context.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function update() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.speedX = -ball.speedX;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    // AI Player Movement
    if (aiPlayer.y + aiPlayer.height / 2 < ball.y) {
        aiPlayer.dy = aiPlayer.speed;
    } else if (aiPlayer.y + aiPlayer.height / 2 > ball.y) {
        aiPlayer.dy = -aiPlayer.speed;
    } else {
        aiPlayer.dy = 0;
    }
    
    aiPlayer.y += aiPlayer.dy;

    if (aiPlayer.y < 0) {
        aiPlayer.y = 0;
    } else if (aiPlayer.y + aiPlayer.height > canvas.height) {
        aiPlayer.y = canvas.height - aiPlayer.height;
    }

    // Check collision with goal
    if (
        ball.x + ball.radius > goal.x &&
        ball.x - ball.radius < goal.x + goal.width &&
        ball.y + ball.radius > goal.y &&
        ball.y - ball.radius < goal.y + goal.height
    ) {
        playerScore++;
        scoreDisplay.innerText = `Player: ${playerScore} - AI: ${aiScore}`;
        resetBall();
    }

    // Check collision with AI goal
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.x + ball.radius > player.x &&
        ball.y + ball.radius > player.y &&
        ball.y - ball.radius < player.y + player.height
    ) {
        aiScore++;
        scoreDisplay.innerText = `Player: ${playerScore} - AI: ${aiScore}`;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 3;
    ball.speedY = 3;
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player);
    drawPlayer(aiPlayer);
    drawBall();
    drawGoal();
    update();
    requestAnimationFrame(gameLoop);
}

function shootHandler() {
    ball.speedX = player.isSprinting ? 10 : 5;
    ball.speedY = player.isSprinting ? 4 : 2;
}

function passHandler() {
    ball.speedX = player.isSprinting ? 6 : 3;
    ball.speedY = player.isSprinting ? 2 : 1;
}

function sprintHandler() {
    player.isSprinting = !player.isSprinting;
}

function throughHandler() {
    // Add through ball logic here
}

// Initialize joystick
const joystick = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50px', bottom: '50px' },
    color: 'red'
});

joystick.on('move', (evt, data) => {
    if (data.direction) {
        switch (data.direction.angle) {
            case 'up':
                player.dy = player.isSprinting ? -player.speed * 2 : -player.speed;
                break;
            case 'down':
                player.dy = player.isSprinting ? player.speed * 2 : player.speed;
                break;
            case 'left':
                player.dx = player.isSprinting ? -player.speed * 2 : -player.speed;
                break;
            case 'right':
                player.dx = player.isSprinting ? player.speed * 2 : player.speed;
                break;
        }
    }
});

joystick.on('end', () => {
    player.dx = 0;
    player.dy = 0;
});

shootButton.addEventListener("click", shootHandler);
passButton.addEventListener("click", passHandler);
sprintButton.addEventListener("click", sprintHandler);
throughButton.addEventListener("click", throughHandler);

gameLoop();
