import { createNetworkEngine } from '../lib/network-engine.js';

export function initTemporal(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 30,
    linkDistance: 60,
    chargeStrength: -80,
  });

  let burstiness = 0.8;

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    nodes.length = 0;
    links.length = 0;

    // Generate path
    for (let i = 0; i < 30; i++) {
      nodes.push({
        id: i, state: 1, quality: 0.5, signal: 0,
        radius: 4, community: null,
        x: canvas.clientWidth/2 + (Math.random()-0.5)*150,
        y: canvas.clientHeight/2 + (Math.random()-0.5)*150
      });
    }

    // Connect them
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 2; j++) {
        const target = Math.floor(Math.random() * 30);
        if (i !== target) {
          links.push({
            source: i, target: target,
            type: 'default', weight: 1.0, active: false,
            phase: Math.random() * Math.PI * 2,
            burstOffset: Math.random() * 10000
          });
        }
      }
    }

    engine.rebuildSimulation();

    if (controls['burst-slider']) {
      controls['burst-slider'].addEventListener('input', (e) => {
        burstiness = parseFloat(e.target.value);
        const valSpan = e.target.parentElement.querySelector('.slider-value');
        if (valSpan) valSpan.textContent = Math.round(burstiness * 100) + '%';
      });
    }

    // Custom tick for temporal dynamics
    let lastTime = performance.now();
    engine.getSimulation().on('tick.temporal', () => {
      const now = performance.now();
      // Burstiness determines how "spiky" the active phases are
      links.forEach(l => {
        const timeFactor = (now + l.burstOffset) * 0.001;
        // High burstiness = sharp peaks, long silence
        // Low burstiness = mostly always active
        const val = Math.sin(timeFactor * (1 + burstiness * 5));
        const threshold = 0.9 - (1 - burstiness) * 0.8; 
        l.active = val > threshold;
      });
    });
  };

  engine.init();
  return engine;
}
