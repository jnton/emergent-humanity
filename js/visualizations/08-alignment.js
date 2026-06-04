import { createNetworkEngine } from '../lib/network-engine.js';

export function initAlignment(canvas, controls) {
  let isAligned = false;
  let targetAngle = 0;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 45,
    chargeStrength: -50,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      // Gradually change target angle over time for a wandering effect when aligned
      if (isAligned) {
        targetAngle += 0.01;
      }

      ctx.save();
      nodes.forEach((n, i) => {
        // Give each node a desired angle
        if (!n.currentAngle) n.currentAngle = Math.random() * Math.PI * 2;
        
        let desiredAngle = isAligned ? targetAngle : n.currentAngle + (Math.random() - 0.5) * 0.5;
        
        // Smooth rotation
        const diff = Math.atan2(Math.sin(desiredAngle - n.currentAngle), Math.cos(desiredAngle - n.currentAngle));
        n.currentAngle += diff * 0.05;

        // Apply a small physical force in that direction so the graph actually moves
        n.vx += Math.cos(n.currentAngle) * 0.3;
        n.vy += Math.sin(n.currentAngle) * 0.3;

        // Draw arrow indicator
        ctx.beginPath();
        const arrowLength = 12;
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n.x + Math.cos(n.currentAngle) * arrowLength, n.y + Math.sin(n.currentAngle) * arrowLength);
        ctx.strokeStyle = isAligned ? 'rgba(79, 156, 247, 0.8)' : 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.restore();
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    
    // Decrease centering force so the group can actually wander around
    const sim = engine.getSimulation();
    sim.force('center', d3.forceCenter(canvas.clientWidth / 2, canvas.clientHeight / 2).strength(0.01));

    if (controls['align-goals']) {
      controls['align-goals'].addEventListener('click', () => {
        isAligned = true;
        engine.getSimulation().alpha(0.5).restart();
      });
    }

    if (controls['scramble-goals']) {
      controls['scramble-goals'].addEventListener('click', () => {
        isAligned = false;
        engine.getSimulation().alpha(0.5).restart();
      });
    }
  };

  engine.init();
  return engine;
}
