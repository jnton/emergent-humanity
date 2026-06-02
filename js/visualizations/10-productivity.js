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
      nodes.forEach(n => {
        n.quality = 0.4;
        n.radius = 4;
        n.state = 1; // 1 = alive/baseline
      });
      links.forEach(l => {
        l.weight = 0.5;
        l.type = 'default';
      });
      engine.rebuildSimulation();
      engine.getSimulation().alpha(1).restart();
    }

    function setOptimized() {
      optimized = true;
      nodes.forEach(n => {
        n.quality = 1.0;
        n.radius = 6;
        n.state = 1; 
      });
      links.forEach(l => {
        l.weight = 1.0;
        l.type = 'strong';
      });
      engine.rebuildSimulation();
      engine.getSimulation().alpha(1).restart();
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
