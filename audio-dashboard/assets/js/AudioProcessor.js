// Processamento de áudio
export class AudioProcessor {
  constructor({ audioContext, audioEl }) {
    this.audioContext = audioContext;
    this.audioEl = audioEl;

    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    this.source = audioContext.createMediaElementSource(audioEl);

    this.source.connect(this.analyser);
    this.analyser.connect(audioContext.destination);

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  update() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);
  }

  getFrequencyData() {
    return this.frequencyData;
  }

  getWaveformData() {
    return this.waveformData;
  }

  calculateAudioLevel() {
    return this.calculateRMS(this.getWaveformData());
  }

  calculateRMS(waveform) {
    // RMS of the samples in the whole array of the waveform data
    let sumSquares = 0;
    for (let sample of waveform) {
      let normalizedSample = (sample - 128) / 128;
      sumSquares += normalizedSample * normalizedSample;
    }

    let rms = Math.sqrt(sumSquares / waveform.length);

    return rms * 100;
  }
}
