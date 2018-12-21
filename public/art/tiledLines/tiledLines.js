const c = document.getElementById('myCanvas');
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
const ctx = c.getContext('2d');


// Generated Lines definitions
const step = 40;
let lines = [];

// set up program constants
c.width = maxWidth;
c.height = maxHeight;
ctx.strokeStyle = '#FFF';
ctx.lineCap = 'square';
ctx.lineWidth = 2;


// slow down by magnitude of frames, pauseGap = 1, render every 2 frames
const pauseGap = 0;
let pause = 0;

let fadeState = 1;
let fadeJump = 1 / 200;

// using 3 sine curves offset at every thirds
function setStrokeColor() {
  if (fadeState >= 1 || fadeState <= 0) {
    fadeJump *= -1;
  }
  const num = 256 * fadeState;
  const hex = (`00${Math.floor(num).toString(16)}`).slice(-2);
  ctx.strokeStyle = `#${hex}${hex}${hex}`;
  fadeState += fadeJump;
}

function drawLine(line) {
  ctx.moveTo(line.x1, line.y1);
  ctx.lineTo(line.x2, line.y2);
}

function draw() {
  if (pause > pauseGap) {
    setStrokeColor();
    // reset
    for (let i = 0; i < lines.length; i += 1) {
      drawLine(lines[i]);
    }
    pause = 0;
  }
  pause += 1;
}

function addLine(x, y, width, height) {
  const leftToRight = Math.random() >= 0.5;

  if (leftToRight) {
    lines.push({
      x1: x, y1: y, x2: x + width, y2: y + height,
    });
  } else {
    lines.push({
      x1: x + width, y1: y, x2: x, y2: y + height,
    });
  }
}

function generateLines() {
  for (let x = 0; x < maxWidth; x += step) {
    for (let y = 0; y < maxHeight; y += step) {
      addLine(x, y, step, step);
    }
  }
}

// game loop
let lastRender = 0;
function loop(timestamp) {
  const progress = timestamp - lastRender;
  // cap at 60fps (theoretically)
  if (progress > 16) {
    ctx.clearRect(0, 0, maxWidth, maxHeight);
    ctx.stroke();
    ctx.beginPath();
    const timesToRender = Math.floor(progress / 16);
    for (let index = 0; index < timesToRender; index += 1) {
      draw();
    }
    ctx.stroke();
  }

  lastRender = timestamp;
  if (fadeState <= 0) {
    lines = [];
    generateLines();
  }
  window.requestAnimationFrame(loop);
}
generateLines();
window.requestAnimationFrame(loop);
