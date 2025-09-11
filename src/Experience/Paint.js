import Experience from "./Experience.js";

export default class Paint {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.pencilRadius = this.experience.tools.pencilRadius;
    this.pencilColor = this.experience.tools.pencilColor;

    this.parameters = {};
    this.parameters.canvasWidth = 1348;
    this.parameters.canvasHeight = 735;
    this.parameters.backgroundColor = "#b52a2aff";
    this.parameters.eraseTimer = 4000;

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🖼️ Environnement");
      this.debugFolder.close();
    }

    this.setInstance();
    this.setDebug();
  }
  setInstance() {
    // this.canvas.style.width = this.parameters.canvasWidth + "px";
    // this.canvas.style.height = this.parameters.canvasHeight + "px";
    this.canvas.width = this.parameters.canvasWidth;
    this.canvas.height = this.parameters.canvasHeight;
    this.context = this.canvas.getContext("2d");

    //Set background color
    this.context.fillStyle = this.parameters.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  setDebug() {
    //debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.parameters, "canvasWidth")
        .min(0)
        .max(2000)
        .step(1)
        .onChange(() => {
          canvas.width = this.parameters.canvasWidth;
        });
      this.debugFolder
        .add(this.parameters, "canvasHeight")
        .min(0)
        .max(2000)
        .step(1)
        .onChange(() => {
          canvas.height = this.parameters.canvasHeight;
        });
    }
  }
  drawing() {
    for (const stroke of this.experience.mouse.drawingHistory) {
      const filteredPoints = stroke.points.filter(
        (point) =>
          this.experience.time.elapsed - point.time < this.parameters.eraseTimer
      );
      stroke.points = filteredPoints;

      if (filteredPoints.length < 2) continue;

      this.drawStroke(filteredPoints, stroke.color, stroke.radius);
    }

    if (this.experience.mouse.currentStroke) {
      const filteredPoints = this.experience.mouse.currentStroke.points.filter(
        (point) =>
          this.experience.time.elapsed - point.time < this.parameters.eraseTimer
      );
      this.experience.mouse.currentStroke.points = filteredPoints;
      if (filteredPoints.length < 2) return;
      this.drawStroke(
        filteredPoints,
        this.experience.mouse.currentStroke.color,
        this.experience.mouse.currentStroke.radius
      );
    }
  }

  drawStroke(stroke, color, radius) {
    // console.log(stroke, color, radius);

    this.context.lineWidth = radius ?? this.pencilRadius;
    this.context.lineCap = "round";
    this.context.lineJoin = "round";
    this.context.strokeStyle = color ?? this.pencilColor;

    this.context.beginPath();
    this.context.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      this.context.lineTo(stroke[i].x, stroke[i].y);
    }
    this.context.stroke();
  }
}
