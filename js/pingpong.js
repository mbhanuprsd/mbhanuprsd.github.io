var canvas;
var canvasContext;

var ballX = 20;
var ballY = 20;
var ballSpeedX = 10;
var ballSpeedY = 4;

var leftPaddleY = 230;
var rightPaddleY = 230;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;

const WINNING_SCORE = 3;

// DIfficulty easy(2) to hard (8)
const DIFFICULTY = 8

var player1Score = 0;
var player2Score = 0;
var showWinScreen = false;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var rootWindow = document.documentElement;
	var mouseX = evt.clientX - rect.left - rootWindow.scrollLeft;
	var mouseY = evt.clientY - rect.top - rootWindow.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	}
}

function ballReset() {
	if (player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {
		showWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");

	var framesPerSecond = 30;
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener("mousedown", handleMouseClick);
	canvas.addEventListener("mousemove", handleMouseMovement);
}

function handleMouseClick(evt) {
	if (showWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}

function handleMouseMovement(evt) {
	var mousePos = calculateMousePos(evt);
	leftPaddleY = mousePos.y - PADDLE_HEIGHT/2;
}

function computerMovement() {
	var rightPaddleCenter = rightPaddleY + (PADDLE_HEIGHT/2);
	if (rightPaddleCenter < ballY - PADDLE_HEIGHT/DIFFICULTY) {
		rightPaddleY += 6;
	} else if (rightPaddleCenter > ballY + PADDLE_HEIGHT/DIFFICULTY) {
		rightPaddleY -= 6;
	}
}

function moveEverything() {
	if(showWinScreen) {
		return;
	}

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	checkLeftBoundary();
	checkRightBoundary();
	setupTopBoundary();
	setupBottomBoundary();

	computerMovement();
}

function checkLeftBoundary() {
	// Left boundary
	if (ballX < BALL_RADIUS) {
		if (ballY > leftPaddleY &&
			ballY < leftPaddleY + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (leftPaddleY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++;
			ballReset();
		}
	}
}

function checkRightBoundary() {
	// Right boundary
	if (ballX > canvas.width - BALL_RADIUS) {
		if (ballY > rightPaddleY &&
			ballY < rightPaddleY + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (rightPaddleY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++;
			ballReset();
		}
	}
}

function setupTopBoundary() {
	// Top boundary
	if (ballY < BALL_RADIUS) {
		ballSpeedY = -ballSpeedY;
	}
}

function setupBottomBoundary() {
	// Bottom boundary
	if (ballY > canvas.height - BALL_RADIUS) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawEverything() {	
	canvasContext.font="16px Arial";
	// Draw black canvas
	colorRect(0, 0, canvas.width, canvas.height, "black");

	if (showWinScreen) {
		if (player1Score >= WINNING_SCORE) {
			colorText("You Won!!! :)", canvas.width/2 - 50, canvas.height/4, "green");
		} else if (player2Score >= WINNING_SCORE) {
			colorText("Opponent Won!!! :(", canvas.width/2 - 50, canvas.height/4, "red");
		}
		colorText("Click to continue", canvas.width/2 - 50, canvas.height/2, "white");
		return;
	}

	drawNet();

	// Draw ball
	colorCircle(ballX, ballY, BALL_RADIUS, "white");

	// Draw left paddle
	colorRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");

	// Draw right paddle
	colorRect(canvas.width - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH,
		PADDLE_HEIGHT, "white");

	drawScore();
}

function drawNet() {
	for (var i = 0; i <= canvas.height; i+=40) {
		colorRect(canvas.width/2 - 1, i, 2, 20, "white");
	}
}

function drawScore() {
	colorText(player1Score, canvas.width/4, canvas.height/4, "green");
	colorText(player2Score, 3*canvas.width/4, canvas.height/4, "red");
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorText(text, leftX, topY, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillText(text, leftX, topY);
}
