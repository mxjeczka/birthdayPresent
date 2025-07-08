// Richtige Viewport-Höhe setzen, besonders für Mobilgeräte
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setRealVh();
window.addEventListener('resize', setRealVh);

const sentences = [
    `<p>Wszystkiego najlepszego z okazji</p>`
];

const rainbowHTML = `
    <span>u</span><span>r</span><span>o</span><span>d</span><span>z</span><span>i</span><span>n</span>
`;

const textWrapper = document.getElementById('text-wrapper');
const rainbowWrapper = document.getElementById('rainbow-wrapper');
const container = document.getElementById('click-container');
const catBalloonGif = document.getElementById('catBalloon-gif');

let visibleCount = 0;

container.addEventListener('click', () => {
    if (visibleCount === 0) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sentences[0];
        const p = tempDiv.firstElementChild;
        textWrapper.appendChild(p);
        setTimeout(() => {
            p.classList.add('visible');
        }, 10);
        visibleCount++;
    } else if (visibleCount === 1) {
        rainbowWrapper.innerHTML = rainbowHTML;
        rainbowWrapper.classList.add('visible');
        catBalloonGif.classList.add('visible');
        visibleCount++;
    } else {
        window.location.href = 'pictures.html';
    }
});
