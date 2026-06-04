// ==========================================================================
// Main Orchestrator
// Builds the page from content/sections.js, wires up visualizations,
// manages scroll-based activation/deactivation.
// ==========================================================================

import { SECTIONS } from '../content/sections.js';
import { initIntro } from './visualizations/00-intro.js';
import { initEmergentOrganism } from './visualizations/01-emergent-organism.js';
import { initNodeLimits } from './visualizations/02-node-limits.js';
import { initNodeQuantity } from './visualizations/02-node-quantity.js';
import { initNodeQuality } from './visualizations/03-node-quality.js';
import { initNodeCapacity } from './visualizations/04-node-capacity.js';
import { initIllusionOfSignificance } from './visualizations/04b-illusion.js?v=7';
import { initConnectionQuantity } from './visualizations/04-connection-quantity.js';
import { initConnectionQuality } from './visualizations/05-connection-quality.js';
import { initCohesion } from './visualizations/07-cohesion.js';
import { initAlignment } from './visualizations/08-alignment.js';
import { initCollectiveMemory } from './visualizations/09-collective-memory.js';
import { initEntropy } from './visualizations/10-entropy.js';
import { initProductivity } from './visualizations/10-productivity.js';
import { initWhatsNext } from './visualizations/11-whats-next.js';

