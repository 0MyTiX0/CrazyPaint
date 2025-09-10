import Experience from "../Experience.js";
import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    //setup
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.context = this.experience.paint.context;
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
