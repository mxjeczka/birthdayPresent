
const cardFront = document.getElementById('card-front');
const cardInside = document.getElementById('card-inside');
const openBtn = document.getElementById('open-card-btn');
const closeBtn = document.getElementById('close-card-btn');

openBtn.addEventListener('click', () => {
  cardFront.classList.add('hidden');    // Front ausblenden
  cardInside.classList.remove('hidden'); // Inside einblenden
  openBtn.style.display = 'none';
  closeBtn.style.display = 'inline-block';
});

closeBtn.addEventListener('click', () => {
  cardInside.classList.add('hidden');   // Inside ausblenden
  cardFront.classList.remove('hidden'); // Front einblenden
  closeBtn.style.display = 'none';
  openBtn.style.display = 'inline-block';
});

const toCakeBtn = document.getElementById('to-cake-btn');

toCakeBtn.addEventListener('click', () => {
  window.location.href = 'cake.html'; // Weiterleitung zur Cake-Seite
});
