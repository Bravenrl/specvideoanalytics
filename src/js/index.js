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
