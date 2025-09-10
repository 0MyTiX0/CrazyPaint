import Experience from "./Experience.js";

export default class Tools {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.parameters = {};
    this.parameters.pencilRadius = 10;
    this.parameters.pencilColor = "#000000";

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("✏️ Tools");
      this.debugFolder.close();
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
        .add(this.parameters, "pencilRadius")
        .min(0)
        .max(50)
        .step(1);
      this.debugFolder.addColor(this.parameters, "pencilColor");
    }
  }
}
