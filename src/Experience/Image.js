import Experience from "./Experience.js";
import { apiGetImages } from "../Api/apiExemple.js";

export default class Image {
  constructor() {
    console.log("Image class initialized");
    this.experience = new Experience();
    this.debug = this.experience.debug;

    this.parameters = {};
    this.parameters.minId = 1;
    this.parameters.maxId = 10;
    this.parameters.targetElementId = "target-image";

    this.randomId = this.getRandomId(
      this.parameters.minId,
      this.parameters.maxId
    );
    this.imageLink = null;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🖼️ Image");
      this.debugFolder.close();
    }

    this.setInstance();
    this.setDebug();
  }

  setInstance() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.FetchAndSetImage()
      );
    } else {
      this.FetchAndSetImage();
    }
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder
        .add(this.parameters, "minId")
        .min(1)
        .max(100)
        .step(1)
        .onChange(() => {
          this.randomId = this.getRandomId(
            this.parameters.minId,
            this.parameters.maxId
          );
          this.FetchAndSetImage();
        });

      this.debugFolder
        .add(this.parameters, "maxId")
        .min(1)
        .max(100)
        .step(1)
        .onChange(() => {
          this.randomId = this.getRandomId(
            this.parameters.minId,
            this.parameters.maxId
          );
          this.FetchAndSetImage();
        });
    }
  }

  getRandomId(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async FetchAndSetImage() {
    try {
      const imageData = await apiGetImages(this.randomId);
      console.log("Réponse API :", imageData);

      if (imageData && imageData.link) {
        this.imageLink = imageData.link;

        const targetImg = document.getElementById(
          this.parameters.targetElementId
        );
        if (targetImg) {
          targetImg.src = this.imageLink + "?t=" + Date.now();
          console.log("Image mise à jour :", targetImg.src);
        } else {
          console.warn(
            "Impossible de trouver l'élément :",
            this.parameters.targetElementId
          );
        }
      } else {
        console.warn("Aucune image trouvée pour id :", this.randomId);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image :", error);
    }
  }
}
