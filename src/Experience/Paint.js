import Experience from "./Experience.js";

export default class Paint {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.clock = null;

    this.parameters = {};
    this.parameters.canvasWidth = window.innerWidth - 460;
    this.parameters.canvasHeight = window.innerHeight - 176;
    this.parameters.backgroundColor = "#b52a2aff";
    this.parameters.eraseTimer = 40000;
    this.parameters.eraseSpeed = 20;
    this.parameters.pencilRadius = 20;
    this.parameters.pencilColor = "#000000";
    this.parameters.activeTool = "pencil";

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🖼️ Environnement");
      // this.debugFolder.close();
    }

    this.setInstance();
    this.setDebug();
  }
  setInstance() {
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
      this.debugFolder
        .add(this.parameters, "eraseTimer")
        .min(0)
        .max(20000)
        .step(500);
      this.debugFolder
        .add(this.parameters, "eraseSpeed")
        .min(0)
        .max(50)
        .step(0.01);
      this.debugFolder
        .add(this.parameters, "pencilRadius")
        .min(0)
        .max(50)
        .step(1);
      this.debugFolder.addColor(this.parameters, "pencilColor");
    }
  }
  drawing() {
    for (const stroke of this.experience.mouse.drawingHistory) {
      let filteredPoints = [];

      if (
        this.experience.time.elapsed - stroke.time >
        this.parameters.eraseTimer
      ) {
        this.clock += this.experience.time.delta;
        filteredPoints = stroke.points;
        while (this.clock >= this.parameters.eraseSpeed) {
          this.clock -= this.parameters.eraseSpeed;
          if (stroke.points.length > 0) filteredPoints.shift();
        }
      } else {
        filteredPoints = stroke.points;
      }

      if (filteredPoints.length < 2) continue;

      this.drawStroke(filteredPoints, stroke.color, stroke.radius);
    }

    this.experience.mouse.drawingHistory =
      this.experience.mouse.drawingHistory.filter(
        (stroke) => stroke.points.length >= 2
      );

    if (this.experience.mouse.currentStroke) {
      let stroke = this.experience.mouse.currentStroke;
      let filteredPoints = [];

      if (
        this.experience.time.elapsed - stroke.time >
        this.parameters.eraseTimer
      ) {
        this.clock += this.experience.time.delta;
        filteredPoints = stroke.points;
        while (this.clock >= this.parameters.eraseSpeed) {
          this.clock -= this.parameters.eraseSpeed;
          if (stroke.points.length > 0) filteredPoints.shift();
        }
      } else {
        filteredPoints = stroke.points;
      }

      if (filteredPoints.length < 2) return;

      this.drawStroke(filteredPoints, stroke.color, stroke.radius);
    }
  }

  drawStroke(stroke, color, radius) {
    this.context.lineWidth = radius ?? this.parameters.pencilRadius;
    this.context.lineCap = "round";
    this.context.lineJoin = "round";
    this.context.strokeStyle = color ?? this.parameters.pencilColor;

    this.context.beginPath();
    this.context.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      this.context.lineTo(stroke[i].x, stroke[i].y);
    }
    this.context.stroke();
  }
}
