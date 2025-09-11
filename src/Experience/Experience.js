import Time from "./Utils/Time.js";
import Debug from "./Utils/Debug.js";
import Paint from "./Paint.js";
import Mouse from "./Utils/Mouse.js";
import Tools from "./Tools.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    //Globall access
    window.experience = this;

    this.canvas = canvas;
    this.debug = new Debug();
    this.paint = new Paint();
    this.tools = new Tools();
    this.mouse = new Mouse();
    this.time = new Time();

    this.time.on("tick", () => {
      this.painting();
    });
  }

  painting() {
    this.paint.drawing();
  }
}
