import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeLimits(canvas, controls) {
  let isOptimizing = false;
  let optimizationLevel = 0; // 0 to 1

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1, // Strictly ONE node to match the narrative
    linkDistance: 60,
    chargeStrength: -50,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      if (nodes.length === 0) return;

      const centralNode = nodes[0];

      if (isOptimizing) {
        // Increase optimization level up to a hard cap
        optimizationLevel = Math.min(1.0, optimizationLevel + 0.01);
      } else {
        // Degrade back to baseline
        optimizationLevel = Math.max(0.0, optimizationLevel - 0.02);
      }

      // Base radius is 4. Max radius is 15.
      centralNode.radius = 4 + (11 * optimizationLevel);
      centralNode.quality = 0.2 + (0.8 * optimizationLevel);

      // Draw the "Genetic Limit" bounding box / cage
      ctx.save();
      ctx.beginPath();
      ctx.arc(centralNode.x, centralNode.y, 25, 0, Math.PI * 2);
      
      if (optimizationLevel >= 1.0) {
        // Limit reached: cage glows red/orange to signify a hard physical constraint
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Slight vibration when hitting the cap
        centralNode.x += (Math.random() - 0.5) * 1.5;
        centralNode.y += (Math.random() - 0.5) * 1.5;

        // Draw text "GENETIC LIMIT REACHED"
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GENETIC LIMIT REACHED', centralNode.x, centralNode.y - 35);
      } else {
        // Cage is faint and blue
        ctx.strokeStyle = 'rgba(79, 156, 247, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
      }
      ctx.stroke();
      ctx.restore();
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
    nodes[0].quality = 0.2;
    
    optimizationLevel = 0;
    isOptimizing = false;

    // Automatically trigger optimization animation after 1.5 seconds
    setTimeout(() => {
      isOptimizing = true;
    }, 1500);

    if (controls['optimize-nodes']) {
      // Allow manual toggle to pause/resume
      controls['optimize-nodes'].addEventListener('mousedown', () => isOptimizing = true);
      controls['optimize-nodes'].addEventListener('mouseup', () => isOptimizing = false);
      controls['optimize-nodes'].addEventListener('mouseleave', () => isOptimizing = false);
      
      // Touch support
      controls['optimize-nodes'].addEventListener('touchstart', (e) => { e.preventDefault(); isOptimizing = true; });
      controls['optimize-nodes'].addEventListener('touchend', (e) => { e.preventDefault(); isOptimizing = false; });
      
      controls['optimize-nodes'].textContent = 'Hold to Optimize';
    }

    if (controls['reset-limits']) {
      controls['reset-limits'].addEventListener('click', () => {
        isOptimizing = false;
        optimizationLevel = 0;
      });
    }

  };

  engine.init();
  return engine;
}
