import { createNetworkEngine } from '../lib/network-engine.js';

export function initEmergentOrganism(canvas, controls) {
  let rippleRadius = 0;
  let rippleCenter = null;
  const mobile = canvas.clientWidth <= 900;
  const nodeCount = mobile ? 60 : 80;

  const engine = createNetworkEngine(canvas, {
    nodeCount,
    linkDistance: mobile ? 36 : 60,
    chargeStrength: mobile ? -44 : -80,
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
        const maximumRipple = mobile ? 110 : 150;
        ctx.beginPath();
        ctx.arc(rippleCenter.x, rippleCenter.y, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - rippleRadius / maximumRipple)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        rippleRadius += mobile ? 3 : 4;
        if (rippleRadius > maximumRipple) rippleCenter = null;
      }
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  };

  // Bind controls only once when the visualization is created.
  if (controls['remove-node']) {
    controls['remove-node'].addEventListener('click', () => {
      const activeNodes = engine.getNodes().filter((node) => node.state === 1);
      if (activeNodes.length === 0) return;

      const index = Math.floor(Math.random() * activeNodes.length);
      const node = activeNodes[index];
      rippleCenter = { x: node.x, y: node.y };
      rippleRadius = 0;

      const affectedIds = engine.removeNode(node);

      const highlightToggle = controls['highlight-affected'];
      if (highlightToggle?.checked) {
        const allNodes = engine.getNodes();
        for (const id of affectedIds) {
          if (allNodes[id]) {
            allNodes[id].signal = 1;
            allNodes[id].signalType = 'noise';
          }
        }
      }

      engine.rebuildSimulation();
      const simulation = engine.getSimulation();
      simulation.force('charge').strength(mobile ? -44 : -80);
      simulation.force('link').distance(mobile ? 36 : 60);
      canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
    });
  }

  if (controls['reset-network']) {
    controls['reset-network'].addEventListener('click', () => {
      engine.reset(nodeCount);
      const simulation = engine.getSimulation();
      simulation.force('charge').strength(mobile ? -44 : -80);
      simulation.force('link').distance(mobile ? 36 : 60);
      canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
    });
  }

  engine.init();
  return engine;
}
