import { createNetworkEngine } from '../lib/network-engine.js';

export function initWhatsNext(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 100,
    linkDistance: 45,
    chargeStrength: -40,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    
    // Add some color variance to represent diversity
    const nodes = engine.getNodes();
    nodes.forEach((n, i) => {
      n.community = i % 5;
    });

    engine.rebuildSimulation();
  };

  engine.init();
  return engine;
}
