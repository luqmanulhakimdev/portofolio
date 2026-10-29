/**
 * Intermezzo Stories Scripts
 * Handles dynamic footer year, photo lightbox viewer, 3D card tilt effect,
 * and mobile navigation toggle.
 */

'use strict';

// Dynamic year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Interactive Lightbox Modal
(() => {
  const lightbox = document.getElementById('trailLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) return;

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  };

  document.querySelectorAll('.abstract-photo-wrapper').forEach((viewport) => {
    viewport.addEventListener('click', () => {
      const fullSrc = viewport.getAttribute('data-full');
      const caption = viewport.getAttribute('data-caption');
      lightboxImg.src = fullSrc;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption || '';
      }
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
})();

// Subtle 3D Depth Photo Tilt on Desktop
(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.floating-photo-container').forEach((container) => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    container.addEventListener('mouseleave', () => {
      container.style.transform = '';
    });
  });
})();

// Mobile Navigation Toggle
(() => {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('primary-nav');
  const backdrop = document.getElementById('nav-backdrop');

  if (!toggle || !navLinks) return;

  const openMenu = () => {
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-active');
    document.body.classList.add('nav-open');
  };

  const closeMenu = () => {
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-active');
    document.body.classList.remove('nav-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('is-active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.classList.contains('is-active')) {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && toggle.classList.contains('is-active')) {
      closeMenu();
    }
  });
})();
