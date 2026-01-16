import { AudioProcessor } from "./AudioProcessor.js";
import { VisualizationEngine } from "./VisualizationEngine.js";

export class App {
  constructor({ audioEl, audioContext, canvasId = "audioCanvas" }) {
    this.audioEl = audioEl;
    this.audioContext = audioContext;

    this.audioProcessor = new AudioProcessor({
      audioContext: this.audioContext,
      audioEl: this.audioEl,
    });

    this.visualizationEngine = new VisualizationEngine(
      canvasId,
      this.audioProcessor
    );

    this.init();
  }

  init() {
    this.setDefaultVisualization();
    console.log("App inicializada");
  }

  async play() {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    await this.audioEl.play();
    this.visualizationEngine.start();
  }

  pause() {
    this.audioEl.pause();
    this.visualizationEngine.stop();
  }

  stop() {
    this.audioEl.pause();
    this.audioEl.currentTime = 0;
    this.visualizationEngine.stop();
  }

  loadAudioFile(file) {
    this.audioEl.src = URL.createObjectURL(file);
    this.audioEl.load();
  }

  setDefaultVisualization() {
    this.setVisualization("spectrum");
  }

  setVisualization(type) {
    const ok = this.visualizationEngine.setVisualization(type);

    if (!ok) {
      console.warn(
        `Visualização "${type}" inexistente. A selecionar "spectrum".`
      );
      this.setDefaultVisualization();
    }
  }
}
