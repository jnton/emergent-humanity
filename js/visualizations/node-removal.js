// ==========================================================================
// Section 2 Visualization: One Node Goes Dark
// Node removal with damage radius visualization.
// ==========================================================================

import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeRemoval(canvas, controls) {
  const isMobile = window.innerWidth < 900;
  let damageHighlight = new Map(); // nodeId -> fadeout timer

  const engine = createNetworkEngine(canvas, {
    nodeCount: isMobile ? 55 : 80,
    linkDistance: isMobile ? 40 : 50,
    chargeStrength: isMobile ? -50 : -70,
    onNodeClick: (node) => {
      performRemoval(node);
    },
  });

  engine.init();

  function performRemoval(node) {
    const affectedIds = engine.removeNode(node);

    // Highlight affected neighbors
    for (const id of affectedIds) {
      const n = engine.getNodes()[id];
      if (n && n.state === 1) {
        n.signal = 1.0;
        n.signalType = 'noise';
        damageHighlight.set(id, 1.0);
      }
    }

    updateStats();

    // Fade out damage highlight
    const fadeInterval = setInterval(() => {
      let anyActive = false;
      for (const [id, val] of damageHighlight) {
        const newVal = val - 0.015;
        if (newVal <= 0) {
          damageHighlight.delete(id);
          const n = engine.getNodes()[id];
          if (n) {
            n.signal = 0;
            n.signalType = null;
          }
        } else {
          damageHighlight.set(id, newVal);
          const n = engine.getNodes()[id];
          if (n) n.signal = newVal;
          anyActive = true;
        }
      }
      if (!anyActive) clearInterval(fadeInterval);
    }, 30);
  }

  // Controls
  if (controls['remove-random']) {
    controls['remove-random'].addEventListener('click', () => {
      const alive = engine.getNodes().filter(n => n.state === 1);
      if (alive.length < 5) return;
      const target = alive[Math.floor(Math.random() * alive.length)];
      performRemoval(target);
    });
  }

  if (controls['remove-hub']) {
    controls['remove-hub'].addEventListener('click', () => {
      const alive = engine.getNodes().filter(n => n.state === 1);
      if (alive.length < 5) return;
      // Find highest-degree node
      const hub = alive.reduce((best, n) => n.degree > best.degree ? n : best, alive[0]);
      performRemoval(hub);
    });
  }

  if (controls['reset-network']) {
    controls['reset-network'].addEventListener('click', () => {
      damageHighlight.clear();
      engine.reset(isMobile ? 55 : 80);
      updateStats();
    });
  }

  function updateStats() {
    const statsEl = canvas.parentElement?.querySelector('.viz-stats');
    if (!statsEl) return;
    const stats = engine.getStats();
    const total = engine.getNodes().length;
    const removed = total - stats.nodes;
    statsEl.innerHTML = `Alive: <span>${stats.nodes}</span> · Removed: <span>${removed}</span> · Edges: <span>${stats.edges}</span>`;
  }

  setTimeout(updateStats, 100);

  return {
    activate: () => engine.activate(),
    deactivate: () => engine.deactivate(),
    destroy: () => engine.destroy(),
    engine,
  };
}
