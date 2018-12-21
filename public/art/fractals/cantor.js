const c = document.getElementById('myCanvas');
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
const ctx = c.getContext('2d');


// First line definitions
const firstlen = Math.min(maxWidth, maxHeight);
const direction = 'y';
const initPoint = [{ x: maxWidth / 2, y: maxHeight / 2 }];
let cantors = { nextPoints: initPoint, nextLen: firstlen, newDirection: direction };

// set up program constants
const contorMultiplier = 0.7;
const minLen = Math.ceil(firstlen / 71);
c.width = maxWidth;
c.height = maxHeight;

// slow down by magnitude of frames, pauseGap = 1, render every 2 frames
const pauseGap = 0;
let pause = 0;

let fractionDraw = 0;
const fractionJump = 1 / 60;

let colorState = 0;
// one sine cycle
const colorMax = 2 * Math.PI;
// 100 ticks to complete one sine cycle
const colorJump = 2 * Math.PI / 1000;

// get the next lines in the set
function getNextCantor(prevPoints, len, currDirection) {
  let newDirection;
  if (currDirection === 'x') {
    newDirection = 'y';
  } else {
    newDirection = 'x';
  }
  // exit condition
  if (len > minLen) {
    // new length is always cantorMultiplier of the previous length
    const nextLen = len * contorMultiplier;
    const nextPoints = [];
    for (let index = 0; index < prevPoints.length; index += 1) {
      const prevPoint = prevPoints[index];
      const prevPointA = {};
      prevPointA[newDirection] = prevPoint[newDirection] - (len / 2);
      prevPointA[currDirection] = prevPoint[currDirection];

      const prevPointB = {};
      prevPointB[newDirection] = prevPoint[newDirection] + (len / 2);
      prevPointB[currDirection] = prevPoint[currDirection];

      nextPoints.push(prevPointA);
      nextPoints.push(prevPointB);
    }
    return { nextPoints, nextLen, newDirection };
  }
  return { nextPoints: [], len, newDirection };
}

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
  ctx.strokeStyle = `#${rhex}${ghex}${bhex}`;

  colorState += colorJump;
}

// draw line from the center, as the progress of the drawing is determined by
// fraction, we can expect it to slow down as the lines get shorter
function progressiveLine(point, len, currDirection, fraction, jumpBy) {
  let otherDirection;
  if (currDirection === 'x') {
    otherDirection = 'y';
  } else {
    otherDirection = 'x';
  }
  const startPointA = {};
  startPointA[currDirection] = point[currDirection];
  startPointA[otherDirection] = point[otherDirection] + fraction * len / 2;
  const endPointA = {};
  endPointA[currDirection] = point[currDirection];
  endPointA[otherDirection] = point[otherDirection] + ((fraction + jumpBy) * len / 2);

  const startPointB = {};
  startPointB[currDirection] = point[currDirection];
  startPointB[otherDirection] = point[otherDirection] + fraction * len / 2;
  const endPointB = {};
  endPointB[currDirection] = point[currDirection];
  endPointB[otherDirection] = point[otherDirection] - ((fraction + jumpBy) * len / 2);

  ctx.moveTo(startPointA.x, startPointA.y);
  ctx.lineTo(endPointA.x, endPointA.y);
  ctx.moveTo(startPointB.x, startPointB.y);
  ctx.lineTo(endPointB.x, endPointB.y);
}

function draw() {
  if (pause > pauseGap) {
    const { nextPoints, nextLen, newDirection } = cantors;

    for (let index = 0; index < nextPoints.length; index += 1) {
      const point = nextPoints[index];
      progressiveLine(point, nextLen, newDirection, fractionDraw, fractionJump);
    }
    fractionDraw += fractionJump;


    if (fractionDraw >= 1) {
      fractionDraw = 0;
      cantors = getNextCantor(nextPoints, nextLen, newDirection);
    }
    // reset
    pause = 0;
  }
  setStrokeColor();
  pause += 1;
}

// game loop
let lastRender = 0;
function loop(timestamp) {
  const { nextPoints } = cantors;

  const progress = timestamp - lastRender;
  // cap at 60fps (theoretically)
  if (progress > 16) {
    ctx.beginPath();
    const timesToRender = Math.floor(progress / 16);
    for (let index = 0; index < timesToRender; index += 1) {
      draw();
    }
    ctx.stroke();

    // once there's no more cantors, clear the screen to re-draw
    if (nextPoints.length <= 0) {
      cantors = { nextPoints: initPoint, nextLen: firstlen, newDirection: direction };
      ctx.clearRect(0, 0, maxWidth, maxHeight);
    }
  }

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
