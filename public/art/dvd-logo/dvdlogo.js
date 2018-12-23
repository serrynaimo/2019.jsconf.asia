const c = document.getElementById('myCanvas');
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
const ctx = c.getContext('2d');

const img = new Image();
img.src = './js_video_logo.png';

// set up program constants
c.width = maxWidth;
c.height = maxHeight;

// slow down by magnitude of frames, pauseGap = 1, render every 2 frames
const pauseGap = 0;
let pause = 0;

let colorState = 0;
// one sine cycle
const colorMax = 2 * Math.PI;
// 100 ticks to complete one sine cycle
const colorJump = 2 * Math.PI / 1000;

let x = 0;
let y = 0;
let vectorX = 1;
let vectorY = 1;
// using 3 sine curves offset at every thirds
function setStrokeColor() {
  if (colorMax <= colorState) {
    colorState = 0;
  }
  const rnum = 128 * Math.sin(colorState) + 128;
  const rhex = (`00${Math.floor(rnum).toString(16)}`).slice(-2);
  const gnum = 128 * Math.sin(colorState + colorMax / 3) + 128;
  const ghex = (`00${Math.floor(gnum).toString(16)}`).slice(-2);
  const bnum = 128 * Math.sin(colorState + 2 * colorMax / 3) + 128;
  const bhex = (`00${Math.floor(bnum).toString(16)}`).slice(-2);
  ctx.fillStyle = `#${rhex}${ghex}${bhex}`;

  colorState += colorJump;
}

function moveCollision() {
  y += vectorY;
  x += vectorX;
  if (x <= 0 || x + img.width >= maxWidth - 1) {
    vectorX *= -1;
  }

  if (y <= 0 || y + img.height >= maxHeight - 1) {
    vectorY *= -1;
  }
}

function draw() {
  if (pause > pauseGap) {
    // reset

    console.log(img, img.width, img.height);
    setStrokeColor();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, maxWidth, maxHeight);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, x, y);
    pause = 0;
    moveCollision();
  }
  pause += 1;
}

// game loop
let lastRender = 0;
function loop(timestamp) {
  const progress = timestamp - lastRender;
  // cap at 60fps (theoretically)
  if (progress > 16) {
    ctx.beginPath();
    const timesToRender = Math.floor(progress / 16);
    for (let index = 0; index < timesToRender; index += 1) {
      draw();
    }
    ctx.stroke();
  }

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

img.onload = function () {
  window.requestAnimationFrame(loop);
};
