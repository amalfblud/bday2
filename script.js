const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pointSound = new Audio('assets/sfx/succes.mp3');
const tenPointSound = new Audio('assets/sfx/tenscore.mp3');
const brokenSound = new Audio('assets/sfx/failed.mp3');

let hearts = [];
let basketX = 180;
let score = 0;
let isGameOver = false;
let updateId;
let fallSpeed = 2;

const basketImg = new Image();
basketImg.src = 'assets/img/basket.png';

function drawBasket() {
  ctx.drawImage(basketImg, basketX, 340, 70, 70); 
}

const brokenHeart = new Image();
brokenHeart.src = 'assets/img/brokenheart.png';

const heartImages = [
    'assets/img/heart.png',
    'assets/img/heart1.png',
    'assets/img/heart2.png',
    'assets/img/heart3.png',
    'assets/img/heart4.png',
    'assets/img/heart5.png',
    'assets/img/heart6.png'
  ].map(src => {
    let img = new Image();
    img.src = src;
    return img;
  });

    
function drawHearts() {
    hearts.forEach(h => {
      ctx.drawImage(h.image, h.x, h.y, 30, 30);
    });
  }
  
function update() {
  ctx.clearRect(0, 0, 400, 400);

    basketX += basketSpeed;
    if (basketX < 0) basketX = 0;
    if (basketX > 330) basketX = 330;

  drawBasket();
  drawHearts();

  if (score >= 100) {
    fallSpeed = 5;
  } else if (score >= 50) {
    fallSpeed = 4;
  } else if (score >= 20) {
    fallSpeed = 3;
  } else {
    fallSpeed = 2;
  }

  hearts.forEach(h => h.y += fallSpeed);
  
  hearts = hearts.filter(h => {
    if (h.y > 340 && h.x > basketX && h.x < basketX + 70) {
      if (h.isBroken) {
        brokenSound.play();
        isGameOver = true;
         document.getElementById('overlay').style.display = 'block';
         document.getElementById('gameOver').style.display = 'block';
         cancelAnimationFrame(updateId); // Stop the game loop
         return false;
      } else {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        if (score % 10 === 0) {
            tenPointSound.play();
        } else {
            pointSound.play();
        }
        return false;
      }
    }
    return h.y < 400;
  });
  
  if (!isGameOver) {
    updateId = requestAnimationFrame(update);
  }  
}

setInterval(() => {
    const isBroken = Math.random() < 0.2; // 20% chance for a broken heart
    const image = isBroken ? brokenHeart : heartImages[Math.floor(Math.random() * heartImages.length)];
    hearts.push({ x: Math.random() * (400 - 30), y: 0, image: image, isBroken: isBroken });
  }, 1000);
  

let basketSpeed = 0;

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') basketSpeed = -5;
    if (e.key === 'ArrowRight') basketSpeed = 5;
  });
  
  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') basketSpeed = 0;
  });
  
  // Touch Controls for Mobile
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

leftBtn.addEventListener('touchstart', () => basketSpeed = -5);
leftBtn.addEventListener('touchend', () => basketSpeed = 0);

rightBtn.addEventListener('touchstart', () => basketSpeed = 5);
rightBtn.addEventListener('touchend', () => basketSpeed = 0);


function retryGame() {
    isGameOver = false;
    score = 0;
    hearts = [];
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    update();
  }
  
update();
