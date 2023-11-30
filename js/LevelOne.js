let score = 0; // Score Awal
let pipeSpeed = 3; // Kecepatan Awal Pipa
let gamePaused = false; // Nilai Awal Pause
let gameOver = false;

//  Buat class Player
class Ninja {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = 40;
		this.speedY = 0;
	}

	Jump() {
		this.speedY = -8;
	}

	update() {
		this.speedY += gravity;
		this.y += this.speedY;
	}

	draw() {
		const NinjaImage = new Image();
		NinjaImage.src = "../images/Ninja.png";
		ctx.drawImage(NinjaImage, this.x, this.y, this.width, this.height);
	}
}

class Pipe {
	constructor() {
		this.x = canvas.width;
		this.width = 50;
		this.height = Math.floor(Math.random() * 200) + 100;
		this.passed = false;
	}

	update() {
		this.x -= pipeSpeed; // Sesuaikan kecepatan pipa
	}

	draw() {
		ctx.fillStyle = "#F55"; // Warna Pipa
		ctx.fillRect(this.x, 0, this.width, this.height);
		ctx.fillRect(
			this.x,
			this.height + 200,
			this.width,
			canvas.height - this.height - 100
		);
	}
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gravity = 0.55;
const ninja = new Ninja(50, canvas.height / 2);
const pipes = [];

function gameLoop() {
    if(!gamePaused) {
        update();
        draw();
    } 
	requestAnimationFrame(gameLoop);
}

function update() {
	ninja.update();

	// Logika untuk memunculkan pipa
	if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 400) {
		pipes.push(new Pipe());
	}

	pipes.forEach((pipe) => {
		pipe.update();
		if (checkCollision(ninja, pipe)) {
			// Lakukan Game Over
			gamePaused = true;
			gameOver = true;
			GameOver();

		} else if (pipe.x + pipe.width < ninja.x && !pipe.passed) {
			pipe.passed = true;
			score++;

			// Tambah Kecepatan Pipa Setiap Score Mencapai Kelipatan 10
			if (score % 5 === 0) {
				pipeSpeed += 1;
			}

			if (score >= 20) {
				GameWinner()
				gamePaused = true 
			}
		}
	});

	// Hapus Jika pipa tidak terlihat di screen canvas
	pipes.filter((pipe) => pipe.x + pipe.width > 0);
}

function GameOver() {
	const GameOverMenu = document.getElementById('game-over');
	GameOverMenu.style.display = "block"
	GameOverMenu.innerHTML = "" // Hapus game over sebelumnya
	const card = document.createElement('div');
	const cardTitle = document.createElement('h2');
	const cardBody = document.createElement('div');
	const displayScore = document.createElement('p');
	const restart = document.createElement('a');
	const mainmenu = document.createElement('a');

	card.className = 'card';
	cardTitle.className = 'card-title';
	cardBody.className = 'card-body';
	displayScore.className = 'score';
	restart.className = 'btn';
	mainmenu.className = 'btn';
	displayScore.innerHTML = "Score: " + score;
	restart.innerHTML = 'Restart'
	restart.setAttribute('onclick', 'restart()')
	cardTitle.innerHTML = 'Game Over'
	mainmenu.innerHTML = 'Main Menu' 
	mainmenu.href = '../index.html'

	GameOverMenu.appendChild(card);
	card.appendChild(cardBody);
	cardBody.appendChild(cardTitle);
	cardBody.appendChild(displayScore);
	cardBody.appendChild(restart)
	cardBody.appendChild(mainmenu)

	return GameOverMenu
}

function GameWinner() {
	const GameWinMenu = document.getElementById('game-win');
	GameWinMenu.style.display = "block"
	GameWinMenu.innerHTML = "" // Hapus game over sebelumnya
	const card = document.createElement('div');
	const cardTitle = document.createElement('h2');
	const cardBody = document.createElement('div');
	const displayScore = document.createElement('p');
	const restart = document.createElement('a');
	const mainmenu = document.createElement('a');

	card.className = 'card';
	cardTitle.className = 'card-title';
	cardBody.className = 'card-body';
	displayScore.className = 'score';
	restart.className = 'btn';
	mainmenu.className = 'btn';
	displayScore.innerHTML = "Score: " + score;
	restart.innerHTML = 'Restart'
	restart.setAttribute('onclick', 'restart()')
	cardTitle.innerHTML = 'You Winner!!!'
	mainmenu.innerHTML = 'Main Menu' 
	mainmenu.href = '../index.html'

	GameWinMenu.appendChild(card);
	card.appendChild(cardBody);
	cardBody.appendChild(cardTitle);
	cardBody.appendChild(displayScore);
	cardBody.appendChild(restart)
	cardBody.appendChild(mainmenu)

	return GameWinMenu  
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground()

	ninja.draw();
	pipes.forEach((pipe) => pipe.draw());
	// Score
	ctx.fillStyle = "#000";
	ctx.font = "24px Arial";
	ctx.fillText("Score: " + score, canvas.width / 2 - 30, 30);
}

function drawButton(x, y, text){
    // Button  
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x, y, 120, 40);

    // Teks button
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.fillText(text, x + 30, y + 25);
}

function drawBackground() {
	const backgroundImage = new Image();
	backgroundImage.src = '../images/mobile/Snowfield.png';
	ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function checkCollision(ninja, pipe) {
	return (
		ninja.x < pipe.x + pipe.width &&
		ninja.x + ninja.width - 10 > pipe.x &&
		(ninja.y < pipe.height || ninja.y + ninja.height - 10 > pipe.height + 200)
	);
}

function resetGame() {
	document.getElementById('game-over').style.display = "none"
	gameOver = false;
	ninja.y = canvas.height / 2;
	ninja.speedY = 0;
	pipes.length = 0;
	if (score >= 15) {
		score = 15;
		pipeSpeed = 6;
	} else if (score >= 10) {
		score = 10;
		pipeSpeed = 5;
	} else if (score >= 5) {
		score = 5;
		pipeSpeed = 4;
	} else {
		score = 0;
		pipeSpeed = 3;
	}
}


function showPauseMenu() {
	document.getElementById("pause-menu").style.display = "block";
	gamePaused = true;
}

function hidePauseMenu(){
	document.getElementById("pause-menu").style.display = "none";
	gamePaused = false;
}

function resume() {
	hidePauseMenu();
}

function restart() {
	hidePauseMenu()
	resetGame()
}

function mainMenu() {
	window.location.href = 'index.html'
}

window.addEventListener("keydown", function (e) {
	if (e.code === "Space") {
		ninja.Jump();
	}

	if (e.code === "Escape" && !gameOver) {
		if (gamePaused) {
			hidePauseMenu()
		} else {
			showPauseMenu()
		}
	}
});

gameLoop();
