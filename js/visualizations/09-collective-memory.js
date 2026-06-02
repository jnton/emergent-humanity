import { createNetworkEngine } from '../lib/network-engine.js';

export function initCollectiveMemory(canvas, controls) {
  const ghostLines = [];
  
  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 50,
    chargeStrength: -80,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      // Draw ghost memory lattice in the background
      ctx.save();
      ctx.lineWidth = 1.5;
      for (const gl of ghostLines) {
        ctx.beginPath();
        ctx.moveTo(gl.x1, gl.y1);
        ctx.lineTo(gl.x2, gl.y2);
        // Dim white/blue ghostly lines
        ctx.strokeStyle = `rgba(100, 200, 255, ${gl.alpha})`;
        ctx.stroke();
      }
      ctx.restore();
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    // Whenever a node is removed, preserve its links as ghost memory
    const originalRemove = engine.removeNode.bind(engine);
    engine.removeNode = function(node) {
      // Find all links connected to this node
      const connectedLinks = links.filter(l => 
        (typeof l.source === 'object' ? l.source.id === node.id : l.source === node.id) ||
        (typeof l.target === 'object' ? l.target.id === node.id : l.target === node.id)
      );

      // Save their exact positions
      connectedLinks.forEach(l => {
        const s = typeof l.source === 'object' ? l.source : nodes[l.source];
        const t = typeof l.target === 'object' ? l.target : nodes[l.target];
        if (s && t) {
          ghostLines.push({
            x1: s.x, y1: s.y,
            x2: t.x, y2: t.y,
            alpha: 0.3
          });
        }
      });

      // Call original remove
      originalRemove(node);
    };

    // Make clicking nodes remove them so you can see memory form
    const defaultClick = canvas.onclick;
    // Overriding click might conflict with drag, but we'll do our own
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find clicked node
      const clickedNode = nodes.find(n => n.state === 1 && Math.hypot(n.x - x, n.y - y) < n.radius + 5);
      if (clickedNode) {
        engine.removeNode(clickedNode);
        engine.rebuildSimulation();
      }
    });

    if (controls['accelerate-learning']) {
      controls['accelerate-learning'].addEventListener('click', () => {
        // Randomly thicken the active links, cementing them into memory
        links.forEach(l => {
          if (Math.random() > 0.7) {
            const s = typeof l.source === 'object' ? l.source : nodes[l.source];
            const t = typeof l.target === 'object' ? l.target : nodes[l.target];
            if (s && t) {
              ghostLines.push({
                x1: s.x, y1: s.y,
                x2: t.x, y2: t.y,
                alpha: 0.1 // very dim overlapping layers
              });
            }
          }
        });
      });
    }

    if (controls['clear-memory']) {
      controls['clear-memory'].addEventListener('click', () => {
        ghostLines.length = 0;
      });
    }
  };

  engine.init();
  return engine;
}
