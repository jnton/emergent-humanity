import { createNetworkEngine } from '../lib/network-engine.js';

export function initStructuralHoles(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 41,
    linkDistance: 40,
    chargeStrength: -60,
  });

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    nodes.length = 0;
    links.length = 0;

    // Broker node
    nodes.push({
      id: 0,
      state: 1,
      quality: 1.0,
      signal: 0,
      radius: 8,
      community: 3, // different color
      isBroker: true,
      x: canvas.clientWidth / 2,
      y: canvas.clientHeight / 2,
    });

    // 2 Communities of 20 nodes each
    const commSize = 20;
    for (let c = 0; c < 2; c++) {
      const offset = 1 + c * commSize;
      for (let i = 0; i < commSize; i++) {
        nodes.push({
          id: offset + i,
          state: 1,
          quality: 0.5,
          radius: 4 + Math.random() * 2,
          community: c,
          x: canvas.clientWidth / 2 + (c === 0 ? -100 : 100) + (Math.random() - 0.5) * 50,
          y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 100,
        });
      }

      // Internal community links
      for (let i = 0; i < commSize; i++) {
        for (let j = 0; j < 2; j++) {
          const target = Math.floor(Math.random() * commSize);
          if (i !== target) {
            links.push({
              source: offset + i,
              target: offset + target,
              type: 'default',
              weight: 1.0,
              active: true
            });
          }
        }
      }

      // Connect 1 random node from each community to broker
      const bridgeNode = offset + Math.floor(Math.random() * commSize);
      links.push({
        source: 0,
        target: bridgeNode,
        type: 'bridge',
        weight: 1.0,
        active: true
      });
    }

    engine.rebuildSimulation();

    // Pulse information from broker
    setInterval(() => {
      if (!engine.isActive) return;
      nodes[0].signal = 1;
      nodes[0].signalType = 'signal';
      
      const bridgeLinks = links.filter(l => l.type === 'bridge' && l.active);
      bridgeLinks.forEach(l => {
        const t = typeof l.target === 'object' ? l.target : nodes[l.target];
        const s = typeof l.source === 'object' ? l.source : nodes[l.source];
        const other = t.id === 0 ? s : t;
        if(other) {
           other.signal = 0.8;
           other.signalType = 'signal';
           setTimeout(() => { if(other) other.signal = 0; }, 500);
        }
      });
      setTimeout(() => { if(nodes[0]) nodes[0].signal = 0; }, 300);
    }, 2000);

    if (controls['remove-broker']) {
      controls['remove-broker'].addEventListener('click', () => {
        engine.removeNode(nodes[0]);
        // Also deactivate bridge links
        links.forEach(l => {
            if(l.source.id === 0 || l.target.id === 0) l.active = false;
        });
        engine.getSimulation().force('link').links(links.filter(l => l.active));
        engine.getSimulation().alpha(0.5).restart();
      });
    }
    
    if (controls['rewire-random']) {
      controls['rewire-random'].addEventListener('click', () => {
        // Create direct links between the two communities to close the hole
        for(let i=0; i<3; i++) {
            const n1 = 1 + Math.floor(Math.random() * commSize);
            const n2 = 1 + commSize + Math.floor(Math.random() * commSize);
            links.push({
                source: n1, target: n2, type: 'default', weight: 1.0, active: true
            });
        }
        engine.rebuildSimulation();
      });
    }
  };

  engine.init();
  return engine;
}
