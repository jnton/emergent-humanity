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
          }
        }
      }
      engine.rebuildSimulation();
    }

    buildLocalNetwork();

    let deployInterval;

    if (controls['deploy-internet']) {
      controls['deploy-internet'].addEventListener('click', () => {
        if (deployInterval) clearInterval(deployInterval);
        
        let count = 0;
        const totalConnections = 150;
        const batchSize = 3;
        
        deployInterval = setInterval(() => {
          if (count >= totalConnections) {
            clearInterval(deployInterval);
            return;
          }
          
          let addedInBatch = 0;
          let attempts = 0;
          
          while (addedInBatch < batchSize && count < totalConnections && attempts < 20) {
            attempts++;
            const s = Math.floor(Math.random() * nodes.length);
            const t = Math.floor(Math.random() * nodes.length);
            
            // Check if link exists
            const exists = links.find(l => 
              (l.source === s && l.target === t) || 
              (l.target === s && l.source === t) ||
              (l.source.id === s && l.target.id === t) || 
              (l.target.id === s && l.source.id === t)
            );
            
            if (s !== t && !exists) {
              links.push({ source: nodes[s], target: nodes[t], type: 'weak', weight: 0.3, active: true });
              count++;
              addedInBatch++;
              
              // Highlight newly connected nodes
              nodes[s].signal = 1.0;
              nodes[s].signalType = 'signal';
              nodes[t].signal = 1.0;
              nodes[t].signalType = 'signal';
              
              // Fade out signal
              setTimeout(() => {
                if (nodes[s]) nodes[s].signal = Math.max(0, nodes[s].signal - 0.5);
                if (nodes[t]) nodes[t].signal = Math.max(0, nodes[t].signal - 0.5);
                if (nodes[s] && nodes[s].signal <= 0) nodes[s].signalType = null;
                if (nodes[t] && nodes[t].signal <= 0) nodes[t].signalType = null;
              }, 400);
            }
          }
          
          engine.rebuildSimulation();
          engine.getSimulation().alpha(0.3).restart();
        }, 40);
      });
    }

    if (controls['reset-connections']) {
      controls['reset-connections'].addEventListener('click', () => {
        if (deployInterval) clearInterval(deployInterval);
        buildLocalNetwork();
      });
    }
  };

  engine.init();
  return engine;
}
