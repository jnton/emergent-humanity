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
      
      if (!isIsolated) {
        // Fade in the new nodes elegantly
        for (let i = 1; i < nodes.length; i++) {
          if (nodes[i].quality < nodes[i].targetQuality) {
            nodes[i].quality += 0.002; // smooth fade in
          }
        }
      }

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
    setTimeout(() => {
      isIsolated = false;
      engine.getSimulation().force('charge').strength(-15); // Softer gravity

      // Spawn gently in a wide ring
      const targetNodes = 350;
      for (let i = 1; i < targetNodes; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * 300; // wide majestic ring
        nodes.push({
          id: i,
          state: 1,
          quality: 0, // Start invisible and fade in
          targetQuality: 0.1 + Math.random() * 0.8,
          signal: 0,
          radius: 3,
          x: canvas.clientWidth / 2 + Math.cos(angle) * dist,
          y: canvas.clientHeight / 2 + Math.sin(angle) * dist,
          community: null,
          strategy: null
        });

        // Preferential attachment
        const numEdges = 1 + Math.floor(Math.random() * 2);
        for (let e = 0; e < numEdges; e++) {
          const target = Math.floor(Math.random() * i);
          links.push({ source: nodes[i], target: nodes[target], type: 'default', weight: 1.0, active: true });
        }
      }

      engine.rebuildSimulation();
      // Very gentle, slow alpha to let them drift in gracefully
      engine.getSimulation().alpha(0.05).restart();
    }, 2500); // Wait 2.5 seconds before starting the spawn
  };

  engine.init();
  return engine;
}
