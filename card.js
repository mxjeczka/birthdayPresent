const cardFront = document.getElementById('card-front');
const cardInside = document.getElementById('card-inside');
const openBtn = document.getElementById('open-card-btn');
const closeBtn = document.getElementById('close-card-btn');

openBtn.addEventListener('click', () => {
  cardFront.style.display = 'none';
  cardInside.style.display = 'block';
  openBtn.style.display = 'none';
  closeBtn.style.display = 'inline-block';
});

closeBtn.addEventListener('click', () => {
  cardInside.style.display = 'none';
  cardFront.style.display = 'block';
  closeBtn.style.display = 'none';
  openBtn.style.display = 'inline-block';
});
