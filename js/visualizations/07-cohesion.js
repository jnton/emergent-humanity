import { createNetworkEngine } from '../lib/network-engine.js';

export function initCohesion(canvas, controls) {
  let polarization = 0;
  let bridgesActive = false;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 80,
    linkDistance: 40,
    chargeStrength: -60,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    // Assign communities
    nodes.forEach((n, i) => {
      n.community = i % 2; // Two main echo chambers
      n.isBridge = false;
    });

    function updateNetwork() {
      const sim = engine.getSimulation();

      // Custom force to separate communities
      sim.force('x', d3.forceX(d => {
        if (d.isBridge || polarization === 0) return canvas.clientWidth / 2;
        return d.community === 0 ? canvas.clientWidth * 0.3 : canvas.clientWidth * 0.7;
      }).strength(polarization * 0.2));

      // Separate them vertically a bit if we want or keep y centered
      sim.force('y', d3.forceY(canvas.clientHeight / 2).strength(0.1));

      // Links repel if they are different communities and highly polarized
      // Actually we just weaken cross-links
      links.forEach(l => {
        const sComm = typeof l.source === 'object' ? l.source.community : nodes[l.source].community;
        const tComm = typeof l.target === 'object' ? l.target.community : nodes[l.target].community;
        
        if (sComm !== tComm) {
          if (bridgesActive && (typeof l.source === 'object' ? l.source.isBridge : nodes[l.source].isBridge) || (typeof l.target === 'object' ? l.target.isBridge : nodes[l.target].isBridge)) {
             l.weight = 1.0;
             l.type = 'strong';
          } else {
             l.weight = Math.max(0.01, 1 - polarization);
             l.type = polarization > 0.5 ? 'weak' : 'default';
          }
        }
      });

      engine.rebuildSimulation();
      sim.alpha(1).restart();
    }

    if (controls['polarize-slider']) {
      controls['polarize-slider'].addEventListener('input', (e) => {
        polarization = parseFloat(e.target.value);
        bridgesActive = false; // Reset bridges when polarizing
        nodes.forEach(n => n.isBridge = false);
        updateNetwork();
      });
    }

    if (controls['deploy-bridges']) {
      controls['deploy-bridges'].addEventListener('click', () => {
        if (polarization === 0) return;
        bridgesActive = true;
        // Turn 5 random nodes into bridges
        for(let i=0; i<5; i++) {
          const n = nodes[Math.floor(Math.random() * nodes.length)];
          n.isBridge = true;
          n.community = 2; // Bridge color
          n.radius = 7;
          
          // Connect to both sides
          const side0 = nodes.find(x => x.community === 0);
          const side1 = nodes.find(x => x.community === 1);
          if (side0) links.push({ source: n, target: side0, type: 'strong', weight: 1.0, active: true });
          if (side1) links.push({ source: n, target: side1, type: 'strong', weight: 1.0, active: true });
        }
        updateNetwork();
      });
    }

    updateNetwork();
  };

  engine.init();
  return engine;
}
