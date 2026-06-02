import { createNetworkEngine } from '../lib/network-engine.js';

export function initConnectionQuantity(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 50,
    chargeStrength: -80,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    const nodes = engine.getNodes();
    const links = engine.getLinks();

    function buildLocalNetwork() {
      nodes.length = 0;
      links.length = 0;

      for (let i = 0; i < 60; i++) {
        nodes.push({
          id: i, state: 1, quality: 1.0, signal: 0,
          radius: 5, community: Math.floor(i / 10),
          x: canvas.clientWidth/2 + (Math.random()-0.5)*200,
          y: canvas.clientHeight/2 + (Math.random()-0.5)*200
        });
      }

      // Build 6 local tribes
      for (let i = 0; i < 60; i++) {
        for (let j = i + 1; j < 60; j++) {
          if (nodes[i].community === nodes[j].community) {
            if (Math.random() > 0.4) {
              links.push({ source: i, target: j, type: 'strong', weight: 1.0, active: true });
            }
          } else {
            // Very rare global links
            if (Math.random() > 0.99) {
              links.push({ source: i, target: j, type: 'weak', weight: 1.0, active: true });
            }
          }
        }
      }
      engine.rebuildSimulation();
    }

    buildLocalNetwork();

    if (controls['deploy-internet']) {
      controls['deploy-internet'].addEventListener('click', () => {
        // Add 100 random global connections
        for (let i = 0; i < 150; i++) {
          const s = Math.floor(Math.random() * nodes.length);
          const t = Math.floor(Math.random() * nodes.length);
          if (s !== t && !links.find(l => (l.source.id === s && l.target.id === t) || (l.target.id === s && l.source.id === t))) {
            links.push({ source: nodes[s], target: nodes[t], type: 'default', weight: 0.3, active: true });
          }
        }
        engine.rebuildSimulation();
        engine.getSimulation().alpha(1).restart();
      });
    }

    if (controls['reset-connections']) {
      controls['reset-connections'].addEventListener('click', buildLocalNetwork);
    }
  };

  engine.init();
  return engine;
}
