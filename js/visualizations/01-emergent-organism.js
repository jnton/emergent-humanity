import { createNetworkEngine } from '../lib/network-engine.js';

export function initEmergentOrganism(canvas, controls) {
  let rippleRadius = 0;
  let rippleCenter = null;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 80,
    linkDistance: 60,
    chargeStrength: -80,
    onTick: () => {
      const nodes = engine.getNodes();
      
      // Decay signal so affected nodes glow briefly then return to normal
      for (const node of nodes) {
        if (node.signal > 0) {
          node.signal -= 0.015;
          if (node.signal < 0) node.signal = 0;
        }
      }

      if (rippleCenter) {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(rippleCenter.x, rippleCenter.y, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - rippleRadius/150)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        rippleRadius += 4;
        if (rippleRadius > 150) {
          rippleCenter = null;
        }
      }
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
  };

  // Bind controls only ONCE when the visualization is created,
  // not every time it is re-initialized by scrolling.
  if (controls['remove-node']) {
    controls['remove-node'].addEventListener('click', () => {
      const activeNodes = engine.getNodes().filter(n => n.state === 1);
      if (activeNodes.length === 0) return;
      
      // Pick a random node
      const index = Math.floor(Math.random() * activeNodes.length);
      const node = activeNodes[index];
      rippleCenter = { x: node.x, y: node.y };
      rippleRadius = 0;

      // "Flip to 0" (remove node and its links)
      const affectedIds = engine.removeNode(node);
      
      // Check if highlight toggle is on
      const highlightToggle = controls['highlight-affected'];
      if (highlightToggle && highlightToggle.checked) {
        const allNodes = engine.getNodes();
        for (const id of affectedIds) {
           if (allNodes[id]) {
             allNodes[id].signal = 1;
             allNodes[id].signalType = 'noise'; // Glow red
           }
        }
      }

      engine.rebuildSimulation();
    });
  }

  if (controls['reset-network']) {
    controls['reset-network'].addEventListener('click', () => {
      engine.reset(80);
    });
  }

  engine.init();
  return engine;
}
