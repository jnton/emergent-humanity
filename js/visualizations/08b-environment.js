import { createNetworkEngine } from '../lib/network-engine.js';

export function initEnvironment(canvas, controls) {
  let particles = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 40,
    chargeStrength: -30,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Check collision with nodes
        let absorbed = false;
        for (let j = 0; j < nodes.length; j++) {
           const n = nodes[j];
           if (n.state === 1) {
              const dx = n.x - p.x;
              const dy = n.y - p.y;
              const dist = Math.hypot(dx, dy);
              if (dist < n.radius + 15) {
                 // Absorb
                 n.infoColor = p.color;
                 n.pulse = 1;
                 absorbed = true;
                 break;
              }
           }
        }

        if (absorbed) {
           particles.splice(i, 1);
           continue;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + Math.sin(Date.now() * 0.01 + p.x) * 1, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw node info cores
      nodes.forEach(n => {
        if (n.infoColor && n.state === 1) {
           ctx.beginPath();
           ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
           ctx.fillStyle = n.infoColor;
           ctx.fill();
        }
        if (n.pulse > 0) {
           n.pulse -= 0.05;
           ctx.beginPath();
           ctx.arc(n.x, n.y, n.radius + (1 - n.pulse) * 10, 0, Math.PI * 2);
           ctx.strokeStyle = n.infoColor || 'white';
           ctx.lineWidth = 2 * n.pulse;
           ctx.stroke();
        }
      });
    }
  });

  if (controls['release-info']) {
    controls['release-info'].addEventListener('click', () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      for (let i = 0; i < 10; i++) {
         const edge = Math.floor(Math.random() * 4);
         let x, y, vx, vy;
         const speed = 1 + Math.random() * 1.5;

         if (edge === 0) { x = Math.random() * width; y = 0; vx = (Math.random() - 0.5) * speed; vy = speed; }
         else if (edge === 1) { x = width; y = Math.random() * height; vx = -speed; vy = (Math.random() - 0.5) * speed; }
         else if (edge === 2) { x = Math.random() * width; y = height; vx = (Math.random() - 0.5) * speed; vy = -speed; }
         else { x = 0; y = Math.random() * height; vx = speed; vy = (Math.random() - 0.5) * speed; }

         particles.push({
           x, y, vx, vy,
           color: colors[Math.floor(Math.random() * colors.length)]
         });
      }
    });
  }

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    particles = [];
    engine.getNodes().forEach(n => {
       n.infoColor = null;
       n.pulse = 0;
    });
  };

  engine.init();
  return engine;
}
