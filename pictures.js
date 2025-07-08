// Richtige Viewport-Höhe setzen, besonders für Mobilgeräte
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setRealVh();
window.addEventListener('resize', setRealVh);


const images = [
    'assets/images/image1.jpg',
    'assets/images/image2.jpg',
    'assets/images/image3.jpg',
    'assets/images/image4.jpg'
];

const container = document.getElementById('image-container');
const finalMessage = document.getElementById('final-message');

let loaded = 0;

images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.zIndex = images.length - index;

    img.addEventListener('load', () => {
        loaded++;
        if (loaded === images.length) {
            loadingText.style.display = 'none';
        }
    });

    let offsetX = 0;

    function startDrag(e) {
        e.preventDefault();
        img.classList.add('dragging');

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        offsetX = clientX;

        function onMove(moveEvent) {
            const currentX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const deltaX = currentX - offsetX;
            img.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;
        }

        function onEnd() {
            img.classList.remove('dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);

            const transformMatch = img.style.transform.match(/-?\d+/);
            const finalX = transformMatch ? parseInt(transformMatch[0]) : 0;

            if (Math.abs(finalX) > 150) {
                img.style.transition = 'transform 0.5s ease-out';
                img.style.transform = `translateX(${finalX > 0 ? 500 : -500}px) rotate(${finalX > 0 ? 45 : -45}deg)`;
                setTimeout(() => {
                    img.remove();

                    if (container.querySelectorAll('img').length === 0) {
                        finalMessage.classList.remove('hidden');
                    }
                }, 500);
            } else {
                img.style.transition = 'transform 0.3s ease';
                img.style.transform = 'translateX(0) rotate(0deg)';
            }
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onEnd);
    }

    img.addEventListener('mousedown', startDrag);
    img.addEventListener('touchstart', startDrag, { passive: false });

    container.appendChild(img);
});

finalMessage.addEventListener('click', () => {
    window.location.href = 'card.html';
});
