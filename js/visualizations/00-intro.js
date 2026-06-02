import { createNetworkEngine } from '../lib/network-engine.js';

export function initIntro(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 80,
    linkDistance: 60,
    chargeStrength: -30, // less repel when isolated
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    function isolateHumans() {
      // Remove all connections
      links.length = 0;
      
      // Weaken charge so they just float around loosely
      engine.getSimulation().force('charge').strength(-20);
      engine.rebuildSimulation();
      engine.getSimulation().alpha(1).restart();
    }

    function formOrganism() {
      links.length = 0; // clear any existing just in case
      
      // Connect them using a basic preferential attachment or random web
      for (let i = 0; i < nodes.length; i++) {
        const numEdges = 1 + Math.floor(Math.random() * 2);
        for (let e = 0; e < numEdges; e++) {
          const target = Math.floor(Math.random() * nodes.length);
          if (target !== i) {
            links.push({ source: nodes[i], target: nodes[target], type: 'default', weight: 1.0, active: true });
          }
        }
      }

      // Stronger charge now that they are connected
      engine.getSimulation().force('charge').strength(-80);
      engine.rebuildSimulation();
      engine.getSimulation().alpha(1).restart();
    }

    // Start isolated
    isolateHumans();

    if (controls['connect-humans']) {
      controls['connect-humans'].addEventListener('click', formOrganism);
    }

    if (controls['isolate-humans']) {
      controls['isolate-humans'].addEventListener('click', isolateHumans);
    }
  };

  engine.init();
  return engine;
}
