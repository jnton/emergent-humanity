// ==========================================================================
// Section 1 Visualization: The Network
// Interactive force-directed graph showing emergence.
// ==========================================================================

import { createNetworkEngine } from '../lib/network-engine.js';

export function initNetworkIntro(canvas, controls) {
  const isMobile = window.innerWidth < 900;
  const engine = createNetworkEngine(canvas, {
    nodeCount: isMobile ? 55 : 80,
    linkDistance: isMobile ? 40 : 50,
    chargeStrength: isMobile ? -50 : -70,
  });

  engine.init();

  // Pulse animation — nodes gently breathe
  let pulsePhase = 0;
  let active = false;
  let pulseTimer = null;

  function startPulse() {
    if (pulseTimer) return;
    pulseTimer = setInterval(() => {
      if (!active) return;
      pulsePhase += 0.015;
      const nodes = engine.getNodes();
      for (const node of nodes) {
        if (node.state === 0) continue;
        node.quality = 0.4 + 0.15 * Math.sin(pulsePhase + node.id * 0.3);
      }
    }, 30);
  }

  function stopPulse() {
    if (pulseTimer) {
      clearInterval(pulseTimer);
      pulseTimer = null;
    }
  }

  // Controls
  if (controls['add-node']) {
    controls['add-node'].addEventListener('click', () => {
      engine.addNode();
      updateStats();
    });
  }

  if (controls['add-edges']) {
    controls['add-edges'].addEventListener('click', () => {
      const nodes = engine.getNodes().filter(n => n.state === 1);
      if (nodes.length < 2) return;
      // Add 3 random edges
      for (let i = 0; i < 3; i++) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a !== b) {
          engine.getLinks().push({ source: a, target: b });
          a.degree++;
          b.degree++;
        }
      }
      engine.getSimulation()?.alpha(0.3).restart();
      updateStats();
    });
  }

  function updateStats() {
    const statsEl = canvas.parentElement?.querySelector('.viz-stats');
    if (!statsEl) return;
    const stats = engine.getStats();
    statsEl.innerHTML = `Nodes: <span>${stats.nodes}</span> · Edges: <span>${stats.edges}</span> · Avg degree: <span>${stats.avgDegree}</span>`;
  }

  // Initial stats
  setTimeout(updateStats, 100);

  return {
    activate: () => { active = true; engine.activate(); startPulse(); },
    deactivate: () => { active = false; engine.deactivate(); stopPulse(); },
    destroy: () => { stopPulse(); engine.destroy(); },
    engine,
  };
}
