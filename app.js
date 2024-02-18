// JavaScript Code 15.02.2024, Jasper Schneider
// A simulation of the famous Mandelbrot Set

// Starting Conditions

const canvas = document.querySelector("canvas");
const iterationCountSlider = document.querySelector("input#iteration-count");
const complexitySlider = document.querySelector("input#complexity");
const button = document.querySelector("button");
const colorCheckbox = document.querySelector("input#color");

// Important global variables

let iterationCount = parseInt(iterationCountSlider.value);
let complexity = parseFloat(complexitySlider.value);
let colorSim = false;
let size = 1.7;
let setColor = [255, 255, 255];
let setStates = {};

const abs2 = Math.abs(2);

// Initialize canvas

setCanvasSize();

const ctx = canvas.getContext("2d");
ctx.translate(canvasWidth / 2, canvasHeight / 2);
let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

// Class introducing complex numbers

class Complex16 extends Float64Array {
  constructor(...args) {
    super(...args);

    if (this.length !== 2) {
      throw new Error("invalid complex number!");
    }
  }

  set re(value) {
    this[0] = value;
  }
  set im(value) {
    this[1] = value;
  }

  get re() {
    return this[0];
  }
  get im() {
    return this[1];
  }
}

// Functions for making calculations with complex numbers

function add(z1, z2) {
  return new Complex16([z1.re + z2.re, z1.im + z2.im]);
}

function mul(z1, z2) {
  return new Complex16([
    z1.re * z2.re - z1.im * z2.im,
    z1.re * z2.im + z1.im * z2.re,
  ]);
}

// Drawing the set on page load

drawSet();

// Function to draw pixels more efficient

function drawPixel(x, y, r, g, b, a) {
  let index = (x + y * canvasWidth) * 4;
  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

// Resize Mandelbrot Set based on canvas dimensions

function setCanvasSize() {
  canvas.width = window.innerHeight * size;
  canvas.height = window.innerHeight * size;
  canvasWidth = canvas.height;
  canvasHeight = canvas.height;
}

function resizeCanvas() {
  setCanvasSize();

  // Center cartesian coordinate system

  ctx.translate(canvasWidth / 2, canvasHeight / 2);

  drawSet();
}

// function drawCartesianPoint(x, y) {
//   c.fillRect(x, -y, 1, 1);
// }

// Save important canvasData in an object
// => Browser doesnt have to calculate it again later

function saveStates() {
  if (
    (complexity < 0.01 || iterationCount > 150) &&
    !Object.values(setStates).includes(canvasData)
  ) {
    setStates[[complexity, iterationCount]] = canvasData;
  }
}

// Check if a number is contained in the Mandelbrot set
// z=z^2+c

function inSet(num) {
  let z = new Complex16([0, 0]);

  for (let i = 0; i < iterationCount; i++) {
    z = add(mul(z, z), num);

    if (z.re >= abs2 || z.im >= abs2) {
      return false;
    }
  }
  return true;
}

function showPath(event) {
  // let point = [
  //   (5 * (event.x - canvasWidth / 2)) / canvasWidth,
  //   (5 * -(event.y - window.innerHeight / 2)) / canvasHeight,
  // ];
  // let z = new Complex16([0, 0]);
  // let c = new Complex16([point[0], point[1]]);
  // let path = [];
  // for (let i = 0; i < iterationCount; i++) {
  //   z = add(mul(z, z), c);
  //   path.push(z);
  // }
  // for (let i = 0; i < path.length - 1; i++) {
  //   ctx.beginPath();
  //   ctx.moveTo(
  //     (point[0] * canvasWidth) / 5 - 40,
  //     (-point[1] * canvasHeight) / 5
  //   );
  //   ctx.lineTo(
  //     (path[i].re * canvasWidth) / 5 - 40,
  //     (path[i].im * canvasHeight) / 5
  //   );
  // }
  // ctx.fillStyle = "red";
  // ctx.strokeStyle = "red";
  // ctx.lineWidth = "5px";
  // ctx.stroke();
}

// Draw the Mandelbrot Set on the Canvas

function drawSet() {
  // Reset Image Data

  ctx.fillRect(-canvasWidth, -canvasHeight, canvasWidth * 2, canvasHeight * 2);
  canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  // Check if the same Mandelbrot Set has been generated before
  // => Dont calculate it again

  if (setStates.hasOwnProperty([complexity, iterationCount])) {
    canvasData = setStates[[complexity, iterationCount]];
  } else {
    // Calculate a new Mandelbrot Set

    for (let i = -1; i < 1; i += complexity) {
      for (let j = -3; j < 1; j += complexity) {
        if (inSet(new Complex16([j, i]))) {
          // console.log(j + " is part of the mandelbrot set");
          drawPixel(
            Math.floor((j * canvasWidth) / 5 + canvasWidth / 2),
            Math.floor((i * canvasHeight) / 5 + canvasWidth / 2),
            setColor[0],
            setColor[1],
            setColor[2],
            255
          );
        }
      }
    }
  }

  updateCanvas();
  saveStates();
}

// Change simulation parameters based on user input

function generateSet() {
  if (
    iterationCount != parseInt(iterationCountSlider.value) ||
    complexity != parseFloat(complexitySlider.value)
  ) {
    iterationCount = parseInt(iterationCountSlider.value);
    complexity = parseFloat(complexitySlider.value);
    drawSet();
  }
}

// React accordingly on user input

window.addEventListener("resize", resizeCanvas, false);
// canvas.addEventListener("mousemove", showPath);
button.addEventListener("click", generateSet);
