let root = document.documentElement;
var startAngle = 0;
var endAngle = 45;
var angle = 0;
var colors = ['#01884b' /*emerald green */, '#cc2eaf' /*purple*/, '#ea1e10'/*red*/, '#eadf0e' /*yellow*/, '#0eeadf'/*turqoise*/, '#7f9bc1' /*indigo*/, '#867fc1' /*violet*/, '#3522e2' /*navy blue*/, '#ea7725' /*orange*/, '#f0baff' /*sakura*/];
var contractCoef = -1;
var squareLength = 100;
var numKaleidoscope = 3;
var petalLength = 42;

function addFlowerToCell() {
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
}

function changeColor() {
  // update the 2nd and 3rd, or 1st and 4th petals, or all 4 of some flowers
  var flowers = document.getElementsByClassName("flower");
  var choices = [
    [0,3],
    [1,2],
    [0,1,2,3]
  ];
  for (i = 0; i < flowers.length; i++) {
    // flip a coin
    var rand = Math.random();
    if(rand < 0.3) {
      // choose a color
      var colorIndx = Math.floor(Math.random() * colors.length);
      // then choose which group of petals to change color
      var groupIndx = Math.floor(Math.random() * choices.length);
      var j;
      for(j = 0; j < choices[groupIndx].length; j++) {
        var childNode = flowers[i].childNodes[j]; // the petal
        var petalContent = childNode.childNodes[0];
        for (let p of petalContent.childNodes) { // half left and half right
          for (let c of p.childNodes) {// halfContent
            for(let d of c.childNodes) {// halfContentUpper and  halfContentLower
              if(p.classList.contains('right')) { // this is the right half
                d.style.borderLeft = "calc(var(--petal-width)/4) solid " + colors[colorIndx];
                d.style.borderBottom = "calc(var(--petal-length)/4) solid " + colors[colorIndx];
              }  else {
                d.style.borderRight = "calc(var(--petal-width)/4) solid " + colors[colorIndx];
                d.style.borderBottom = "calc(var(--petal-length)/4) solid " + colors[colorIndx];
              }
            }
          }
        }
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

function updateCoef() {
  contractCoef *=  -1;
  root.style.setProperty('--contract-coef', contractCoef);
}

window.onload = function() {
  addFlowerToCell();
  animate();
  function animate() {
    var half = document.getElementsByClassName("half");
    contract();
    requestInterval(spin, 2000);
    requestInterval(changeColor, 5000);
    requestInterval(updateCoef, 8000);
    function spin() {
      var spin_flower = document.getElementsByClassName("flower");
      angle += 45;
      if(angle > 360) {
        angle %= 360;
      }
      for (i = 0; i < spin_flower.length; i++) {
         spin_flower[i].style.transform = "rotate(" + angle + "deg)";
         spin_flower[i].style.transitionTimingFunction = "ease-in";
         spin_flower[i].style.transitionDuration = "2s";
      }
    }
    function contract() {
      for (i = 0; i < half.length; i++) {
          half[i].style.transform = "translate3d(0," + petalLength/-2 * contractCoef + "px,0)";
          half[i].style.transitionTimingFunction = "ease-out";
          half[i].style.transitionDuration = "1s";
      }
      setTimeout(expand, 1000);
    }
    function expand() {
      for (i = 0; i < half.length; i++) {
          half[i].style.transform = "translate3d(0," + petalLength/2 * contractCoef + "px,0)";
          half[i].style.transitionTimingFunction = "ease-out";
          half[i].style.transitionDuration = "1s";
      }
      setTimeout(contract, 1000);
    }
  }
}
