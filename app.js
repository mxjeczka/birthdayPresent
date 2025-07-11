/* --------------------------------------------------
   Hilfsfunktionen – SPA‑Navigation + VH‑Fix
-------------------------------------------------- */
const pages = [...document.querySelectorAll('section')];
let current = 0;

export function nextPage () {
  pages[current].hidden = true;
  current = (current + 1) % pages.length;
  pages[current].hidden = false;
  // Beim Aufrufen der neuen Seite deren Setup starten
  setups[current] && setups[current]();
}

/* iOS‑Viewport‑Fix */
function setRealVh(){
  document.documentElement.style.setProperty('--vh',`${window.innerHeight * 0.01}px`);
}
setRealVh();  window.addEventListener('resize',setRealVh);


/* --------------------------------------------------
   PAGE‑1  (Intro, Regenbogen, GIF + AUDIO Start)
-------------------------------------------------- */
function setupPage1(){
  const sentences = ['<p>Wszystkiego najlepszego z okazji</p>'];
  const rainbowHTML = '<span>u</span><span>r</span><span>o</span><span>d</span><span>z</span><span>i</span><span>n</span>';
  const textWrapper    = document.getElementById('text-wrapper');
  const rainbowWrapper = document.getElementById('rainbow-wrapper');
  const catGif         = document.getElementById('catBalloon-gif');
  const container      = document.getElementById('click-container');
  const bgAudio        = document.getElementById('bg-audio');

  let step = 0;
  let audioStarted = false;

  container.onclick = () => {
    if (!audioStarted) {
      bgAudio.play().catch(err => console.warn('Autoplay blockiert:', err));
      audioStarted = true;
    }

    if(step===0){
      textWrapper.innerHTML = sentences[0];
      requestAnimationFrame(()=>textWrapper.firstElementChild.classList.add('visible'));
      step++;
    }else if(step===1){
      rainbowWrapper.innerHTML = rainbowHTML;
      rainbowWrapper.classList.add('visible');
      catGif.classList.add('visible');
      step++;
    }else{
      nextPage();
    }
  };
}


/* --------------------------------------------------
   PAGE‑2  (Swipe‑Bilder)
-------------------------------------------------- */
function setupPage2(){
  const pics = [
    ...Array.from({length:19},(_,i)=>`assets/images/image${i+1}.jpg`)
  ];
  const cont = document.getElementById('image-container');
  const finalMsg = document.getElementById('final-message');

  cont.innerHTML='';            // reset
  pics.forEach((src,idx)=>{
    const img=document.createElement('img');
    img.src=src; img.style.zIndex=pics.length-idx;
    cont.appendChild(img);

    let startX=0;
    const start = e=>{
      e.preventDefault();
      img.classList.add('dragging');
      startX=(e.touches?e.touches[0].clientX:e.clientX);
      document.addEventListener('mousemove',move);
      document.addEventListener('touchmove',move,{passive:false});
      document.addEventListener('mouseup',end);
      document.addEventListener('touchend',end);
    };
    const move = e=>{
      const x=(e.touches?e.touches[0].clientX:e.clientX)-startX;
      img.style.transform=`translateX(${x}px) rotate(${x/10}deg)`;
    };
    const end = ()=>{
      img.classList.remove('dragging');
      const m=img.style.transform.match(/-?\d+/);
      const final=m?+m[0]:0;
      if(Math.abs(final)>150){
        img.style.transition='transform .5s ease-out';
        img.style.transform=`translateX(${final>0?500:-500}px) rotate(${final>0?45:-45}deg)`;
        setTimeout(()=>{
          img.remove();
          if(!cont.querySelector('img')) finalMsg.classList.remove('hidden');
        },500);
      }else{
        img.style.transition='transform .3s ease';
        img.style.transform='translateX(0) rotate(0)';
      }
      document.removeEventListener('mousemove',move);
      document.removeEventListener('touchmove',move);
      document.removeEventListener('mouseup',end);
      document.removeEventListener('touchend',end);
    };
    img.addEventListener('mousedown',start);
    img.addEventListener('touchstart',start,{passive:false});
  });

  finalMsg.onclick=nextPage;
}


/* --------------------------------------------------
   PAGE‑3  (Klappkarte)
-------------------------------------------------- */
function setupPage3(){
  const container=document.getElementById('card-container');
  container.innerHTML=`
    <div id="card">
      <div id="card-front"  class="wrap"><h1>Otwórz&nbsp;mnie</h1></div>
      <div id="card-inside" class="wrap hidden">
        <p>Wszystkiego najlepszego!</p>
        <p>Niech każdy dzień będzie<br>lepszy od poprzedniego.</p>
        <p>Uśmiechu, zdrowia i spełnienia najskrytszych marzeń!</p>
        <p class="signed">– Maja&nbsp;i&nbsp;Marcel&nbsp;❤️</p>
      </div>
    </div>
    <div class="button-group">
      <button id="open-card-btn">Otwórz kartkę</button>
      <button id="close-card-btn" style="display:none">Zamknij kartkę</button>
      <button id="to-cake-btn">Dalej</button>
    </div>`;

  const front  = container.querySelector('#card-front');
  const inside = container.querySelector('#card-inside');
  const openB  = container.querySelector('#open-card-btn');
  const closeB = container.querySelector('#close-card-btn');
  openB.onclick = ()=>{front.classList.add('hidden');inside.classList.remove('hidden');openB.style.display='none';closeB.style.display='inline-block';};
  closeB.onclick= ()=>{inside.classList.add('hidden');front.classList.remove('hidden');closeB.style.display='none';openB.style.display='inline-block';};
  container.querySelector('#to-cake-btn').onclick=nextPage;
}


/* --------------------------------------------------
   PAGE‑4  (Kerzen + Pusten)
-------------------------------------------------- */
function setupPage4(){
  let blown=false;
  const flames=[...document.querySelectorAll('.flame')];
  const happy =document.getElementById('happy-birthday');
  const conf  =document.getElementById('confetti');

  function blowOut(){
    if(blown) return;
    blown=true;
    flames.forEach(f=>{f.classList.add('out');f.style.animationPlayState='paused';});
    happy.classList.add('visible');
    conf.classList.remove('hidden');conf.classList.add('visible');
    setTimeout(()=>conf.classList.remove('visible'),2500);
  }

  flames.forEach(f => { f.style.cursor='pointer'; f.onclick=blowOut; });

  // Mikrofon‑Erkennung
  navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const an=ctx.createAnalyser();
    ctx.createMediaStreamSource(stream).connect(an);
    an.fftSize=512; const data=new Uint8Array(an.frequencyBinCount);
    let start=null;
    const loop=()=>{
      if(blown) return;
      an.getByteFrequencyData(data);
      const lvl=data.slice(0,15).reduce((s,v)=>s+v,0)/15;
      if(lvl>100){
        if(!start) start=performance.now();
        else if(performance.now()-start>1500) blowOut();
      }else start=null;
      requestAnimationFrame(loop);
    };
    loop();
  }).catch(console.warn);
}

/* --------------------------------------------------
   SPA‑Initialisierung
-------------------------------------------------- */
const setups=[setupPage1,setupPage2,setupPage3,setupPage4];
document.addEventListener('DOMContentLoaded',()=>setups[0]());
