const toggler = document.querySelector('.menu__toggler');
const menu = document.querySelector('.menu');
const body = document.querySelector('.body');
const header = document.querySelector('.header');

toggler.addEventListener('click', () => {
  toggler.classList.toggle('menu__toggler--active');
  menu.classList.toggle('menu--active');
  body.classList.toggle('menu--active');
  header.classList.toggle('menu--active');
});

menu.addEventListener('click', () => {
  toggler.classList.toggle('menu__toggler--active');
  menu.classList.toggle('menu--active');
  body.classList.toggle('menu--active');
  header.classList.toggle('menu--active');
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') {
      window.scrollTo({
        top: window.offsetTop || 0,
        behavior: 'smooth',
      });
      return;
    }

    const targetSection = document.querySelector(targetId);
    window.scrollTo({
      top: targetSection.offsetTop - 50,
      behavior: 'smooth',
    });
  });
});

const openModalButtons = document.querySelectorAll('.callback__btn--popup');
const modal = document.querySelector('#modal');
const closeModalButton = document.querySelector('#close-btn');

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.showModal();
  });
});

closeModalButton.addEventListener('click', () => {
  modal.close();
});
