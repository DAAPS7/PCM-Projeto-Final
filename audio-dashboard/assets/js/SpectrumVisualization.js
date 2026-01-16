import { AudioVisualization } from "./AudioVisualization.js";

export class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas

    this.addProperty("barWidth", 1);
  }

  draw() {
    this.clearCanvas();

    if (this.getProperties().drawGrid) this.drawGrid();

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const barWidth = this.canvas.clientWidth / data.length;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * this.canvas.clientHeight;
      const x = i * barWidth;
      const y = this.canvas.clientHeight - barHeight;

      this.ctx.fillStyle = this.getProperties().primaryColor;
      this.ctx.fillRect(
        x,
        y,
        barWidth * this.getProperties().barWidth,
        barHeight
      );
    }
  }

  getProperties() {
    return super.getProperties();
  }

  resetProperties() {
    this.getProperties().primaryColor = "#4cc9f0";
    this.getProperties().secondaryColor = "#ffffff";
    this.getProperties().drawGrid = false;
    this.getProperties().gridWidth = 75;
    this.getProperties().audioSensitivity = 1;
    this.getProperties().barWidth = 1;
  }
}
