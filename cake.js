(() => {
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
    const averageLowFrequency = lowFrequencyValues.reduce((sum, val) => sum + val, 0) / lowFrequencyValues.length;

    const blowThreshold = 100;  // Schwellenwert fürs Pusten
    const requiredDuration = 1500; // 1.5 Sekunden pusten

    if (averageLowFrequency > blowThreshold) {
      if (!blowStartTime) {
        blowStartTime = performance.now();
      } else if (performance.now() - blowStartTime > requiredDuration) {
        candlesBlownOut = true;
        blowOutFlames();
      }
    } else {
      if (blowStartTime && performance.now() - blowStartTime > 200) {
        blowStartTime = null;
      }
    }

    requestAnimationFrame(detectBlow);
  }

 function blowOutFlames(){
  // Flammen stoppen
  document.querySelectorAll('.flame').forEach(f=>{
    f.classList.add('out');
    f.style.animationPlayState='paused';
  });

  // Happy‑Birthday‑Bogen einblenden
  const happy = document.getElementById('happy-birthday');
  if(happy) happy.classList.add('visible');

  const confetti = document.getElementById('confetti');
if (confetti) {
  confetti.classList.remove('hidden');
   if (confetti){
    confetti.classList.add('visible');      // einblenden

    //  ► nach 5 Sekunden wieder ausblenden
    setTimeout(()=>{
      confetti.classList.remove('visible');
    }, 2500);  // Dauer in ms   ⇐ hier an GIF‑Länge anpassen

  }
  }
  }



  window.addEventListener("load", () => {
    initBlowDetection();

    // Klick zum Testen auf PC
    const flames = document.querySelectorAll(".flame");
    flames.forEach(f => {
      f.style.cursor = "pointer";
      f.addEventListener("click", () => {
        if (!candlesBlownOut) {
          candlesBlownOut = true;
          blowOutFlames();
        }
      });
    });
  });
})();
