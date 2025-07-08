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

    // Drag functionality
    let offsetX = 0;

    img.addEventListener('mousedown', (e) => {
        img.classList.add('dragging');
        offsetX = e.clientX;

        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - offsetX;
            img.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;
        };

        const onMouseUp = () => {
            img.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Snap image to side if dragged far
            const finalX = parseInt(img.style.transform.match(/-?\d+/)) || 0;
            if (Math.abs(finalX) > 150) {
                img.style.transition = 'transform 0.5s ease-out';
                img.style.transform = `translateX(${finalX > 0 ? 500 : -500}px) rotate(${finalX > 0 ? 45 : -45}deg)`;
                setTimeout(() => {
                    img.remove();

                    // Wenn keine Bilder mehr da sind – Text anzeigen
                    if (container.querySelectorAll('img').length === 0) {
                        finalMessage.classList.remove('hidden');
                    }
                }, 500);

            } else {
                img.style.transition = 'transform 0.3s ease';
                img.style.transform = 'translateX(0) rotate(0deg)';
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    container.appendChild(img);

    const finalMessage = document.getElementById('final-message');
    finalMessage.addEventListener('click', () => {
        window.location.href = 'card.html';
    });


});
