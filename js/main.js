// ==========================================================================
// Main Orchestrator
// Builds the page from content/sections.js, wires up visualizations,
// manages scroll-based activation/deactivation.
// ==========================================================================

import { SECTIONS } from '../content/sections.js';
import { initNetworkIntro } from './visualizations/network-intro.js';
import { initNodeRemoval } from './visualizations/node-removal.js';
import { initWeakTies } from './visualizations/weak-ties.js';
import { initStructuralHoles } from './visualizations/structural-holes.js';
import { initTemporal } from './visualizations/temporal.js';
import { initDunbar } from './visualizations/dunbar.js';
import { initCooperation } from './visualizations/cooperation.js';
import { initNodesAndChannels } from './visualizations/nodes-and-channels.js';
import { initEchoChambers } from './visualizations/echo-chambers.js';
import { initWhatsNext } from './visualizations/whats-next.js';

// Map section IDs to their initialization functions
const VIZ_INIT = {
  'the-network': initNetworkIntro,
  'node-removal': initNodeRemoval,
  'weak-ties': initWeakTies,
  'structural-holes': initStructuralHoles,
  'temporal': initTemporal,
  'dunbar': initDunbar,
  'cooperation': initCooperation,
  'nodes-channels': initNodesAndChannels,
  'echo-chambers': initEchoChambers,
  'whats-next': initWhatsNext,
};

const vizInstances = {};
let heroCanvas = null;
let heroCtx = null;
let heroNodes = [];
let heroAnimFrame = null;

// ------ Build DOM ------

