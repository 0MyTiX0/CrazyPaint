import Experience from "../Experience.js";
import EventEmitter from "./EventEmitter.js";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    //setup
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.canvas = this.experience.canvas;
    this.drawingHistory = [];

    this.colorButton = document.querySelectorAll(".color-button");
    this.clearButton = document.querySelector(".clear-btn");
    this.smallPencilButton = document.querySelector(".small-pencil-btn");
    this.mediumPencilButton = document.querySelector(".medium-pencil-btn");
    this.largePencilButton = document.querySelector(".large-pencil-btn");
    this.squareButton = document.querySelector(".square-btn");
    this.circleButton = document.querySelector(".circle-btn");
    this.fillButton = document.querySelector(".fill-btn");

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🖱️ Mouse Event");
      this.debugFolder.close();
    }
    this.setDebug();
    this.setMouseDown();
    this.setMouseMove();
    this.setMouseUp();
    this.setClick();
  }
  setDebug() {
    //debug
    if (this.debug.active) {
    }
  }
  setMouseDown() {
    this.canvas.addEventListener("mousedown", (event) => {
      this.currentStroke = {};
      this.currentStroke.color = this.experience.paint.parameters.pencilColor;
      this.currentStroke.time = this.experience.time.elapsed;
      this.currentStroke.tool = this.experience.paint.parameters.activeTool;
      this.currentStroke.radius =
        this.currentStroke.tool != "pencil"
          ? 10
          : this.experience.paint.parameters.pencilRadius;
      this.currentStroke.points = [
        {
          x: event.offsetX,
          y: event.offsetY,
        },
      ];
      this.currentStroke.anchor = { x: event.offsetX, y: event.offsetY };

      if (this.experience.paint.parameters.activeTool == "fill") {
        this.currentStroke.points = this.experience.tools.generateFill(
          this.currentStroke.points[0].x,
          this.currentStroke.points[0].y
        );
      }
    });
  }
  setMouseMove() {
    this.canvas.addEventListener("mousemove", (event) => {
      if (!this.currentStroke || this.currentStroke.tool == "fill") return;
      this.currentStroke.points.push({
        x: event.offsetX,
        y: event.offsetY,
      });
      switch (this.currentStroke.tool) {
        case "square":
          this.currentStroke.points = this.experience.tools.generateSquare(
            this.currentStroke.points
          );
          break;
        case "circle":
          this.currentStroke.points = this.experience.tools.generateCircle(
            this.currentStroke.points,
            this.currentStroke.anchor
          );
          break;

        default:
          break;
      }
    });
  }
  setMouseUp() {
    this.canvas.addEventListener("mouseup", () => {
      this.drawingHistory.push(this.currentStroke);
      this.currentStroke = null;
    });
  }
  setClick() {
    this.colorButton.forEach((button) => {
      button.addEventListener("click", () => {
        this.experience.tools.changeColor(button.style.backgroundColor);
      });
    });
    this.clearButton.addEventListener("click", () => {
      this.experience.tools.clearCanvas();
    });
    this.smallPencilButton.addEventListener("click", () => {
      this.experience.tools.setPencilRadius(10);
      this.experience.paint.parameters.activeTool = "pencil";
    });
    this.mediumPencilButton.addEventListener("click", () => {
      this.experience.tools.setPencilRadius(20);
      this.experience.paint.parameters.activeTool = "pencil";
    });
    this.largePencilButton.addEventListener("click", () => {
      this.experience.tools.setPencilRadius(30);
      this.experience.paint.parameters.activeTool = "pencil";
    });
    this.squareButton.addEventListener("click", () => {
      this.experience.paint.parameters.activeTool = "square";
    });
    this.circleButton.addEventListener("click", () => {
      this.experience.paint.parameters.activeTool = "circle";
    });
    this.fillButton.addEventListener("click", () => {
      this.experience.paint.parameters.activeTool = "fill";
    });
  }
}
