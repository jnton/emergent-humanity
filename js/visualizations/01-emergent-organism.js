import { createNetworkEngine } from '../lib/network-engine.js';

export function initEmergentOrganism(canvas, controls) {
  let rippleRadius = 0;
  let rippleCenter = null;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 80,
    linkDistance: 60,
    chargeStrength: -80,
    onTick: () => {
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

    if (controls['remove-node']) {
      controls['remove-node'].addEventListener('click', () => {
        const nodes = engine.getNodes().filter(n => n.state === 1);
        if (nodes.length === 0) return;
        
        // Pick a random node
        const index = Math.floor(Math.random() * nodes.length);
        const node = nodes[index];
        rippleCenter = { x: node.x, y: node.y };
        rippleRadius = 0;

        // "Flip to 0" (remove node and its links)
        engine.removeNode(node);
        engine.rebuildSimulation();
      });
    }

    if (controls['reset-network']) {
      controls['reset-network'].addEventListener('click', () => {
        engine.reset(80);
      });
    }
  };

  engine.init();
  return engine;
}