function buildPage() {
  const container = document.querySelector('.scroll-container');
  if (!container) return;

  // Hero section
  const hero = buildHero();
  container.appendChild(hero);

  // Content sections
  for (const section of SECTIONS) {
    const el = buildSection(section);
    container.appendChild(el);
  }

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    Emergent Humanity — an open exploration ·
    <a href="https://github.com" target="_blank" rel="noopener">View source on GitHub</a>
  `;
  container.appendChild(footer);
}

function buildHero() {
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.id = 'hero';
  hero.innerHTML = `
    <canvas id="hero-canvas"></canvas>
    <h1 class="hero-title">Emergent Humanity</h1>
    <p class="hero-subtitle">
      An interactive exploration of humanity as a network —
      through mathematics, information theory, and graph theory.
    </p>
    <div class="scroll-indicator">
      <span class="scroll-indicator-text">Scroll to explore</span>
      <div class="scroll-indicator-arrow"></div>
    </div>
  `;
  return hero;
}

function buildSection(section) {
  const el = document.createElement('section');
  el.className = 'section';
  el.id = `section-${section.id}`;
  el.dataset.sectionId = section.id;

  // Viz pane
  const vizPane = document.createElement('div');
  vizPane.className = 'viz-pane';
  vizPane.innerHTML = `
    <canvas id="canvas-${section.id}"></canvas>
    <div class="viz-stats" id="stats-${section.id}"></div>
    ${section.vizHint ? `<div class="viz-hint">${section.vizHint}</div>` : ''}
  `;

  // Controls
  if (section.controls && section.controls.length > 0) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'viz-controls';

    for (const ctrl of section.controls) {
      if (ctrl.type === 'button') {
        const btn = document.createElement('button');
        btn.className = `viz-btn${ctrl.variant ? ` viz-btn--${ctrl.variant}` : ''}`;
        btn.id = `ctrl-${ctrl.id}`;
        btn.textContent = ctrl.label;
        controlsDiv.appendChild(btn);
      } else if (ctrl.type === 'slider') {
        const wrapper = document.createElement('div');
        wrapper.className = 'slider-container';
        wrapper.innerHTML = `
          <span class="slider-label">${ctrl.label}</span>
          <input type="range" id="ctrl-${ctrl.id}"
                 min="${ctrl.min}" max="${ctrl.max}"
                 step="${ctrl.step}" value="${ctrl.value}">
          <span class="slider-value">${Math.round(ctrl.value * 100)}%</span>
        `;
        controlsDiv.appendChild(wrapper);
      }
    }

    vizPane.appendChild(controlsDiv);
  }

  el.appendChild(vizPane);

  // Text pane
  const textPane = document.createElement('div');
  textPane.className = 'text-pane';

  let textHTML = `<div class="text-content">`;
  textHTML += `<div class="section-number">${section.number}</div>`;
  textHTML += `<h2 class="section-title">${section.title}</h2>`;
  textHTML += `<p class="section-subtitle">${section.subtitle}</p>`;

  for (const para of section.body) {
    textHTML += `<p class="text-body">${para}</p>`;
  }

  if (section.math) {
    textHTML += `<div class="math-block">${section.math.replace(/\n/g, '<br>')}</div>`;
  }

  if (section.insight) {
    textHTML += `<div class="insight">${section.insight}</div>`;
  }
  
  if (section.keyTerms && section.keyTerms.length > 0) {
    textHTML += `<div class="key-terms">
      <strong>Key Terms:</strong> ${section.keyTerms.join(', ')}
    </div>`;
  }
  


  textHTML += `</div>`;
  textPane.innerHTML = textHTML;
  el.appendChild(textPane);

  return el;
}

// ------ Hero Background Animation ------

function initHeroCanvas() {
  heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas) return;
  heroCtx = heroCanvas.getContext('2d');

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    heroCanvas.width = w * dpr;
    heroCanvas.height = h * dpr;
    heroCanvas.style.width = w + 'px';
    heroCanvas.style.height = h + 'px';
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  // Generate hero background nodes
  const count = window.innerWidth < 900 ? 40 : 70;
  heroNodes = [];
  for (let i = 0; i < count; i++) {
    heroNodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2 + Math.random() * 2,
    });
  }

  function animateHero() {
    heroAnimFrame = requestAnimationFrame(animateHero);
    const w = window.innerWidth;
    const h = window.innerHeight;
    heroCtx.clearRect(0, 0, w, h);

    // Update positions
    for (const n of heroNodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // Draw connections
    const maxDist = 120;
    for (let i = 0; i < heroNodes.length; i++) {
      for (let j = i + 1; j < heroNodes.length; j++) {
        const dist = Math.hypot(heroNodes[i].x - heroNodes[j].x, heroNodes[i].y - heroNodes[j].y);
        if (dist < maxDist) {
          heroCtx.beginPath();
          heroCtx.moveTo(heroNodes[i].x, heroNodes[i].y);
          heroCtx.lineTo(heroNodes[j].x, heroNodes[j].y);
          heroCtx.strokeStyle = `rgba(79, 156, 247, ${0.15 * (1 - dist / maxDist)})`;
          heroCtx.lineWidth = 0.5;
          heroCtx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of heroNodes) {
      heroCtx.beginPath();
      heroCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      heroCtx.fillStyle = 'rgba(79, 156, 247, 0.3)';
      heroCtx.fill();
    }
  }

  animateHero();
}

// ------ Scroll Observer ------

function setupScrollObserver() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const sectionId = entry.target.dataset.sectionId;
        if (!sectionId) continue;

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          initViz(sectionId);
          activateViz(sectionId);
        } else {
          entry.target.classList.remove('is-visible');
          deactivateViz(sectionId);
        }
      }
    },
    {
      root: document.querySelector('.scroll-container'),
      threshold: 0.25,
    }
  );

  for (const section of sections) {
    observer.observe(section);
  }
}

function initViz(sectionId) {
  if (vizInstances[sectionId]) return; // Already initialized

  const initFn = VIZ_INIT[sectionId];
  if (!initFn) return;

  const canvas = document.getElementById(`canvas-${sectionId}`);
  if (!canvas) return;

  // Gather controls
  const section = SECTIONS.find(s => s.id === sectionId);
  const controls = {};
  if (section?.controls) {
    for (const ctrl of section.controls) {
      const el = document.getElementById(`ctrl-${ctrl.id}`);
      if (el) controls[ctrl.id] = el;
    }
  }

  vizInstances[sectionId] = initFn(canvas, controls);
}

function activateViz(sectionId) {
  vizInstances[sectionId]?.activate();
}

function deactivateViz(sectionId) {
  vizInstances[sectionId]?.deactivate();
}

// ------ Window Resize ------

function setupResizeHandler() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      for (const [id, instance] of Object.entries(vizInstances)) {
        instance.engine?.resize();
      }
    }, 200);
  });
}

// ------ Init ------

document.addEventListener('DOMContentLoaded', () => {
  buildPage();
  initHeroCanvas();
  setupScrollObserver();
  setupResizeHandler();
});
