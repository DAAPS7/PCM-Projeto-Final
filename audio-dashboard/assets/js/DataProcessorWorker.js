// Worker that calculates the RMS of the waveform array and returns the percentage

function calculateRMS(waveform) {
  // RMS of the samples in the whole array of the waveform data
  let sumSquares = 0;
  for (let sample of waveform) {
    let normalizedSample = (sample - 128) / 128;
    sumSquares += normalizedSample * normalizedSample;
  }

  let rms = Math.sqrt(sumSquares / waveform.length);

  return rms * 100;
}

onmessage = (e) => {
  const { args } = e.data;

  postMessage(calculateRMS(args));
};
