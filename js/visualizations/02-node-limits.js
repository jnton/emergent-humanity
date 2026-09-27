import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeLimits(canvas, controls) {
  let isOptimizing = false;
  let optimizationLevel = 0; // An illustrative scalar, not measured human potential.
  const stats = canvas.closest('.section').querySelector('.viz-stats');

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
      }
      if(stats)stats.textContent=optimizationLevel>=1?'Better conditions helped. This model still has a limit.':isOptimizing?'The conditions are improving. Watch what changes.':'Start with the same person. Change their conditions.';
      if(optimizationLevel>=1&&controls['optimize-nodes'])controls['optimize-nodes'].textContent='Conditions improved';

      // Base radius is 4. Max radius is 15.
      centralNode.radius = 4 + (11 * optimizationLevel);
      centralNode.quality = 0.2 + (0.8 * optimizationLevel);

      // Draw the current biological performance envelope
      ctx.save();
      ctx.beginPath();
      ctx.arc(centralNode.x, centralNode.y, 25, 0, Math.PI * 2);
      
      if (optimizationLevel >= 1.0) {
        // Envelope reached: the toy scalar cannot increase further
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Slight vibration when hitting the cap
        centralNode.x += (Math.random() - 0.5) * 1.5;
        centralNode.y += (Math.random() - 0.5) * 1.5;

        // Draw the boundary label
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ILLUSTRATIVE CEILING', centralNode.x, centralNode.y - 35);
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

    if(controls['optimize-nodes']){controls['optimize-nodes'].disabled=false;controls['optimize-nodes'].textContent='Improve conditions';}

  };

  controls['optimize-nodes']?.addEventListener('click',()=>{isOptimizing=true;controls['optimize-nodes'].disabled=true;if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motionPaused==='true')optimizationLevel=1;});
  controls['reset-limits']?.addEventListener('click',()=>{isOptimizing=false;optimizationLevel=0;controls['optimize-nodes'].disabled=false;controls['optimize-nodes'].textContent='Improve conditions';});
  engine.init();
  return engine;
}
