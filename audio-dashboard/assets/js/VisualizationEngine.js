// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId, audioProcessor) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;
    this.audioProcessor = audioProcessor;

    this.initRect = this.canvas.getBoundingClientRect();

    // Inicializar visualizações
    this.initVisualizations();
  }

  initVisualizations() {
    this.visualizations.set(
      "spectrum",
      new SpectrumVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "waveform",
      new WaveformVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "particles",
      new ParticleVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "reactiveBall",
      new ReactiveBallVisualization(this.canvas, this.audioProcessor)
    );
  }

  setVisualization(type) {
    this.currentVisualization = null;
    this.currentVisualization = this.visualizations.get(type);
    // Reinicia as propriedades da visualização para voltar a sincronizar a propriedade ao valor inicial do slider
    if (this.currentVisualization) this.currentVisualization.resetProperties();
    console.log(this.currentVisualization);
    console.log(`Definindo visualização: ${type}`);
    return this.currentVisualization; // Devolver boolean indicando sucesso
  }

  start() {
    // Garantir que start não é chamado se o loop já estiver a correr
    if (this.isRunning) return;
    this.isRunning = true;
    // Chama o loop
    this.animationId = requestAnimationFrame(() => this.updateLoop());

    console.log("Iniciando motor de visualização...");
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      // Para o loop
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      // Para o processamento de áudio
      this.audioProcessor.stop();
    }
    this.currentVisualization.clearCanvas();

    console.log("Parando motor de visualização...");
  }

  updateLoop() {
    // Garante que a atualização para se o loop já foi parado
    if (!this.isRunning) return;
    // Recursivamente corre o loop
    this.animationId = requestAnimationFrame(() => this.updateLoop());
    // Atualiza a visualização
    this.currentVisualization.update();
  }

  resize(rect) {
    this.currentVisualization.resize(rect);
  }

  fullscreen() {
    this.canvas.requestFullscreen().catch((error) => {
      console.error(`${error.message}`);
    });

    document.addEventListener("fullscreenchange", () => {
      // Redimensionar com o retângulo de fullscreen
      if (document.fullscreenElement) this.resize(null);
      // Redimensionar com o retângulo inicial
      else this.resize(this.initRect);
    });
  }

  getVisualizationProperties() {
    return this.currentVisualization.getProperties();
  }

  updateVisualizationProperty(property, value) {
    console.log(`Atualizando propriedade: ${property} = ${value}`);
    this.currentVisualization.updateProperty(property, value);
    if (property === "audioSensitivity")
      this.audioProcessor.setAudioSensitivity(value);
  }
}
