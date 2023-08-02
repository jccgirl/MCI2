window.addEventListener('load', () => pingpong.init()); 
const pingpong = {
  canvas: null,
  ctx: null,
  ballRadius: 10,
  ballX: null,
  ballY: null,
  ballSpeedX: 5,
  ballSpeedY: 5,

  paddlesHeight: 100,
  paddlesWidth: 10,
  player1Y: null,
  player2Y: null,
  playerSpeed: 10,

  player1Score: 0,
  player2Score: 0,
  winningScore: 5,

  difficulty: 'Medium', 
  gameIsOver: false, 

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
    this.player1Y = this.canvas.height / 2 - this.paddlesHeight / 2;
    this.player2Y = this.canvas.height / 2 - this.paddlesHeight / 2;

    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    document.addEventListener('touchmove', this.touchHandler.bind(this), false);

    document.getElementById('easyBtn').addEventListener('click', () => this.startGame('Easy'));
    document.getElementById('mediumBtn').addEventListener('click', () => this.startGame('Medium'));
    document.getElementById('hardBtn').addEventListener('click', () => this.startGame('Hard'));
  },

  startGame(selectedDifficulty) {
    
    this.setDifficulty(selectedDifficulty);

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';

    this.gameLoop();
  },

  showGameScreen() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    pingpong.init();
  },

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#f9f9f9'; 
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw center line
    this.ctx.strokeStyle = '#d0d0d0';
    this.ctx.setLineDash([10, 10]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();

    // Draw ball
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#000000'; 
    this.ctx.fill();
    this.ctx.closePath();

    // Draw paddles
    this.ctx.fillStyle = '#000000'; 
    this.ctx.fillRect(0, this.player1Y, this.paddlesWidth, this.paddlesHeight);
    this.ctx.fillRect(this.canvas.width - this.paddlesWidth, this.player2Y, this.paddlesWidth, this.paddlesHeight);

    // Draw scores
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#000000'; 
    this.ctx.fillText(`Player 1: ${this.player1Score}`, 50, 50);
    this.ctx.fillText(`Player 2: ${this.player2Score}`, this.canvas.width - 150, 50);
  },

  update() {
  
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
  
    if (this.ballY + this.ballRadius > this.canvas.height || this.ballY - this.ballRadius < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    if (
      (this.ballX - this.ballRadius < this.paddlesWidth && this.ballY > this.player1Y && this.ballY < this.player1Y + this.paddlesHeight) ||
      (this.ballX + this.ballRadius > this.canvas.width - this.paddlesWidth && this.ballY > this.player2Y && this.ballY < this.player2Y + this.paddlesHeight)
    ) {
      this.ballSpeedX = -this.ballSpeedX;
    }
  
    if (this.ballX - this.ballRadius < 0) {
      this.player2Score++;
      this.resetBall();
    } else if (this.ballX + this.ballRadius > this.canvas.width) {
      this.player1Score++;
      this.resetBall();
    }
  
    if (this.player1Score >= this.winningScore || this.player2Score >= this.winningScore) {
      this.showGameOver(); 
      this.gameIsOver = true; 
    }
  },
  
  resetBall() {
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
    this.ballSpeedX = Math.random() < 0.5 ? -this.ballSpeedX : this.ballSpeedX; 
    this.ballSpeedY = Math.random() * 8 - 4;
  },

  touchHandler(event) {
    const touches = event.changedTouches;
    const canvasRect = this.canvas.getBoundingClientRect();
  
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
  
      if (touchX < canvasRect.left + this.canvas.width / 2) {
        this.player1Y = touchY - canvasRect.top - this.paddlesHeight / 2;
      } else {
        this.player2Y = touchY - canvasRect.top - this.paddlesHeight / 2;
      }
    }
  },
  
  

  mouseMoveHandler(event) {
    const relativeY = event.clientY - this.canvas.offsetTop;
    if (relativeY > 0 && relativeY < this.canvas.height) {
      this.player1Y = relativeY - this.paddlesHeight / 2;
    }
  },

showGameOver() {
  // Display the winner message
  const winner = this.player1Score >= this.winningScore ? 'Player 1' : 'Player 2';
  alert(`${winner} wins!`);

  this.gameIsOver = false; 
  this.player1Score = 0; 
  this.player2Score = 0; 
  document.getElementById('startScreen').style.display = 'block'; 
  document.getElementById('gameScreen').style.display = 'none'; 
},
  
  

  setDifficulty(selectedDifficulty) {
    this.difficulty = selectedDifficulty;
    switch (this.difficulty) {
      case 'Easy':
        this.ballSpeedX = 3;
        this.ballSpeedY = 3;
        break;
      case 'Medium':
        this.ballSpeedX = 5;
        this.ballSpeedY = 5;
        break;
      case 'Hard':
        this.ballSpeedX = 8;
        this.ballSpeedY = 8;
        break;
      default:
        this.ballSpeedX = 5;
        this.ballSpeedY = 5;
        break;
    }
  },

  gameLoop() {
    if (!this.gameIsOver) { 
      this.update();
      this.draw();
      requestAnimationFrame(() => this.gameLoop());
    }
  }
};

