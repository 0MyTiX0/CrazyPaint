import EventEmitter from "./Utils/EventEmitter.js";

export default class Wheel {
  constructor(experience) {
    this.experience = experience;
    this.debug = this.experience.debug;

    this.parameters = {};
    this.parameters.isSpinning = false;
    this.parameters.currentRotation = 0;
    this.parameters.spinDuration = 3000;

    this.segments = [
      {
        name: "Buffer Effacement -10 sec",
        angle: 22.5,
        startAngle: 0,
        endAngle: 45,
      },
      {
        name: "Vitesse Effacement X3",
        angle: 67.5,
        startAngle: 45,
        endAngle: 90,
      },
      {
        name: "Outils Aléatoires",
        angle: 112.5,
        startAngle: 90,
        endAngle: 135,
      },
      {
        name: "Outils Qui Fuient",
        angle: 157.5,
        startAngle: 135,
        endAngle: 180,
      },
      {
        name: "Buffer Effacement -15 sec",
        angle: 202.5,
        startAngle: 180,
        endAngle: 225,
      },
      {
        name: "Vitesse Effacement X2",
        angle: 247.5,
        startAngle: 225,
        endAngle: 270,
      },
      {
        name: "De moins En Moins D'outils",
        angle: 292.5,
        startAngle: 270,
        endAngle: 315,
      },
      {
        name: "Image Difficile",
        angle: 337.5,
        startAngle: 315,
        endAngle: 360,
      },
    ];

    this.setElements();
    this.setEventListeners();
    this.setDebug();
  }

  setElements() {
    this.wheelElement = document.getElementById("wheel");
    this.spinButton = document.getElementById("spinBtn");
    this.resultElement = document.getElementById("result");
  }

  setEventListeners() {
    if (this.spinButton) {
      this.spinButton.addEventListener("click", () => {
        if (!this.parameters.isSpinning) {
          this.spin();
          this.spinButton.hidden = true;
        }
      });
    }

    if (this.wheelElement) {
      this.wheelElement.addEventListener("transitionend", () => {
        this.parameters.isSpinning = false;
      });
    }
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🎰 Wheel");

      this.debugFolder
        .add(this.parameters, "spinDuration")
        .min(1000)
        .max(10000)
        .step(100)
        .name("Spin Duration (ms)");

      this.debugFolder
        .add(this.parameters, "currentRotation")
        .min(0)
        .max(360)
        .step(1)
        .name("Current Rotation (°)");

      this.debugFolder
        .add({ spinWheel: () => this.spin() }, "spinWheel")
        .name("Spin the Wheel 🎡");
    }
  }

  spin() {
    this.parameters.isSpinning = true;

    if (this.resultElement) {
      this.resultElement.classList.add("hidden");
    }

    const minSpins = 3;
    const maxSpins = 6;
    const extraRotation =
      (Math.random() * (maxSpins - minSpins) + minSpins) * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = extraRotation + randomAngle;

    // Calcul de la rotation totale basée sur la position actuelle
    const totalRotation = this.parameters.currentRotation + newRotation;

    console.log(
      `🎯 Current rotation: ${this.parameters.currentRotation.toFixed(1)}°`
    );
    console.log(`🎯 New rotation to add: ${newRotation.toFixed(1)}°`);
    console.log(`🎯 Total rotation: ${totalRotation.toFixed(1)}°`);

    if (this.wheelElement) {
      this.wheelElement.style.transition = `transform ${this.parameters.spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      this.wheelElement.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      const finalAngle = totalRotation % 360;
      console.log(`🎯 Final angle: ${finalAngle.toFixed(1)}°`);

      const result = this.calculateResultFromRotation(finalAngle);
      this.showResult(result);
      this.parameters.isSpinning = false;
      this.parameters.currentRotation = totalRotation;
    }, this.parameters.spinDuration);
  }

  calculateResult(finalAngle) {
    const normalizedAngle = ((finalAngle % 360) + 360) % 360;

    for (let segment of this.segments) {
      if (
        normalizedAngle >= segment.startAngle &&
        normalizedAngle < segment.endAngle
      ) {
        return segment;
      }
    }

    return this.segments[0];
  }

  calculateResultFromRotation(wheelRotation) {
    // Calcule où pointe la flèche après rotation de la roue
    const pointerPosition = (360 - wheelRotation) % 360;

    console.log(
      `🎯 Pointer points to: ${pointerPosition.toFixed(1)}° on original wheel`
    );

    for (let segment of this.segments) {
      if (
        pointerPosition >= segment.startAngle &&
        pointerPosition < segment.endAngle
      ) {
        console.log(
          `✅ Selected: ${segment.name} (${segment.startAngle}° - ${segment.endAngle}°)`
        );
        return segment;
      }
    }

    return this.segments[0];
  }

  showResult(segment) {
    if (this.resultElement) {
      const resultText = this.resultElement.querySelector("span");
      if (resultText) {
        resultText.textContent = segment.name;
      }
      this.resultElement.classList.remove("hidden");
    }

    console.log(`🎰 Résultat: ${segment.name}`);
  }
}
