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

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🖱️ Mouse Event");
      this.debugFolder.close();
    }
    this.setDebug();
    this.setMouseDown();
    this.setMouseMove();
    this.setMouseUp();
  }
  setDebug() {
    //debug
    if (this.debug.active) {
    }
  }
  setMouseDown() {
    this.canvas.addEventListener("mousedown", (event) => {
      this.currentStroke = {};
      this.currentStroke.color = this.experience.tools.parameters.pencilColor;
      this.currentStroke.radius = this.experience.tools.parameters.pencilRadius;
      this.currentStroke.points = [
        {
          x: event.offsetX,
          y: event.offsetY,
          time: this.experience.time.elapsed,
        },
      ];
    });
  }
  setMouseMove() {
    this.canvas.addEventListener("mousemove", (event) => {
      if (!this.currentStroke) return;
      this.currentStroke.points.push({
        x: event.offsetX,
        y: event.offsetY,
        time: this.experience.time.elapsed,
      });
    });
  }
  setMouseUp() {
    this.canvas.addEventListener("mouseup", () => {
      this.drawingHistory.push(this.currentStroke);
      this.currentStroke = null;
    });
  }
}
