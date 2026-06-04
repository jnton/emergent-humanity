import { createNetworkEngine } from '../lib/network-engine.js';

export function initProductivity(canvas, controls) {
  let optimized = false;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 40,
    chargeStrength: -50,
    onTick: () => {
      if (optimized) {
        const ctx = canvas.getContext('2d');
        const links = engine.getLinks();
        const nodes = engine.getNodes();
        // Randomly draw "knowledge sparks" traveling along links
        links.forEach(l => {
          if (Math.random() > 0.95) { // 5% chance per frame per link to spark
            const s = typeof l.source === 'object' ? l.source : nodes[l.source];
            const t = typeof l.target === 'object' ? l.target : nodes[l.target];
            
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = `rgba(79, 156, 247, ${Math.random()})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Spark node
            s.signal = 1.0;
            t.signal = 1.0;
          }
        });
      }
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    function setBaseline() {
      optimized = false;
      nodes.length = 0;
      links.length = 0;
      
      // Start with a small, weak network
      for (let i = 0; i < 30; i++) {
        nodes.push({ id: i, state: 1, quality: 0.4, signal: 0, radius: 4, degree: 0 });
      }
      for (let i = 0; i < 30; i++) {
        const target = Math.floor(Math.random() * 30);
        if (i !== target) {
          links.push({ source: i, target: target, type: 'default', weight: 0.5 });
          nodes[i].degree++;
          nodes[target].degree++;
        }
      }
      
      engine.updateConfig?.({ chargeStrength: -50, linkDistance: 40 });
      engine.rebuildSimulation();
      engine.getSimulation().alpha(1).restart();
    }

    function setOptimized() {
      optimized = true;
      // Massive explosion of nodes
      for (let i = nodes.length; i < 200; i++) {
        nodes.push({ 
          id: i, state: 1, quality: 1.0, signal: 1.0, radius: 6, degree: 0,
          x: canvas.clientWidth/2 + (Math.random()-0.5)*10,
          y: canvas.clientHeight/2 + (Math.random()-0.5)*10
        });
      }
      // Hyper-dense connections
      for (let i = 0; i < 200; i++) {
        for (let j = 0; j < 3; j++) {
          const target = Math.floor(Math.random() * 200);
          if (i !== target) {
            links.push({ source: nodes[i], target: nodes[target], type: 'strong', weight: 1.0 });
          }
        }
        nodes[i].quality = 1.0;
        nodes[i].radius = 6;
      }
      
      // Tight, boiling core
      const sim = engine.getSimulation();
      sim.force('charge').strength(-30);
      sim.force('link').distance(20);
      engine.rebuildSimulation();
      sim.alphaTarget(0.3).restart(); // Keep it boiling indefinitely
    }

    setBaseline();

    if (controls['optimize-all']) {
      controls['optimize-all'].addEventListener('click', setOptimized);
    }
    
    if (controls['reset-productivity']) {
      controls['reset-productivity'].addEventListener('click', setBaseline);
    }
  };

  engine.init();
  return engine;
}
