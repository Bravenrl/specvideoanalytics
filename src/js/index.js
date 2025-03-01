const toggler = document.querySelector('.menu__toggler');
const menu = document.querySelector('.menu');
const body = document.querySelector('.body');
const header = document.querySelector('.header');
const mobileMatch = window.matchMedia('only screen and (max-width: 769px)');

//menu

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

// anchor

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

// popup

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

/// slider

const newsToggler = document.querySelector('#news-toggler');
const newsContent = document.querySelector('.news__list');

const slideUp = (target, duration = 300) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  setTimeout(() => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

const slideDown = (target, duration = 300) => {
  target.style.removeProperty('display');
  let display = getComputedStyle(target).display;
  if (display === 'none') display = 'block';
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

const slideToggle = (target, duration = 300) => {
  if (getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};

const openSection = () => {
  newsContent.classList.remove('news__list--closed');
  newsToggler.classList.remove('news__toggler__btn--closed');
  slideDown(newsContent);
};

const closeSection = () => {
  newsContent.classList.add('news__list--closed');
  newsToggler.classList.add('news__toggler__btn--closed');
  slideUp(newsContent);
};

const toggleSection = () => {
  if (newsContent.classList.contains('news__list--closed')) {
    openSection();
  } else {
    closeSection();
  }
};

(function initNewsToggler() {
  if (mobileMatch.matches) {
    closeSection();
  }
  newsToggler.addEventListener('click', toggleSection);
})();

mobileMatch.addEventListener('change', () => {
  if (
    !mobileMatch.matches &&
    newsContent.classList.contains('news__list--closed')
  ) {
    openSection();
  }
});