// Map section IDs to their initialization functions
const VIZ_INIT = {
  'intro': initIntro,
  'node-capacity': initNodeCapacity,
  'illusion-of-significance': initIllusionOfSignificance,
  'node-limits': initNodeLimits,
  'node-quantity': initNodeQuantity,
  'emergent-organism': initEmergentOrganism,
  'connection-quantity': initConnectionQuantity,
  'connection-quality': initConnectionQuality,
  'cohesion': initCohesion,
  'alignment': initAlignment,
  'collective-memory': initCollectiveMemory,
  'entropy': initEntropy,
  'productivity': initProductivity,
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
      A personal attempt to make sense of humanity as an emergent network. 
      Exploring, trying to construct a worldview, and figuring out how we can improve.
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
      } else if (ctrl.type === 'switch') {
        const wrapper = document.createElement('label');
        wrapper.className = 'switch-container';
        wrapper.innerHTML = `
          <span class="switch-label">${ctrl.label}</span>
          <input type="checkbox" id="ctrl-${ctrl.id}" class="switch-input">
          <div class="switch-track">
            <div class="switch-thumb"></div>
          </div>
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

  let width, height, dpr;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    heroCanvas.width = width * dpr;
    heroCanvas.height = height * dpr;
    heroCanvas.style.width = width + 'px';
    heroCanvas.style.height = height + 'px';
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  // Generate hero background nodes - forming a spherical "organism"
  const count = window.innerWidth < 900 ? 150 : 350;
  heroNodes = [];
  const radius = Math.min(width, height) * 0.35; // Organism size

  for (let i = 0; i < count; i++) {
    // Random point in a sphere/circle using polar coords
    const r = radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    
    heroNodes.push({
      x: Math.cos(theta) * r,
      y: Math.sin(theta) * r,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      baseR: r, // remember distance from center to constrain it
    });
  }

  let zoomScale = 5.0; // Start heavily zoomed in on the connections
  let targetScale = 1.0;

  function animateHero() {
    heroAnimFrame = requestAnimationFrame(animateHero);
    
    // Smooth zoom out
    zoomScale += (targetScale - zoomScale) * 0.01;

    heroCtx.clearRect(0, 0, width, height);

    // Apply camera transform to center
    heroCtx.save();
    heroCtx.translate(width / 2, height / 2);
    heroCtx.scale(zoomScale, zoomScale);

    // Update positions and keep them roughly in a circle
    for (const n of heroNodes) {
      n.x += n.vx;
      n.y += n.vy;
      const currentR = Math.hypot(n.x, n.y);
      if (currentR > radius * 1.1) {
        n.vx -= (n.x / currentR) * 0.05;
        n.vy -= (n.y / currentR) * 0.05;
      }
    }

    // Draw connections
    const maxDist = 50; // Short connection distance creates dense local web
    heroCtx.beginPath();
    for (let i = 0; i < heroNodes.length; i++) {
      for (let j = i + 1; j < heroNodes.length; j++) {
        const dx = heroNodes[i].x - heroNodes[j].x;
        const dy = heroNodes[i].y - heroNodes[j].y;
        const distSq = dx*dx + dy*dy;
        if (distSq < maxDist * maxDist) {
          heroCtx.moveTo(heroNodes[i].x, heroNodes[i].y);
          heroCtx.lineTo(heroNodes[j].x, heroNodes[j].y);
        }
      }
    }
    // Fade out edges slightly as we zoom out so it looks cleaner
    const edgeAlpha = Math.min(0.2, 0.05 * zoomScale);
    heroCtx.strokeStyle = `rgba(79, 156, 247, ${edgeAlpha})`;
    heroCtx.lineWidth = 0.5;
    heroCtx.stroke();

    // Draw nodes
    heroCtx.fillStyle = 'rgba(79, 156, 247, 0.6)';
    heroCtx.beginPath();
    for (const n of heroNodes) {
      // Draw nodes smaller as we zoom out so they don't become massive blobs
      heroCtx.moveTo(n.x, n.y);
      heroCtx.arc(n.x, n.y, 1.5 / Math.max(1, zoomScale * 0.5), 0, Math.PI * 2);
    }
    heroCtx.fill();

    heroCtx.restore();
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
  if (vizInstances[sectionId]) {
    vizInstances[sectionId].init(); // Reset animation when scrolled to
    vizInstances[sectionId].activate();
  }
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

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const container = document.getElementById('scroll-container');
      const sections = Array.from(document.querySelectorAll('.hero, .section'));
      
      let currentIndex = 0;
      let minDiff = Infinity;
      sections.forEach((sec, idx) => {
        const diff = Math.abs(sec.offsetTop - container.scrollTop);
        if (diff < minDiff) {
          minDiff = diff;
          currentIndex = idx;
        }
      });

      let targetIndex = currentIndex;
      if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        targetIndex++;
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        targetIndex--;
      }

      if (targetIndex !== currentIndex) {
        container.scrollTo({
          top: sections[targetIndex].offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });

  // Setup Audio (Web Audio API Sci-Fi Drone)
  let audioCtx;
  let oscillators = [];
  const audioBtn = document.getElementById('toggle-audio');
  
  const iconOff = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>
  </svg><span>Audio Off</span>`;
  
  const iconOn = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg><span>Audio On</span>`;
  
  if (audioBtn) {
    let isPlaying = false;
    
    audioBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      
      if (isPlaying) {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          
          // Create a rich, evolving sci-fi drone using 3 low oscillators
          const freqs = [55, 110, 164.81]; // A1, A2, E3
          
          freqs.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            
            // Subtle evolving detune for an organic sci-fi feel
            setInterval(() => {
              osc.detune.linearRampToValueAtTime((Math.random() - 0.5) * 15, audioCtx.currentTime + 2);
            }, 2000);
            
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            
            // Very soft volume
            gain.gain.value = 0.05;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            oscillators.push({osc, gain, filter});
          });
        }
        
        audioCtx.resume();
        audioBtn.innerHTML = iconOn;
        audioBtn.classList.add('playing');
      } else {
        if (audioCtx) {
          audioCtx.suspend();
        }
        audioBtn.innerHTML = iconOff;
        audioBtn.classList.remove('playing');
      }
    });
  }

  // Interactive UI Sounds
  window.playInteractionSound = (type) => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    
    if (type === 'click') {
      // Minimalist deep electronic thud instead of water drop
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    } else if (type === 'slider') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, audioCtx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    }
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  };

  // Attach sounds to controls
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.id !== 'toggle-audio') {
      window.playInteractionSound('click');
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.type === 'range') {
      window.playInteractionSound('slider');
    }
  });
});
