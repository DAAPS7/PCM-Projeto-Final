// Classe principal da aplicação
export class App {
  constructor() {
    this.audioProcessor = new AudioProcessor(this);
    this.visualizationEngine = new VisualizationEngine(
      "audioCanvas",
      this.audioProcessor
    );

    // Inicialização
    this.init();
  }

  init() {
    this.setDefaultVisualization();
    console.log("App inicializada");
  }

  loadAudioFile(file) {
    this.uiManager.setButtonStates(true);
    this.audioProcessor
      .loadAudioFile(file)
      .then(() => {
        this.visualizationEngine.start();
      })
      .catch((error) => {
        this.uiManager.updateAudioInfo(error, true);
        this.uiManager.setButtonStates(false);
      });
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    this.uiManager.setButtonStates(false);
    console.log("Parando áudio...");
    this.visualizationEngine.stop();
    // Remove the file from the input
    this.uiManager.clearAudioInput();
  }

  setDefaultVisualization() {
    this.setVisualization("spectrum");
  }

  setVisualization(type) {
    this.uiManager.clearPropertyControls();
    if (this.visualizationEngine.setVisualization(type)) {
      console.log(`Definindo visualização: ${type}`);
      // Displays the current visualizations properties handlers
      this.uiManager.updatePropertiesPanel(type);
    } else {
      this.uiManager.showError(
        `Visualização ${type} inexistente. \n A selecionar visualização "Spectrum"`
      );
      this.setDefaultVisualization();
    }

    console.log(this.visualizationEngine.currentVisualization.getProperties());
  }
}
