import Debug from "./Utils/Debug.js";
import Wheel from "./wheel.js";

let instance = null;

export default class WheelExperience {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    // Accès global pour la roue
    window.wheelExperience = this;

    // Instancier uniquement ce qui est nécessaire pour la roue
    this.debug = new Debug();
    this.wheel = new Wheel(this);
  }
}
