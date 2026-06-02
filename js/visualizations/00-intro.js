import { createNetworkEngine } from '../lib/network-engine.js';

export function initIntro(canvas, controls) {
  let isIsolated = true;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1, // Start with exactly one node
    linkDistance: 40,
    chargeStrength: -20,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      if (nodes.length > 0) {
        // "You" is always nodes[0]
        const you = nodes[0];
        
        ctx.save();
        
        // Draw the "You" label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '500 14px Inter, sans-serif';
        // Position label slightly further away so it doesn't overlap
        ctx.fillText('You', you.x + 8, you.y + 4);

        ctx.restore();
      }
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    // Reset to isolated state
    isIsolated = true;
    nodes.length = 1; 
    links.length = 0;
    
    // Make "You" completely normal and insignificant
    nodes[0].x = canvas.clientWidth / 2;
    nodes[0].y = canvas.clientHeight / 2;
    nodes[0].quality = 0.5; 
    nodes[0].radius = 3; // Standard tiny size
    nodes[0].vx = 0;
    nodes[0].vy = 0;

    engine.getSimulation().force('charge').strength(-20);
    engine.rebuildSimulation();
    engine.getSimulation().alpha(1).restart();

    // Automatic transition
    let spawnInterval;
    const targetNodes = 350;

    setTimeout(() => {
      isIsolated = false;
      engine.getSimulation().force('charge').strength(-30);

      // Cascading rapid spawn for a cool visual effect
      spawnInterval = setInterval(() => {
        if (nodes.length >= targetNodes) {
          clearInterval(spawnInterval);
          return;
        }

        // Spawn 10 nodes per tick
        for (let k = 0; k < 10 && nodes.length < targetNodes; k++) {
          const newId = nodes.length;
          nodes.push({
            id: newId,
            state: 1,
            quality: 0.1 + Math.random() * 0.8, // Normal distribution
            signal: 0,
            radius: 3, // Equal size to "You"
            x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 600,
            y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 600,
            community: null,
            strategy: null
          });

          // Preferential attachment
          const numEdges = 1 + Math.floor(Math.random() * 2);
          for (let e = 0; e < numEdges; e++) {
            // Bias connections towards existing dense nodes
            const target = Math.floor(Math.random() * newId);
            links.push({ source: nodes[newId], target: nodes[target], type: 'default', weight: 1.0, active: true });
          }
        }

        engine.rebuildSimulation();
        engine.getSimulation().alpha(0.3).restart();
      }, 50); // Every 50ms add 10 nodes (takes ~1.75s to spawn all 350)
    }, 1500); // Wait 1.5 seconds before starting
  };

  engine.init();
  return engine;
}
