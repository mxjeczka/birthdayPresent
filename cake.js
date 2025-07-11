window.addEventListener("DOMContentLoaded", () => {
  const flame = document.getElementById("flame");
  let audioContext;
  let analyser;
  let dataArray;
  let blowStartTime = null;
  let candlesBlownOut = false;

  async function initBlowDetection() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);

      detectBlow();
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  }

  function detectBlow() {
    if (!analyser || !dataArray || candlesBlownOut) return;

    analyser.getByteFrequencyData(dataArray);
    const lowFrequencyValues = dataArray.slice(0, 15);
    const averageLowFrequency =
      lowFrequencyValues.reduce((sum, value) => sum + value, 0) / lowFrequencyValues.length;

    const blowThreshold = 100; // Schwellenwert für Blasen
    const requiredDuration = 1500; // 1,5 Sekunden Blasen erforderlich

    if (averageLowFrequency > blowThreshold) {
      if (!blowStartTime) {
        blowStartTime = performance.now();
      } else if (performance.now() - blowStartTime > requiredDuration) {
        candlesBlownOut = true;
        extinguishFlame();
      }
    } else {
      if (blowStartTime && performance.now() - blowStartTime > 200) {
        blowStartTime = null;
      }
    }

    requestAnimationFrame(detectBlow);
  }

  function extinguishFlame() {
    flame.classList.add("extinguished");
  }

  // Mikrofon erst nach kurzem Timeout anfragen (optional)
  setTimeout(() => {
    initBlowDetection();
  }, 1000);
});
