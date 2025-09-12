import { apiSubmitDrawing } from "../Api/apiAi.js";
import Experience from "./Experience.js";

export default class Game {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.context = this.experience.paint.context;

    this.scorePopup = document.querySelector(".score-popup");
    this.scoreDisplay = document.querySelector(".score");
    this.result = document.querySelector(".result");
    this.quip = document.querySelector(".quip");
    this.restartButton = document.querySelector(".restart-btn");

    this.parameters = {};
    this.gameStarted = false;

    //debug
    if (this.debug.active) {
      // this.debugFolder = this.debug.ui.addFolder("✏️ Tools");
      // this.debugFolder.close();
    }
    this.submitButton = document.querySelector(".submit-btn");
    this.submitButton.addEventListener("click", () => {
      this.submitImage();
    });
  }
  startGame() {}
  async submitImage() {
    const base64 = this.canvasToPreviewAndBase64(this.canvas);

    const drawing = this.canvas.toDataURL();
    const img = new Image();
    img.src = drawing;
    this.canvas.replaceWith(img);

    this.scorePopup.style.display = "flex";
    this.score = await apiSubmitDrawing(base64, this.experience.image.imageAlt);
    this.scoreParsed = JSON.parse(this.score?.message?.content);

    this.result.textContent = "Résultat";
    this.scoreDisplay.textContent = `Score : ${this.scoreParsed?.score} / 100`;
    this.quip.textContent = this.scoreParsed?.quip;

    this.restartButton.style.display = "inline";
    this.restartButton.addEventListener("click", () => {
      location.reload();
    });
  }

  canvasToPreviewAndBase64(canvas, maxSide = 1024, quality = 0.6) {
    const { width, height } = canvas;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const w = Math.round(width * scale),
      h = Math.round(height * scale);

    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    off.getContext("2d").drawImage(canvas, 0, 0, w, h);

    const dataUrl = off.toDataURL("image/jpeg", quality);
    const base64 = dataUrl.split(",")[1]; // for Ollama

    return base64;
  }
}
