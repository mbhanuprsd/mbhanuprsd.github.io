var canvas;
var canvasContext;

window.onload = function () {
	canvas = document.getElementById("tetrisCanvas");
	canvas.width = 9*window.innerWidth/10;
	canvas.height = 9*window.innerHeight/10;

	canvasContext = canvas.getContext("2d");

	var framesPerSecond = 30;
	setInterval(updateGame, 1000/framesPerSecond);
}

function updateGame() {
	drawGame();
	applyLogic();
}

function drawGame() {
	colorRect(0, 0, canvas.width, canvas.height, "black");
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
