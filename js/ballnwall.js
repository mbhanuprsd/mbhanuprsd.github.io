var canvas;
var canvasContext;

var blockHeight;
var blockWidth;
var blockPadding;

var blocks;

var paddleX;
var paddleY;
var paddleWidth;
var paddleHeight;

var ballPosX;
var ballPosY;
var ballRadius;
var ballSpeedX;
var ballSpeedY;

var showGameOver = false;

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

window.onload = function() {
	canvas = document.getElementById("ballWallCanvas");
	canvas.width = 9*window.innerWidth/10;
	canvas.height = 9*window.innerHeight/10;

	canvasContext = canvas.getContext("2d");

	initGame();

	var framesPerSecond = 30;
	setInterval(updateGame, 1000/framesPerSecond);

	canvas.addEventListener("mousemove", handleMouseMovement);
	canvas.addEventListener("mousedown", handleMouseClick);
}

function handleMouseClick(evt) {
	if (showGameOver) {
		initGame();
	}
}

function handleMouseMovement(evt) {
	var mousePos = calculateMousePos(evt);
	paddleX = mousePos.x - paddleWidth/2;
}

function initGame() {
	showGameOver = false;

	blockWidth = canvas.width/15;
	blockHeight = canvas.height/40;
	blockPadding = canvas.width/150;

	paddleWidth = canvas.width/8;
	paddleHeight = canvas.width/80;
	paddleX = canvas.width/2 - paddleWidth/2;
	paddleY = canvas.height - paddleHeight - blockPadding;

	ballPosX = paddleX;
	ballPosY = paddleY - blockPadding;
	ballRadius = canvas.width/60;

	ballSpeedX = -canvas.height/100;
	ballSpeedY = -canvas.height/100;

	initializeBlocks();
}

function initializeBlocks() {
	//Initialize blocks
	blocks = new Array();
	var blocksMaxY = 0;
	var i = 0;
	while (blocksMaxY < canvas.height/2) {
		var start = i*(blockWidth + blockPadding) + blockPadding;
		var end = canvas.width - start - blockPadding;
		var blockXCoord = start;
		var blockYCorod = i*(blockHeight + blockPadding) + blockPadding;
		blocksMaxY = blockYCorod;
		while (end > blockXCoord + blockWidth) {
			var block = {leftX: blockXCoord, topY: blockYCorod};
			blocks.push(block);
			blockXCoord += (blockWidth + blockPadding);
		}
		i++;
	}
}

function updateGame() {
	if (showGameOver) {
		drawGameOver();
	} else {
		drawGame();
		gameLogic();
	}
}

function drawGameOver() {
	if (blocks.length <= 0) {
		colorRect(0, 0, canvas.width, canvas.height, "green");
	} else {
		colorRect(0, 0, canvas.width, canvas.height, "red");
	}
}

function drawGame() {
	// Draw canvas
	colorRect(0, 0, canvas.width, canvas.height, "black");

	// Draw ball
	colorCircle(ballPosX, ballPosY, ballRadius, "green");

	// Draw blocks
	for (var index = 0; index < blocks.length; index++) {
		var block = blocks[index];
		drawBrick(block);
	}

	// Draw paddle
	colorRect(paddleX, paddleY, paddleWidth, paddleHeight, "white");
}

function drawBrick(block) {
	colorRect(block.leftX, block.topY, blockWidth, blockHeight, "red");
}

function gameLogic() {
	ballPosX += ballSpeedX;
	ballPosY += ballSpeedY;

	setupLeftBoundary();
	setupRightBoundary();
	setupTopBoundary();
	setupBottomBoundary();

	detectCollisionAndRevert();
}

function detectCollisionAndRevert() {
	for (var index = 0; index < blocks.length; index++) {
		var block = blocks[index];
		var blockLeftBoundary = ballPosX + ballRadius > block.leftX;
		var blockRightBoundary = ballPosX - ballRadius < block.leftX + blockWidth;
		var blockTopBoundary = ballPosY + ballRadius > block.topY;
		var blockBottomBoundary = ballPosY - ballRadius < block.topY + blockHeight;
		if (blockLeftBoundary && blockRightBoundary
			&& blockBottomBoundary && blockTopBoundary) {
			blocks.remove(index);
			if ((ballPosX >= block.leftX + blockWidth && ballSpeedX < 0)
				|| (ballPosX <= block.leftX && ballSpeedX > 0)) {
				ballSpeedX = -ballSpeedX;
			}
			if ((ballPosY <= block.topY && ballSpeedY > 0)
				|| (ballPosY >= block.topY + blockHeight && ballSpeedY < 0)) {
				ballSpeedY = -ballSpeedY;
			}
		}
	}
	if (blocks.length <= 0) {
		showGameOver = true;
	}
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function setupLeftBoundary() {
	// Left boundary
	if (ballPosX < ballRadius) {
		ballSpeedX = -ballSpeedX;
	}
}

function setupRightBoundary() {
	// Right boundary
	if (ballPosX > canvas.width - ballRadius) {
		ballSpeedX = -ballSpeedX;
	}
}

function setupTopBoundary() {
	// Top boundary
	if (ballPosY < ballRadius + blockPadding) {
		ballSpeedY = -ballSpeedY;
	}
}

function setupBottomBoundary() {
	// Bottom boundary
	if (ballPosY > canvas.height - ballRadius - 2*blockPadding) {
		if (ballPosX > paddleX &&
			ballPosX < paddleX + paddleWidth) {
			ballSpeedY = -ballSpeedY;

			var deltaX = ballPosX - (paddleX + paddleWidth/2);
			ballSpeedX = deltaX * 0.35;
		} else {
			showGameOver = true;
		}
	}
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
