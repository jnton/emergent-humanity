import { createNetworkEngine } from '../lib/network-engine.js';

export function initWeakTies(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 40,
    chargeStrength: -50,
  });

  let mode = 'all'; // 'all', 'no-weak', 'no-strong'

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    // Clear auto-generated network
    nodes.length = 0;
    links.length = 0;

    // Create 3 communities
    const numComms = 3;
    const commSize = 20;

    for (let i = 0; i < numComms * commSize; i++) {
      const comm = Math.floor(i / commSize);
      nodes.push({
        id: i,
        state: 1,
        quality: 0.5,
        signal: 0,
        signalType: null,
        radius: 5 + Math.random() * 2,
        degree: 0,
        community: comm,
        strategy: null,
        x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 100 + (comm === 0 ? -100 : comm === 1 ? 100 : 0),
        y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 100 + (comm === 2 ? 100 : -50),
      });
    }

    // Fully connect within communities (strong ties)
    for (let c = 0; c < numComms; c++) {
      const offset = c * commSize;
      for (let i = 0; i < commSize; i++) {
        // connect to 3 random nodes in same community
        for (let j = 0; j < 3; j++) {
          const target = Math.floor(Math.random() * commSize);
          if (i !== target) {
            links.push({
              source: offset + i,
              target: offset + target,
              type: 'strong',
              weight: 1.0,
              active: true,
              phase: 0
            });
          }
        }
      }
    }

    // Add weak ties between communities
    for (let c1 = 0; c1 < numComms; c1++) {
      for (let c2 = c1 + 1; c2 < numComms; c2++) {
        for (let i = 0; i < 2; i++) { // 2 weak ties between each pair of communities
          const n1 = c1 * commSize + Math.floor(Math.random() * commSize);
          const n2 = c2 * commSize + Math.floor(Math.random() * commSize);
          links.push({
            source: n1,
            target: n2,
            type: 'weak',
            weight: 1.0,
            active: true,
            phase: 0
          });
        }
      }
    }

    engine.rebuildSimulation();

    // Hook up controls
    if (controls['toggle-weak']) {
      controls['toggle-weak'].addEventListener('click', () => {
        mode = 'no-weak';
        updateVisibility();
      });
    }
    if (controls['toggle-strong']) {
      controls['toggle-strong'].addEventListener('click', () => {
        mode = 'no-strong';
        updateVisibility();
      });
    }

    updateStats();
  };

  function updateVisibility() {
    const links = engine.getLinks();
    for (const link of links) {
      if (mode === 'all') link.active = true;
      else if (mode === 'no-weak') link.active = (link.type !== 'weak');
      else if (mode === 'no-strong') link.active = (link.type !== 'strong');
    }
    // Re-simulate to show physical separation when weak ties removed
    engine.getSimulation().force('link').links(links.filter(l => l.active));
    engine.getSimulation().alpha(0.5).restart();
    updateStats();
  }

  function updateStats() {
    const statsEl = document.getElementById('stats-weak-ties');
    if (!statsEl) return;
    const links = engine.getLinks().filter(l => l.active);
    const strong = links.filter(l => l.type === 'strong').length;
    const weak = links.filter(l => l.type === 'weak').length;
    statsEl.innerHTML = `Active Ties: ${links.length} (Strong: ${strong}, Weak: ${weak})`;
  }

  engine.init();
  return engine;
}
