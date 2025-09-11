import Experience from "./Experience.js";

export default class Tools {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.context = this.experience.paint.context;

    this.parameters = {};
    this.parameters.squareDensity = 10;
    this.parameters.circleDensity = 4;
    this.parameters.fillDensity = 7;

    this.colorDisplay = document.querySelector(".color-display");

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("✏️ Tools");
      // this.debugFolder.close();
    }

    this.setDebug();
    this.setActiveColor();
  }
  setDebug() {
    //debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.parameters, "squareDensity")
        .min(0)
        .max(200)
        .step(1);
      this.debugFolder
        .add(this.parameters, "circleDensity")
        .min(0)
        .max(200)
        .step(1);
      this.debugFolder
        .add(this.parameters, "fillDensity")
        .min(0)
        .max(200)
        .step(1);
    }
  }
  setActiveColor() {
    // this.colorDisplay.style.backgroundColor =
    // this.experience.paint.parameters.pencilColor;
  }
  changeColor(color) {
    this.experience.paint.parameters.pencilColor = color;
    this.setActiveColor();
  }
  clearCanvas() {
    this.experience.mouse.drawingHistory = [];
  }
  setPencilRadius(radius) {
    this.experience.paint.parameters.pencilRadius = radius;
  }
  generateSquare(points) {
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    points = [
      { x: startPoint.x, y: startPoint.y },
      { x: endPoint.x, y: startPoint.y },
      { x: endPoint.x, y: endPoint.y },
      { x: startPoint.x, y: endPoint.y },
      { x: startPoint.x, y: startPoint.y },
    ];

    let newPoints = [];
    newPoints.push(points[0]);

    for (let i = 0; i < points.length - 1; i++) {
      const x1 = points[i].x,
        y1 = points[i].y;
      const x2 = points[i + 1].x,
        y2 = points[i + 1].y;

      if (y1 === y2) {
        // horizontal edge: step x
        const stepX = (x2 >= x1 ? 1 : -1) * this.parameters.squareDensity;
        for (let x = x1 + stepX; stepX > 0 ? x <= x2 : x >= x2; x += stepX) {
          newPoints.push({ x: x, y: y1 });
        }
      } else if (x1 === x2) {
        // vertical edge: step y
        const stepY = (y2 >= y1 ? 1 : -1) * this.parameters.squareDensity;
        for (let y = y1 + stepY; stepY > 0 ? y <= y2 : y >= y2; y += stepY) {
          newPoints.push({ x: x1, y: y });
        }
      }
    }

    return newPoints;
  }
  generateCircle(points, anchor) {
    if (!points || points.length < 2) return points;

    const startX = anchor.x;
    const startY = anchor.y;
    const endX = points[points.length - 1].x;
    const endY = points[points.length - 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const sideLength = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    if (!isFinite(sideLength) || sideLength <= 0) return points;

    const topLeftX = deltaX >= 0 ? startX : startX - sideLength;
    const topLeftY = deltaY >= 0 ? startY : startY - sideLength;

    const centerX = topLeftX + sideLength / 2;
    const centerY = topLeftY + sideLength / 2;
    const radius = sideLength / 2;

    const circumferenceInPixels = 2 * Math.PI * radius;
    const spacing = Math.max(1, Number(this.parameters.circleDensity) || 1); // pixels between points
    const numberOfSegments = Math.max(
      12,
      Math.ceil(circumferenceInPixels / spacing)
    );
    const angleStepInRadians = (2 * Math.PI) / numberOfSegments;

    const coordinates = [];
    for (
      let segmentIndex = 0;
      segmentIndex <= numberOfSegments;
      segmentIndex++
    ) {
      const angleInRadians = segmentIndex * angleStepInRadians;
      const x = centerX + radius * Math.cos(angleInRadians);
      const y = centerY + radius * Math.sin(angleInRadians);
      coordinates.push({ x, y });
    }
    return coordinates;
  }
  generateFill(startX, startY, colorMatchTolerance = 0) {
    const context = this.canvas.getContext("2d");
    const width = this.canvas.width | 0;
    const height = this.canvas.height | 0;

    // Guard inputs
    if (!Number.isFinite(startX) || !Number.isFinite(startY)) return [];
    const seedX = Math.max(0, Math.min(width - 1, Math.floor(startX)));
    const seedY = Math.max(0, Math.min(height - 1, Math.floor(startY)));

    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    const offset = (x, y) => (y * width + x) * 4;

    // Seed color
    const o0 = offset(seedX, seedY);
    const seedR = data[o0],
      seedG = data[o0 + 1],
      seedB = data[o0 + 2],
      seedA = data[o0 + 3];

    // Match rule (RGBA with per-channel tolerance)
    const tol = Math.max(0, colorMatchTolerance | 0);
    const matches = (x, y) => {
      const o = offset(x, y);
      const r = data[o],
        g = data[o + 1],
        b = data[o + 2],
        a = data[o + 3];
      return (
        Math.abs(r - seedR) <= tol &&
        Math.abs(g - seedG) <= tol &&
        Math.abs(b - seedB) <= tol &&
        Math.abs(a - seedA) <= tol
      );
    };

    // Flood fill to build a boolean mask of the region
    const mask = new Uint8Array(width * height);
    const visited = new Uint8Array(width * height);
    const qx = new Int32Array(width * height);
    const qy = new Int32Array(width * height);
    let qh = 0,
      qt = 0;

    qx[qt] = seedX;
    qy[qt] = seedY;
    qt++;

    let minX = seedX,
      maxX = seedX,
      minY = seedY,
      maxY = seedY;

    while (qh < qt) {
      const x = qx[qh],
        y = qy[qh];
      qh++;
      const idx = y * width + x;
      if (visited[idx]) continue;
      visited[idx] = 1;
      if (!matches(x, y)) continue;

      mask[idx] = 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      if (x > 0) {
        const n = idx - 1;
        if (!visited[n]) {
          qx[qt] = x - 1;
          qy[qt] = y;
          qt++;
        }
      }
      if (x + 1 < width) {
        const n = idx + 1;
        if (!visited[n]) {
          qx[qt] = x + 1;
          qy[qt] = y;
          qt++;
        }
      }
      if (y > 0) {
        const n = idx - width;
        if (!visited[n]) {
          qx[qt] = x;
          qy[qt] = y - 1;
          qt++;
        }
      }
      if (y + 1 < height) {
        const n = idx + width;
        if (!visited[n]) {
          qx[qt] = x;
          qy[qt] = y + 1;
          qt++;
        }
      }
    }

    // Build stroke segments (horizontal runs), spaced by this.parameters.fillDensity rows.
    const spacing = Math.max(1, Math.floor(this.parameters.fillDensity || 1));

    // ⚠️ 'strokes' is now a flat array of points: [{x,y}, {x,y}, ...]
    const strokes = [];

    for (let y = minY; y <= maxY; y += spacing) {
      let x = minX;
      while (x <= maxX) {
        // Skip non-region pixels
        while (x <= maxX && mask[y * width + x] === 0) x++;
        if (x > maxX) break;

        // Capture a contiguous run [runStart, runEnd]
        const runStart = x;
        while (x <= maxX && mask[y * width + x] === 1) x++;
        const runEnd = x - 1;

        // Convert this run into a polyline with the same spacing along X
        const innerStep = spacing;
        if (runEnd >= runStart) {
          strokes.push({ x: runStart, y });
          for (let xi = runStart + innerStep; xi <= runEnd; xi += innerStep) {
            strokes.push({ x: xi, y });
          }
          // Ensure we hit the exact end pixel
          if (strokes[strokes.length - 1].x !== runEnd) {
            strokes.push({ x: runEnd, y });
          }
        }
      }
    }

    return strokes; // Array of point arrays; draw each with your drawStroke(...)
  }
}
