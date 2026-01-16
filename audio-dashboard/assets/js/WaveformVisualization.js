import { AudioVisualization } from "./AudioVisualization.js";

export class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas

    this.addProperty("lineWidth", 4);
  }

  draw() {
    this.clearCanvas();

    if (this.getProperties().drawGrid) this.drawGrid();

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;
    const sliceWidth = this.canvas.clientWidth / data.length;

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.clientHeight / 2);

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * this.canvas.clientHeight) / 2;
      const x = i * sliceWidth;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.strokeStyle = this.getProperties().primaryColor;
    this.ctx.lineWidth = this.getProperties().lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    return super.getProperties();
  }

  resetProperties() {
    this.getProperties().lineWidth = 4;
    this.getProperties().drawGrid = false;
    this.getProperties().gridWidth = 75;
    this.getProperties().audioSensitivity = 1;
    this.getProperties().primaryColor = "#4cc9f0";
    this.getProperties().secondaryColor = "#ffffff";
  }
}
