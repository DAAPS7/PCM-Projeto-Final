// Processamento de Áudio
class AudioProcessor {
  constructor(app) {
    this.app = app;
    this.audioContext = new AudioContext();
    this.analyser = null;
    this.mediaStream = null;
    this.frequencyData = null;
    this.waveformData = null;
    this.rmsLevel = null;
    this.isPlaying = false;
    this.source = null;
    this.audioSens = 1;

    // Worker for RMS calculation
    this.worker = new Worker("js/DataProcessorWorker.js");

    this.worker.onmessage = (e) => {
      this.rmsLevel = e.data;
    };

    this.setupAnalyser();
  }

  async loadAudioFile(file) {
    console.log("Carregando ficheiro de áudio...");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          this.stop();
          this.ensureRunning();

          if (this.source) this.source.disconnect();

          const audioBuffer = await this.audioContext.decodeAudioData(
            e.target.result
          );
          const source = this.audioContext.createBufferSource();
          source.buffer = audioBuffer;

          source.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);

          this.source = source;
          this.source.start();
          this.isPlaying = true;

          this.source.onended = () => {
            console.log("O áudio terminou");
            this.isPlaying = false;
          };

          resolve(e.target.result);
        } catch (error) {
          console.error("Erro ao decodificar ou configurar áudio:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  setupAnalyser() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  stop() {
    if (this.mediaStream)
      this.mediaStream.getTracks().forEach((track) => track.stop());

    if (this.source && this.source.stop) this.source.stop();

    if (this.audioContext) this.audioContext.suspend();

    this.updateUI();

    console.log("Parando processamento de áudio...");
  }

  async ensureRunning() {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  update() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);

    this.worker.postMessage({ args: this.getWaveformData() });
  }

  updateUI() {
    this.app.updateUIInfo();
  }

  getFrequencyData() {
    return this.applyAudioSensFreq(this.frequencyData);
  }

  getWaveformData() {
    return this.applyAudioSensWave(this.waveformData);
  }

  calculateAudioLevel() {
    return this.rmsLevel;
  }

  setAudioSensitivity(sens) {
    this.audioSens = sens;
  }

  applyAudioSensFreq(array, MAX = 255) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      let value = array[i] * this.audioSens;
      result[i] = value > MAX ? MAX : value;
    }
    return result;
  }

  applyAudioSensWave(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      let value = array[i];

      let normalized = (value - 128) / 128;

      normalized *= this.audioSens;

      if (normalized > 1) normalized = 1;
      if (normalized < -1) normalized = -1;

      result[i] = normalized * 128 + 128;
    }
    return result;
  }
}
