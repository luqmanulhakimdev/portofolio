/**
 * Portfolio Main Scripts
 * Handles dynamic footer year and mobile navigation toggle.
 */

'use strict';

// Dynamic year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mobile Navigation Module
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

  // Close menu when clicking any nav link
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.classList.contains('is-active')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close menu if window is resized past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && toggle.classList.contains('is-active')) {
      closeMenu();
    }
  });
})();
