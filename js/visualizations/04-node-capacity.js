import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeCapacity(canvas, controls) {
  let isInspecting = false;
  let internalData = [];

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1, // Start with one node
    linkDistance: 60,
    chargeStrength: -50,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      if (nodes.length === 0) return;

      const centralNode = nodes[0]; // The hero node

      if (isInspecting) {
        // Draw the massive internal universe of the node
        centralNode.radius += (120 - centralNode.radius) * 0.01; // Expand VERY smoothly and elegantly

        ctx.save();
        
        // Background glow
        ctx.beginPath();
        ctx.arc(centralNode.x, centralNode.y, centralNode.radius + 30, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          centralNode.x, centralNode.y, 0,
          centralNode.x, centralNode.y, centralNode.radius + 30
        );
        gradient.addColorStop(0, 'rgba(79, 156, 247, 0.15)');
        gradient.addColorStop(1, 'rgba(79, 156, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Calculate opacity based on expansion progress
        const progress = Math.max(0, (centralNode.radius - 4) / 116);
        ctx.globalAlpha = progress;

        // Draw internal data points (DNA, memories, thoughts)
        internalData.forEach(p => {
          // Orbit mechanics
          p.angle += p.speed;
          // Scale distance based on expansion progress
          const currentDist = p.dist * progress;
          const x = centralNode.x + Math.cos(p.angle) * currentDist;
          const y = centralNode.y + Math.sin(p.angle) * currentDist;

          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Connect some internal points to simulate neural pathways/DNA strands
          if (Math.random() < 0.03) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(centralNode.x, centralNode.y);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
            ctx.stroke();
          }
        });

        ctx.restore();
      } else {
        // Normal state
        centralNode.radius += (4 - centralNode.radius) * 0.05; // Shrink smoothly
      }
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    nodes.length = 1;
    nodes[0].x = canvas.clientWidth / 2;
    nodes[0].y = canvas.clientHeight / 2;
    nodes[0].radius = 4;
    nodes[0].quality = 0.8;
    
    engine.getSimulation().force('charge').strength(-10);

    // Generate internal universe data
    internalData = [];
    const colors = ['#ffffff', '#4f9cf7', '#f74f9c', '#4ff7a9'];
    for (let i = 0; i < 200; i++) {
      internalData.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 70, // Max radius 80
        speed: (Math.random() - 0.5) * 0.05,
        size: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Automatically expand the node after 1 second to reveal its complexity
    setTimeout(() => {
      isInspecting = true;
    }, 1000);

  };

  engine.init();
  return engine;
}
