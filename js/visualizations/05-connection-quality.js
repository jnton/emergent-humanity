import { createNetworkEngine } from '../lib/network-engine.js';

export function initConnectionQuality(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 40,
    linkDistance: 70,
    chargeStrength: -120,
  });

  let noiseRatio = 0.2; // Signal vs Noise slider (0 = 100% signal, 1 = 100% noise)

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    // High quality nodes
    nodes.forEach(n => {
      n.quality = 1.0;
      n.radius = 6;
    });

    function updateNetwork() {
      links.forEach(l => {
        if (Math.random() < noiseRatio) {
          l.weight = Math.max(0.1, Math.random() * 0.5);
          l.type = 'weak';
        } else {
          l.weight = 1.0;
          l.type = 'strong';
        }
      });

      const sim = engine.getSimulation();
      const ld = 70 + (noiseRatio * 50);
      const cs = -120 + (noiseRatio * 60);

      sim.force('link').distance(ld);
      sim.force('charge').strength(cs);
      sim.alpha(0.3).restart();
    }

    if (controls['algorithm-slider']) {
      controls['algorithm-slider'].addEventListener('input', (e) => {
        noiseRatio = parseFloat(e.target.value);
        updateNetwork();
      });
    }

    // initial update
    updateNetwork();
  };

  engine.init();
  return engine;
}
