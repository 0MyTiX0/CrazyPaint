import GUI from "lil-gui";

// const canvas = document.querySelector("#paint-canvas");
// const btnBlue = document.querySelector(".blue");
// const btnGreen = document.querySelector(".green");
// const btnRed = document.querySelector(".red");
// const radius = document.querySelector(".radius");

const parameters = {};
// parameters.canvasWidth = 1348;
// parameters.canvasHeight = 735;
// parameters.backgroundColor = "#FFFFFF";
parameters.eraseTimer = 2000;
// parameters.pencilRadius = 10;
// parameters.pencilColor = "#000000";

let drawingHistory = [];
// let currentStroke = null;

// Debug
// const debugActive = window.location.hash == "#debug";
// if (debugActive) {
// const gui = new GUI({
//   width: 400,
// });
// const environnementDebug = gui.addFolder("🖼️ Environnement");
// const toolsDebug = gui.addFolder("✏️ Tools");
const crazyWheelDebug = gui.addFolder("☸️ Crazy Wheel");
const crazyDebug = gui.addFolder("🎉 Craziness");
// environnementDebug.close();
// toolsDebug.close();
crazyWheelDebug.close();
crazyDebug.close();

// environnementDebug
//   .add(parameters, "canvasWidth")
//   .min(0)
//   .max(2000)
//   .step(1)
//   .onChange(() => {
//     canvas.width = parameters.canvasWidth;
//   });
// environnementDebug
//   .add(parameters, "canvasHeight")
//   .min(0)
//   .max(2000)
//   .step(1)
//   .onChange(() => {
//     canvas.height = parameters.canvasHeight;
//   });
// toolsDebug.add(parameters, "pencilRadius").min(0).max(50).step(1);
// toolsDebug.addColor(parameters, "pencilColor");
crazyDebug.add(parameters, "eraseTimer").min(1000).max(20000).step(500);
// }

// canvas.width = parameters.canvasWidth;
// canvas.height = parameters.canvasHeight;
// let context = canvas.getContext("2d");

// //Set background color
// context.fillStyle = parameters.backgroundColor;
// context.fillRect(0, 0, canvas.width, canvas.height);

//tool bar
// radius.value = parameters.pencilRadius;
// btnRed.addEventListener("click", () => {
//   parameters.pencilColor = "#FF0000";
// });
// btnGreen.addEventListener("click", () => {
//   parameters.pencilColor = "#00FF00";
// });
// btnBlue.addEventListener("click", () => {
//   parameters.pencilColor = "#0000FF";
// });
// radius.addEventListener("change", (event) => {
//   parameters.pencilRadius = event.target.value;
// });

//mouse event
// canvas.addEventListener("mousedown", (event) => {
//   currentStroke = {};
//   currentStroke.color = parameters.pencilColor;
//   currentStroke.radius = parameters.pencilRadius;
//   currentStroke.points = [
//     { x: event.offsetX, y: event.offsetY, time: performance.now() },
//   ];
// });

// canvas.addEventListener("mouseup", () => {
//   drawingHistory.push(currentStroke);
//   currentStroke = null;
// });

// canvas.addEventListener("mousemove", (event) => {
//   if (!currentStroke) return;
//   currentStroke.points.push({
//     x: event.offsetX,
//     y: event.offsetY,
//     time: performance.now(),
//   });
// });

//paint
// function drawing() {
//   for (const stroke of drawingHistory) {
//     const filteredPoints = stroke.points.filter(
//       (point) => performance.now() - point.time < parameters.eraseTimer
//     );
//     stroke.points = filteredPoints;

//     if (filteredPoints.length < 2) continue;

//     drawStroke(filteredPoints, stroke.color, stroke.radius);
//   }

//   if (currentStroke) {
//     const filteredPoints = currentStroke.points.filter(
//       (point) => performance.now() - point.time < parameters.eraseTimer
//     );
//     currentStroke.points = filteredPoints;
//     if (filteredPoints.length < 2) return;
//     drawStroke(filteredPoints, currentStroke.color, currentStroke.radius);
//   }
// }

// function drawStroke(stroke, color, radius) {
//   context.lineWidth = radius ?? parameters.pencilRadius;
//   context.lineCap = "round";
//   context.lineJoin = "round";
//   context.strokeStyle = color ?? parameters.pencilColor;

//   context.beginPath();
//   context.moveTo(stroke[0].x, stroke[0].y);
//   for (let i = 1; i < stroke.length; i++) {
//     context.lineTo(stroke[i].x, stroke[i].y);
//   }
//   context.stroke();
// }

// const tick = () => {
//   //clear canvas
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   //draw
//   drawing();

//   window.requestAnimationFrame(tick);
// };

// tick();
