import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodesAndChannels(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 45,
    chargeStrength: -50,
  });

  let nodeQuality = 0.5;
  let channelNoise = 0.4;
  let interval = null;

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    // Initial state
    nodes.forEach(n => n.quality = nodeQuality);

    engine.rebuildSimulation();

    function pulse() {
      if (!engine.isActive) return;
      
      // Calculate capacity limit based on Shannon-Hartley: C = B log2(1 + S/N)
      // Here we approximate S/N using nodeQuality and channelNoise
      const signalPower = nodeQuality;
      const noisePower = channelNoise + 0.01; // avoid /0
      const capacity = Math.log2(1 + signalPower / noisePower); // 0 to ~6.6
      
      const threshold = 1.0; // minimum capacity needed to reliably transmit

      // Source node
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      source.signal = 1;
      source.signalType = 'signal';

      // Propagate if capacity allows
      if (capacity > threshold) {
        const adj = engine.getAdjacency();
        const neighbors = adj.get(source.id) || [];
        neighbors.forEach(n => {
          if (Math.random() < 0.8) { // basic prob
            n.signal = 0.8;
            n.signalType = (Math.random() < channelNoise) ? 'noise' : 'signal';
            setTimeout(() => { if (n) n.signal = 0; }, 600);
          }
        });
      }

      setTimeout(() => { if (source) source.signal = 0; }, 400);
    }

    if (interval) clearInterval(interval);
    interval = setInterval(pulse, 1500);

    if (controls['node-quality-slider']) {
      controls['node-quality-slider'].addEventListener('input', (e) => {
        nodeQuality = parseFloat(e.target.value);
        nodes.forEach(n => n.quality = nodeQuality);
        const valSpan = e.target.parentElement.querySelector('.slider-value');
        if (valSpan) valSpan.textContent = Math.round(nodeQuality * 100) + '%';
      });
    }

    if (controls['channel-noise-slider']) {
      controls['channel-noise-slider'].addEventListener('input', (e) => {
        channelNoise = parseFloat(e.target.value);
        
        // Visual feedback: increase noise -> decrease edge opacity/weight
        links.forEach(l => {
          l.weight = Math.max(0.1, 1.0 - channelNoise);
        });

        const valSpan = e.target.parentElement.querySelector('.slider-value');
        if (valSpan) valSpan.textContent = Math.round(channelNoise * 100) + '%';
      });
    }
  };

  const origDestroy = engine.destroy;
  engine.destroy = function() {
    if (interval) clearInterval(interval);
    origDestroy();
  };

  engine.init();
  return engine;
}
