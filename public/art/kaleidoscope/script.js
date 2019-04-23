let root = document.documentElement;
var angle = 0;
var colors = ['#01884b' /*emerald green */, '#cc2eaf' /*purple*/, '#ea1e10'/*red*/, '#eadf0e' /*yellow*/, '#0eeadf'/*turqoise*/, '#7f9bc1' /*indigo*/, '#867fc1' /*violet*/, '#3522e2' /*navy blue*/, '#ea7725' /*orange*/, '#f0baff' /*sakura*/];
var contractCoef = 1;
var squareLength = 100;
var petalLength = 42;

function changeColor() {
  var halfContentUppers = document.getElementsByClassName("halfContentUpper");
  for (i = 0; i < halfContentUppers.length; i++) {
    // flip a coin
    var rand = Math.random();
    if(rand < 0.15){
      // choose a color
      var colorIndx = Math.floor(Math.random() * colors.length);
      var upper = halfContentUppers[i];
      var nextSibling = upper.nextSibling;
      if(upper.parentNode.parentNode.classList.contains('right')) { // this is the right half
        upper.style.borderLeft = "calc(var(--petal-width)/4) solid " + colors[colorIndx];
        upper.style.borderBottom = "calc(var(--petal-length)/4) solid " + colors[colorIndx];
        nextSibling.style.borderLeft = "calc(var(--petal-width)/4) solid " + colors[colorIndx];
        nextSibling.style.borderBottom = "calc(var(--petal-length)/4) solid " + colors[colorIndx];
      } else {
        upper.style.borderRight = "calc(var(--petal-width)/4) solid " + colors[colorIndx];
        upper.style.borderBottom = "calc(var(--petal-length)/4) solid " + colors[colorIndx];
        nextSibling.style.borderRight = "calc(var(--petal-width)/4) solid " + colors[colorIndx];
        nextSibling.style.borderBottom = "calc(var(--petal-length)/4) solid " + colors[colorIndx];
      }
    }
  }
}

//source: https://css-tricks.com/snippets/javascript/replacements-setinterval-using-requestanimationframe/
var requestInterval = function (fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })(),
  start = new Date().getTime(),
  handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
    delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};

window.onload = function() {
  // addFlowerToCells
  var newFlower = document.createElement("div");
  newFlower.classList.add("flower");
  var half = document.createElement("div");
  var halfContent = document.createElement("div");
  var halfContentUpper = document.createElement("div");
  var halfContentLower = document.createElement("div");
  halfContentUpper.classList.add("halfContentUpper");
  halfContentLower.classList.add("halfContentLower");
  half.classList.add("half");
  halfContent.classList.add("halfContent");
  halfContent.appendChild(halfContentUpper);
  halfContent.appendChild(halfContentLower);
  half.appendChild(halfContent);
  var leftHalf = half.cloneNode(true);
  leftHalf.classList.add("left");
  var rightHalf = half.cloneNode(true);
  rightHalf.classList.add("right");
  var petal = document.createElement("div");
  var petalContent = document.createElement("div");
  petal.classList.add("petal");
  petalContent.classList.add("petalContent");
  petalContent.appendChild(leftHalf);
  petalContent.appendChild(rightHalf);
  petal.appendChild(petalContent);

  var nums = ["one", "two", "three", "four"];
  var i;
  for(i = 0; i < 4; i++) {
    var p = petal.cloneNode(true);
    p.classList.add(nums[i]);
    newFlower.appendChild(p);
  }
  var cells = document.getElementsByClassName("cell");
  for (i = 0; i < cells.length; i++) {
    cells[i].appendChild(newFlower.cloneNode(true));
  }
  var half = document.getElementsByClassName("half");
  contract();
  setTimeout(changeColor, 3000);
  requestInterval(function() {
    var spin_flower = document.getElementsByClassName("flower");
    angle += 45;
    if(angle > 360) {
      angle %= 360;
    }
    for (i = 0; i < spin_flower.length; i++) {
      var currentFlower = spin_flower[i];
        currentFlower.style.transform = "rotate3d(0,0,1, "+ angle + "deg)";
        currentFlower.style.transitionTimingFunction = "ease-in";
        currentFlower.style.transitionDuration = "2s";
    }
    setTimeout(changeColor, 7000);
  }, 2000);
  requestInterval(function() {
    contractCoef *=  -1;
  }, 8000);
  function contract() {
    for (i = 0; i < half.length; i++) {
      var currentHalf = half[i];
      currentHalf.style.transform = "translate3d(0," + petalLength/2 * contractCoef + "px,0)";
      currentHalf.style.transitionTimingFunction = "ease-out";
      currentHalf.style.transitionDuration = "1s";
    }
    setTimeout(expand, 1000);
  }
  function expand() {
    for (i = 0; i < half.length; i++) {
      var currentHalf = half[i];
      currentHalf.style.transform = "translate3d(0," + petalLength/-2 * contractCoef + "px,0)";
      currentHalf.style.transitionTimingFunction = "ease-out";
      currentHalf.style.transitionDuration = "1s";
    }
    setTimeout(contract, 1000);
  }
}
