const sentences = [
    `<p>Wszystkiego najlepszego z okazji</p>`,
    `<p class="rainbow-text">
        <span>u</span><span>r</span><span>o</span><span>d</span><span>z</span><span>i</span><span>n</span>
    </p>`
];

const textWrapper = document.getElementById('text-wrapper');
const container = document.getElementById('click-container');
const catBalloonGif = document.getElementById('catBalloon-gif');

let visibleCount = 0;

container.addEventListener('click', () => {
    if (visibleCount < sentences.length) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sentences[visibleCount];
        const p = tempDiv.firstElementChild;

        textWrapper.appendChild(p);

        setTimeout(() => {
            p.classList.add('visible');
        }, 10);

        // Wenn der zweite Satz angezeigt wird, dann GIF sichtbar machen
        if (visibleCount === 1) {
            catBalloonGif.classList.add('visible');
        }

        visibleCount++;
    } else {
        window.location.href = 'pictures.html';
    }
});
