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

// Dark Neural Network Background Module (Section #about)
(() => {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const container = canvas.closest('#about') || canvas.parentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let animationId = null;
  let isVisible = true;

  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
    radius: 190
  };

  // Dark Palette for Nodes
  const DARK_PALETTE = [
    { fill: '#14202b', stroke: 'rgba(75, 105, 130, 0.45)', core: '#0a1219' },
    { fill: '#182735', stroke: 'rgba(85, 120, 145, 0.48)', core: '#0d1620' },
    { fill: '#111b24', stroke: 'rgba(65, 90, 115, 0.40)', core: '#080e14' },
    { fill: '#1c2e3d', stroke: 'rgba(90, 130, 160, 0.50)', core: '#0f1822' }
  ];

  const nodeCount = 52;
  const nodes = [];
  const pulses = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) return;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function initNodes() {
    nodes.length = 0;
    pulses.length = 0;

    for (let i = 0; i < nodeCount; i++) {
      const p = DARK_PALETTE[i % DARK_PALETTE.length];
      const size = 3.0 + Math.random() * 2.0;

      nodes.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 400),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: size,
        palette: p,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.02,
        excitation: 0
      });
    }
  }

  // Fire an electrical pulse traveling along a synapse
  function fireSynapticPulse(fromX, fromY, toNode, isMouse = false) {
    pulses.push({
      fromX,
      fromY,
      toX: toNode.x,
      toY: toNode.y,
      progress: 0,
      speed: 0.028 + Math.random() * 0.02,
      color: isMouse ? 'rgba(95, 145, 175, 0.8)' : 'rgba(70, 110, 140, 0.65)',
      targetNode: toNode
    });
  }

  let frameCount = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);
    frameCount++;

    // Smooth cursor movement interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.16;
    mouse.y += (mouse.targetY - mouse.y) * 0.16;

    // Spontaneous action potential firing across random neighboring nodes
    if (frameCount % 45 === 0 && nodes.length > 2) {
      const n1 = nodes[Math.floor(Math.random() * nodes.length)];
      let closest = null;
      let minDist = 120;
      for (let k = 0; k < nodes.length; k++) {
        const n2 = nodes[k];
        if (n1 === n2) continue;
        const d = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (d < minDist) {
          minDist = d;
          closest = n2;
        }
      }
      if (closest) {
        fireSynapticPulse(n1.x, n1.y, closest, false);
      }
    }

    // 1. Draw Synapses (Connecting axon threads)
    const maxDist = 125;
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const proximityAlpha = 1 - dist / maxDist;
          const isExcited = n1.excitation > 0.1 || n2.excitation > 0.1;

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);

          if (isExcited) {
            ctx.strokeStyle = `rgba(75, 115, 145, ${proximityAlpha * 0.5})`;
            ctx.lineWidth = 1.0;
          } else {
            ctx.strokeStyle = `rgba(45, 68, 88, ${proximityAlpha * 0.3})`;
            ctx.lineWidth = 0.7;
          }
          ctx.stroke();
        }
      }
    }

    // 2. Interactive Pointer Stimulator Connections
    if (mouse.active && mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const strength = 1 - dist / mouse.radius;
          node.excitation = Math.max(node.excitation, strength);

          // Gravitational attraction toward cursor (network organically follows pointer)
          if (!prefersReduced && dist > 15) {
            const pull = strength * 0.65;
            node.x += (dx / dist) * pull;
            node.y += (dy / dist) * pull;
          }

          // Connecting thread to pointer
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = `rgba(70, 110, 145, ${strength * 0.45})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Occasionally fire synaptic impulse from pointer into node
          if (frameCount % 24 === 0 && Math.random() < 0.35) {
            fireSynapticPulse(mouse.x, mouse.y, node, true);
          }
        }
      }

      // Pointer Minimal Dark Reticle
      ctx.save();
      ctx.strokeStyle = 'rgba(75, 115, 145, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Center dark bead
      ctx.fillStyle = '#14202b';
      ctx.strokeStyle = 'rgba(85, 125, 155, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 3. Render and Update Synaptic Pulses
    for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
      const pulse = pulses[pIdx];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        if (pulse.targetNode) {
          pulse.targetNode.excitation = 1.0;
        }
        pulses.splice(pIdx, 1);
        continue;
      }

      const currX = pulse.fromX + (pulse.toX - pulse.fromX) * pulse.progress;
      const currY = pulse.fromY + (pulse.toY - pulse.fromY) * pulse.progress;

      ctx.save();
      ctx.fillStyle = pulse.color;
      ctx.beginPath();
      ctx.arc(currX, currY, 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Render and Update Dark Nodes (Titik Gelap)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.pulse += node.pulseSpeed;
      node.excitation *= 0.94; // Decay excitation

      const dynamicRadius = node.radius + (node.excitation * 1.5) + Math.sin(node.pulse) * 0.3;

      ctx.save();

      // Subtle outer accent ring if excited by pointer
      if (node.excitation > 0.15) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicRadius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80, 125, 155, ${node.excitation * 0.45})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Main dark dot body
      ctx.beginPath();
      ctx.arc(node.x, node.y, dynamicRadius, 0, Math.PI * 2);
      ctx.fillStyle = node.excitation > 0.3 ? '#1c2e3d' : node.palette.fill;
      ctx.fill();
      ctx.strokeStyle = node.excitation > 0.3 ? 'rgba(95, 140, 175, 0.65)' : node.palette.stroke;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Inner dark nucleus/core
      ctx.beginPath();
      ctx.arc(node.x, node.y, dynamicRadius * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = node.palette.core;
      ctx.fill();

      ctx.restore();

      // Movement physics
      if (!prefersReduced) {
        node.x += node.vx;
        node.y += node.vy;

        // Gentle edge bounce
        if (node.x < 0) { node.x = 0; node.vx *= -1; }
        else if (node.x > width) { node.x = width; node.vx *= -1; }
        if (node.y < 0) { node.y = 0; node.vy *= -1; }
        else if (node.y > height) { node.y = height; node.vy *= -1; }
      }
    }

    if (!prefersReduced && isVisible) {
      animationId = requestAnimationFrame(render);
    }
  }

  // Pointer event listeners on the #about container
  if (container) {
    container.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    });

    container.addEventListener('mouseleave', () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    }, { passive: true });

    container.addEventListener('touchend', () => {
      mouse.active = false;
    });
  }

  window.addEventListener('resize', () => {
    resize();
    if (prefersReduced) render();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReduced) {
          cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animationId);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(canvas);
  }

  resize();
  initNodes();
  render();
})();
