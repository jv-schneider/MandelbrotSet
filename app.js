// Starting Conditions

const canvas = document.querySelector("canvas");
const iterationCountSlider = document.querySelector("input#iteration-count");
const complexitySlider = document.querySelector("input#complexity");
const button = document.querySelector("button");

// Important global variables

let iterationCount = parseInt(iterationCountSlider.value);
let complexity = parseFloat(complexitySlider.value);
let size = 1.7;
let setColor = [255, 255, 255];

setCanvasSize();

const c = canvas.getContext("2d");
c.translate(canvasWidth / 2, canvasHeight / 2);
let canvasData = c.getImageData(0, 0, canvasWidth, canvasHeight);

// Center cartesian coordinate system

// Drawing the Mandelbrot Set for the first time

drawSet();

// Functions to draw pixels more efficient

function drawPixel(x, y, r, g, b, a) {
  let index = (x + y * canvasWidth) * 4;
  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

function updateCanvas() {
  c.putImageData(canvasData, 0, 0);
}

function setCanvasSize() {
  canvas.width = window.innerHeight * size;
  canvas.height = window.innerHeight * size;
  canvasWidth = canvas.height;
  canvasHeight = canvas.height;
}

// Resize Mandelbrot Set based on canvas dimensions

function resizeCanvas() {
  setCanvasSize();

  c.translate(canvasWidth / 2, canvasHeight / 2);

  drawSet();
}

// function drawCartesianPoint(x, y) {
//   c.fillRect(x, -y, 1, 1);
// }

// Check if a number is contained in the Mandelbrot set

function inSet(num) {
  let z = math.complex(0, 0);
  for (let i = 0; i < iterationCount; i++) {
    z = math.add(math.multiply(z, z), num);
    if (z.re >= Math.abs(2) || z.im >= Math.abs(2)) {
      return false;
    }
  }
  return true;
}

function showPath(event) {
  // console.log(event.clientX, event.clientY);
}

function drawSet() {
  c.fillRect(-canvasWidth, -canvasHeight, canvasWidth * 2, canvasHeight * 2);
  canvasData = c.getImageData(0, 0, canvasWidth, canvasHeight);
  for (let i = -1; i < 1; i += complexity) {
    for (let j = -3; j < 1; j += complexity) {
      if (inSet(math.complex(j, i))) {
        // console.log(j + " is part of the mandelbrot set");
        drawPixel(
          Math.floor((j * canvasWidth) / 4 + canvasWidth / 2),
          Math.floor((i * canvasHeight) / 4 + canvasWidth / 2),
          setColor[0],
          setColor[1],
          setColor[2],
          255
        );
      }
    }
  }
  updateCanvas();
}

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

window.addEventListener("resize", resizeCanvas, false);
canvas.addEventListener("mouseover", showPath);
button.addEventListener("click", generateSet);
