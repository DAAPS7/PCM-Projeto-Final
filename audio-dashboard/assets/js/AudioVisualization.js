// Classe Abstrata Base para Visualizações
class AudioVisualization {
  constructor(canvas, audioProcessor) {
    if (this.constructor === AudioVisualization) {
      throw new Error(
        "AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente."
      );
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.audioProcessor = audioProcessor;
    this.name = "Visualização";
    this.properties = {};
    this.testData = new Uint8Array(256);
    this.frameCount = 0;

    this.WIDTH = this.canvas.clientWidth;
    this.HEIGHT = this.canvas.clientHeight;

    // Inicializar dados de teste
    for (let i = 0; i < this.testData.length; i++) {
      this.testData[i] = Math.sin(i / 10) * 128 + 128;
    }

    this.resize();

    this.addProperty("drawGrid", false);
    this.addProperty("gridWidth", 75);
    this.addProperty("audioSensitivity", 1);
    this.addProperty("primaryColor", "#4cc9f0");
    this.addProperty("secondaryColor", "#ffffff");
  }

  // Método abstrato
  draw() {
    throw new Error("Método draw() deve ser implementado pela subclasse.");
  }

  update() {
    this.draw();
    this.showVisualization();
    this.frameCount++;
    this.audioProcessor.update();
    // Atualizar de 10 em 10 frames
    if (this.frameCount % 10 === 0) this.audioProcessor.updateUI();
  }

  showVisualization() {
    this.ctx.font = "15px Inter"; // Set font first so measurement is correct

    const padding = 20; // Space on left + right inside box
    const textWidth = this.ctx.measureText(this.name).width;
    const boxWidth = textWidth + padding;

    this.ctx.beginPath();
    this.ctx.roundRect(10, 15, boxWidth, 30, 5);
    this.ctx.fillStyle = "#0000006f";
    this.ctx.fill();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(this.name, 20, 35);
  }

  resize(clientRect) {
    const rect = clientRect || this.canvas.getBoundingClientRect();
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";

    const dpr = 2 * window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    this.WIDTH = rect.width;
    this.HEIGHT = rect.height;
  }

  addProperty(property, value) {
    this.properties[property] = value;
  }

  getProperties() {
    return this.properties;
  }

  // Reinicia as propriedades da visualização
  resetProperties() {
    throw new Error(
      "Método resetProperties() deve ser implementado pela subclasse."
    );
  }

  updateProperty(property, value) {
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid() {
    const gridSize = this.getProperties().gridWidth;

    this.ctx.strokeStyle = this.getProperties().secondaryColor;
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
}
