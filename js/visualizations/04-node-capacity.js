import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeCapacity(canvas, controls) {
  let internalData = [];
  let startTime = 0;
  let humanFactor = 0;
  let currentOpacity = 0;
  let particleSpread = 0;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1, // Start with one node
    linkDistance: 60,
    chargeStrength: -10,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      if (nodes.length === 0 || startTime === 0) return;

      const centralNode = nodes[0];
      const elapsed = performance.now() - startTime;
      const cycle = elapsed % 12000;
      
      let targetRadius = 4;
      let targetHumanFactor = 0;
      let opacityTarget = 0;
      let targetParticleSpread = 0;

      if (cycle < 1000) {
        // Point
        targetRadius = 4;
        targetHumanFactor = 0;
        opacityTarget = 0;
        targetParticleSpread = 0;
      } else if (cycle < 3000) {
        // Expanding circle
        targetRadius = 100;
        targetHumanFactor = 0;
        opacityTarget = 1;
        targetParticleSpread = 1;
      } else if (cycle < 5500) {
        // Morph to human
        targetRadius = 4;
        targetHumanFactor = 1;
        opacityTarget = 1;
        targetParticleSpread = 1;
      } else if (cycle < 7500) {
        // Human hold
        targetRadius = 4;
        targetHumanFactor = 1;
        opacityTarget = 1;
        targetParticleSpread = 1;
      } else if (cycle < 10000) {
        // Morph to circle
        targetRadius = 100;
        targetHumanFactor = 0;
        opacityTarget = 1;
        targetParticleSpread = 1;
      } else if (cycle < 11000) {
        // Collapse to point
        targetRadius = 4;
        targetHumanFactor = 0;
        opacityTarget = 0;
        targetParticleSpread = 0;
      } else {
        // Wait
        targetRadius = 4;
        targetHumanFactor = 0;
        opacityTarget = 0;
        targetParticleSpread = 0;
      }

      // Smooth interpolations
      centralNode.radius += (targetRadius - centralNode.radius) * 0.05;
      humanFactor += (targetHumanFactor - humanFactor) * 0.05;
      currentOpacity += (opacityTarget - currentOpacity) * 0.05;
      particleSpread += (targetParticleSpread - particleSpread) * 0.05;

      if (currentOpacity > 0.01) {
        ctx.save();
        
        // Background glow
        ctx.beginPath();
        const glowRadius = Math.max(centralNode.radius, 4) + 30;
        ctx.arc(centralNode.x, centralNode.y, glowRadius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          centralNode.x, centralNode.y, 0,
          centralNode.x, centralNode.y, glowRadius
        );
        // Fade out the blue background glow slightly when in human form
        const glowOpacity = 0.15 * currentOpacity * (1 - humanFactor * 0.8);
        gradient.addColorStop(0, `rgba(79, 156, 247, ${glowOpacity})`);
        gradient.addColorStop(1, 'rgba(79, 156, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.globalAlpha = currentOpacity;

        // Draw internal data points
        internalData.forEach(p => {
          p.angle += p.speed;
          
          const currentDist = p.dist * particleSpread;
          const circleX = Math.cos(p.angle) * currentDist;
          const circleY = Math.sin(p.angle) * currentDist;

          // For human shape, also add a little bit of breathing motion
          const hBreathX = p.hx + Math.cos(p.angle * 3) * 2;
          const hBreathY = p.hy + Math.sin(p.angle * 3) * 2;

          const targetX = circleX * (1 - humanFactor) + hBreathX * humanFactor * particleSpread;
          const targetY = circleY * (1 - humanFactor) + hBreathY * humanFactor * particleSpread;

          const x = centralNode.x + targetX;
          const y = centralNode.y + targetY;

          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          if (Math.random() < 0.03) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(centralNode.x + targetX * 0.5, centralNode.y + targetY * 0.5);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
            ctx.stroke();
          }
        });

        ctx.restore();
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
    
    startTime = performance.now();
    humanFactor = 0;
    currentOpacity = 0;
    particleSpread = 0;

    engine.getSimulation().force('charge').strength(-10);

    // Generate internal universe data
    internalData = [];
    const colors = ['#ffffff', '#4f9cf7', '#f74f9c', '#4ff7a9'];
    for (let i = 0; i < 250; i++) {
      let hx, hy;
      const part = Math.random();
      if (part < 0.15) {
        // Head
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 18;
        hx = Math.cos(a) * r;
        hy = -60 + Math.sin(a) * r;
      } else if (part < 0.5) {
        // Torso
        hx = (Math.random() - 0.5) * 40;
        hy = -25 + Math.random() * 70;
      } else if (part < 0.75) {
        // Legs
        const isLeft = Math.random() > 0.5;
        hx = (isLeft ? -15 : 15) + (Math.random() - 0.5) * 12;
        hy = 45 + Math.random() * 60;
      } else {
        // Arms
        const isLeft = Math.random() > 0.5;
        hx = (isLeft ? -35 : 35) + (Math.random() - 0.5) * 12;
        hy = -15 + Math.random() * 55;
      }

      internalData.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 90,
        speed: (Math.random() - 0.5) * 0.05,
        size: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        hx: hx,
        hy: hy
      });
    }
  };

  engine.init();
  return engine;
}
