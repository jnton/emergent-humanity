import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeQuality(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 60,
    chargeStrength: -60,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    // Start everyone at low quality
    nodes.forEach(n => {
      n.quality = 0.2;
      n.radius = 4;
    });

    if (controls['educate-nodes']) {
      controls['educate-nodes'].addEventListener('click', () => {
        // Find an uneducated node and educate it, plus some neighbors
        const uneducated = nodes.filter(n => n.quality < 0.9);
        if (uneducated.length > 0) {
          // Educate 5 random nodes at a time
          for (let i = 0; i < 5 && i < uneducated.length; i++) {
            const target = uneducated[Math.floor(Math.random() * uneducated.length)];
            target.quality = 1.0;
            target.radius = 7;
            target.signal = 1.0; // make them flash
          }
        }
      });
    }

    if (controls['reset-quality']) {
      controls['reset-quality'].addEventListener('click', () => {
        nodes.forEach(n => {
          n.quality = 0.2;
          n.radius = 4;
        });
      });
    }
  };

  engine.init();
  return engine;
}
