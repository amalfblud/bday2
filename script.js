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
basketImg.src = 'assets/gem/basket.png';

function drawBasket() {
  ctx.drawImage(basketImg, basketX, 340, 70, 70); 
}

const brokenHeart = new Image();
brokenHeart.src = 'assets/gem/brokenheart.png';

const heartImages = [
    'assets/gem/heart.png',
    'assets/gem/heart1.png',
    'assets/gem/heart2.png',
    'assets/gem/heart3.png',
    'assets/gem/heart4.png',
    'assets/gem/heart5.png',
    'assets/gem/heart6.png'
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

// Start Game Logic
function startGame() {
    isGameOver = false;
    score = 0;
    hearts = [];
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('score').style.display = 'block';
    update();
  }
  
  // Initial UI Setup: hide stuff when the page first loads
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('score').style.display = 'none';

  
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  // Toggle menu
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', 
      menuToggle.classList.contains('open'));
  });
  
// Simple, working version
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.hash) {
        e.preventDefault();
        // Close menu
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        
        // Temporarily disable snap scroll
        document.documentElement.style.scrollSnapType = 'none';
        
        // Scroll to section
        document.querySelector(this.hash).scrollIntoView({
          behavior: 'smooth'
        });
        
        // Re-enable snap scroll after delay
        setTimeout(() => {
          document.documentElement.style.scrollSnapType = 'y mandatory';
        }, 1000);
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

// Open lightbox when clicking gallery items
document.querySelectorAll('.memory-item').forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.querySelector('img').src;
    const caption = item.querySelector('.caption').textContent;
    
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-caption').textContent = caption;
    document.getElementById('lightbox').style.display = 'block';
  });
});

// Close lightbox
document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('lightbox').style.display = 'none';
});

// Close when clicking outside image
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) {
    document.getElementById('lightbox').style.display = 'none';
  }
});

// Updated click handler for videos
document.querySelectorAll('.memory-item').forEach(item => {
  item.addEventListener('click', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-img');
    const caption = this.querySelector('.caption').textContent;

    // Clear previous content
    lightboxContent.innerHTML = '';

    // Check if it's a video
    const video = this.querySelector('video');
    if (video) {
      const videoSource = video.querySelector('source').src;
      const newVideo = document.createElement('video');
      newVideo.controls = true;
      newVideo.autoplay = true;
      newVideo.muted = false; // Now we'll hear sound
      newVideo.classList.add('lightbox-video');
      
      const source = document.createElement('source');
      source.src = videoSource;
      source.type = 'video/mp4';
      
      newVideo.appendChild(source);
      lightboxContent.appendChild(newVideo);
    } else {
      // Original image handling
      const img = document.createElement('img');
      img.src = this.querySelector('img').src;
      img.classList.add('lightbox-img');
      lightboxContent.appendChild(img);
    }

    document.getElementById('lightbox-caption').textContent = caption;
    lightbox.style.display = "block";
  });
});

// Close lightbox
document.querySelector('.close-btn').addEventListener('click', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-img');
  lightboxContent.innerHTML = ''; // Clear content when closing
  lightbox.style.display = 'none';
});

// Close when clicking outside
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) {
    const lightboxContent = document.getElementById('lightbox-img');
    lightboxContent.innerHTML = ''; // Clear content when closing
    document.getElementById('lightbox').style.display = 'none';
  }
});