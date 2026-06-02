import { createNetworkEngine } from '../lib/network-engine.js';

export function initDunbar(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 45,
    chargeStrength: -60,
  });

  const cognitiveLimit = 4; // visual scaled-down Dunbar number

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    function buildInitialNetwork() {
      nodes.length = 0;
      links.length = 0;

      // 60 nodes
      for (let i = 0; i < 60; i++) {
        nodes.push({
          id: i, state: 1, quality: 1.0, signal: 0,
          radius: 5, community: null, degree: 0,
          x: canvas.clientWidth/2 + (Math.random()-0.5)*200,
          y: canvas.clientHeight/2 + (Math.random()-0.5)*200
        });
      }

      // Small number of tight local clusters (tribes)
      const tribeSize = 10;
      const numTribes = 6;
      for (let t = 0; t < numTribes; t++) {
        const offset = t * tribeSize;
        for (let i = 0; i < tribeSize; i++) {
          // Connect to 2-3 others in the same tribe
          const numEdges = 2 + Math.floor(Math.random() * 2);
          for (let e = 0; e < numEdges; e++) {
            const target = offset + Math.floor(Math.random() * tribeSize);
            if (offset + i !== target && !links.find(l => (l.source === offset+i && l.target === target) || (l.target === offset+i && l.source === target))) {
              links.push({
                source: offset + i, target: target, type: 'strong', weight: 1.0, active: true
              });
              nodes[offset + i].degree++;
              nodes[target].degree++;
            }
          }
        }
      }

      // A few weak ties between tribes
      for (let i = 0; i < numTribes; i++) {
        const n1 = i * tribeSize + Math.floor(Math.random() * tribeSize);
        const nextTribe = (i + 1) % numTribes;
        const n2 = nextTribe * tribeSize + Math.floor(Math.random() * tribeSize);
        links.push({ source: n1, target: n2, type: 'weak', weight: 1.0, active: true });
        nodes[n1].degree++;
        nodes[n2].degree++;
      }

      updateBandwidths();
      engine.rebuildSimulation();
    }

    function updateBandwidths() {
      // Recalculate degrees just to be safe
      nodes.forEach(n => n.degree = 0);
      links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source : nodes[l.source];
        const t = typeof l.target === 'object' ? l.target : nodes[l.target];
        if (s && t) {
          s.degree++;
          t.degree++;
        }
      });

      // Node quality drops if degree exceeds cognitiveLimit
      nodes.forEach(n => {
        if (n.degree <= cognitiveLimit) {
          n.quality = 1.0;
        } else {
          // Sharp exponential decay
          n.quality = Math.max(0.15, Math.pow(0.7, n.degree - cognitiveLimit));
        }
      });

      // Link weight is bottlenecked by the lowest quality node
      links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source : nodes[l.source];
        const t = typeof l.target === 'object' ? l.target : nodes[l.target];
        if (s && t) {
          const bottleneck = Math.min(s.quality, t.quality);
          l.weight = bottleneck;
          // visually degrade type
          if (bottleneck < 0.5) {
            l.type = 'weak';
          }
        }
      });
    }

    buildInitialNetwork();

    if (controls['add-friends']) {
      controls['add-friends'].addEventListener('click', () => {
        // Add 30 random connections across the whole network
        for (let i = 0; i < 30; i++) {
          const n1 = nodes[Math.floor(Math.random() * nodes.length)];
          const n2 = nodes[Math.floor(Math.random() * nodes.length)];
          if (n1.id !== n2.id && !links.find(l => (l.source.id === n1.id && l.target.id === n2.id) || (l.target.id === n1.id && l.source.id === n2.id))) {
            links.push({ source: n1, target: n2, type: 'default', weight: 1.0, active: true });
          }
        }
        updateBandwidths();
        engine.rebuildSimulation();
      });
    }

    if (controls['reset-dunbar']) {
      controls['reset-dunbar'].addEventListener('click', buildInitialNetwork);
    }
  };

  engine.init();
  return engine;
}
