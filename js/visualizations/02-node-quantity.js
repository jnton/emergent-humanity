import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeQuantity(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 30, // Start small
    linkDistance: 50,
    chargeStrength: -100,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    if (controls['population-slider']) {
      controls['population-slider'].addEventListener('input', (e) => {
        const value = parseFloat(e.target.value); // 0.1 to 1.0
        const targetNodes = Math.floor(value * 200); // Max 200 nodes
        
        const nodes = engine.getNodes();
        const links = engine.getLinks();

        // Add nodes if target is higher
        if (targetNodes > nodes.length) {
          const diff = targetNodes - nodes.length;
          for (let i = 0; i < diff; i++) {
            const newNode = {
              id: Date.now() + i, state: 1, quality: 1.0, signal: 0,
              radius: 5, community: 0,
              x: canvas.clientWidth/2 + (Math.random()-0.5)*100,
              y: canvas.clientHeight/2 + (Math.random()-0.5)*100
            };
            nodes.push(newNode);

            // preferential attachment
            if (nodes.length > 1) {
              const numEdges = 1 + Math.floor(Math.random() * 2);
              for (let e = 0; e < numEdges; e++) {
                const target = nodes[Math.floor(Math.random() * (nodes.length - 1))];
                links.push({ source: newNode.id, target: target.id, type: 'default', weight: 1.0, active: true });
              }
            }
          }
        } 
        // Remove nodes if target is lower
        else if (targetNodes < nodes.length) {
          const diff = nodes.length - targetNodes;
          nodes.splice(-diff, diff);
          // Cleanup links
          const validIds = new Set(nodes.map(n => n.id));
          for (let i = links.length - 1; i >= 0; i--) {
            const sId = typeof links[i].source === 'object' ? links[i].source.id : links[i].source;
            const tId = typeof links[i].target === 'object' ? links[i].target.id : links[i].target;
            if (!validIds.has(sId) || !validIds.has(tId)) {
              links.splice(i, 1);
            }
          }
        }

        const sim = engine.getSimulation();
        sim.force('charge').strength(-100 + (value * 50));
        
        engine.rebuildSimulation();
        engine.getSimulation().alpha(0.5).restart();
      });
    }
  };

  engine.init();
  return engine;
}
