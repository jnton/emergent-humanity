import { createNetworkEngine } from '../lib/network-engine.js';

export function initCollectiveMemory(canvas, controls) {
  let ideas = [];
  let explosions = [];
  
  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 50,
    chargeStrength: -80,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      const links = engine.getLinks();

      // Render ideas
      for (let i = ideas.length - 1; i >= 0; i--) {
        const idea = ideas[i];
        
        const sourceNode = nodes.find(n => n.id === idea.currNodeId && n.state === 1);
        const targetNode = nodes.find(n => n.id === idea.nextNodeId && n.state === 1);

        if (!sourceNode || !targetNode) {
            // Node died while traversing. Rescue the idea to a random alive node.
            const aliveNodes = nodes.filter(n => n.state === 1);
            if (aliveNodes.length > 0) {
               const rescueNode = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
               idea.currNodeId = rescueNode.id;
               
               const connected = links.filter(l => 
                  (typeof l.source === 'object' ? l.source.id === rescueNode.id : l.source === rescueNode.id) ||
                  (typeof l.target === 'object' ? l.target.id === rescueNode.id : l.target === rescueNode.id)
               );
               
               if (connected.length > 0) {
                  const nextLink = connected[Math.floor(Math.random() * connected.length)];
                  const sId = typeof nextLink.source === 'object' ? nextLink.source.id : nextLink.source;
                  const tId = typeof nextLink.target === 'object' ? nextLink.target.id : nextLink.target;
                  idea.nextNodeId = sId === rescueNode.id ? tId : sId;
                  idea.progress = 0;
               } else {
                  // No connections, wait on this node
                  idea.nextNodeId = rescueNode.id;
                  idea.progress = 1;
               }
            } else {
               // No nodes left
               ideas.splice(i, 1);
            }
            continue;
        }

        idea.progress += 0.02; // speed

        if (idea.progress >= 1) {
            // Arrived at next node, light it up
            targetNode.pulse = 1;
            
            // Pick next destination
            const connected = links.filter(l => 
               (typeof l.source === 'object' ? l.source.id === targetNode.id : l.source === targetNode.id) ||
               (typeof l.target === 'object' ? l.target.id === targetNode.id : l.target === targetNode.id)
            );
            
            if (connected.length > 0) {
               const nextLink = connected[Math.floor(Math.random() * connected.length)];
               const sId = typeof nextLink.source === 'object' ? nextLink.source.id : nextLink.source;
               const tId = typeof nextLink.target === 'object' ? nextLink.target.id : nextLink.target;
               idea.currNodeId = targetNode.id;
               idea.nextNodeId = sId === targetNode.id ? tId : sId;
               idea.progress = 0;
            } else {
               idea.currNodeId = targetNode.id;
               idea.nextNodeId = targetNode.id;
               idea.progress = 1;
            }
        }

        // Draw packet
        const x = sourceNode.x + (targetNode.x - sourceNode.x) * idea.progress;
        const y = sourceNode.y + (targetNode.y - sourceNode.y) * idea.progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb86c'; // orange idea
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffb86c';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw node pulses
      nodes.forEach(n => {
         if (n.pulse > 0) {
            n.pulse -= 0.03;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius + (1 - n.pulse) * 15, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 184, 108, ${n.pulse})`;
            ctx.lineWidth = 2;
            ctx.stroke();
         }
      });
      // Draw originators (alive and dead)
      const now = Date.now();
      nodes.forEach(n => {
         if (n.isOriginator) {
            if (n.state === 1) {
                // Alive originator
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius + 5 + Math.sin(now * 0.005) * 2, 0, Math.PI * 2);
                ctx.strokeStyle = '#ffb86c';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([3, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            } else {
                // Dead originator (husk)
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(100, 116, 139, 0.8)'; // slate-500
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                // Draw X
                ctx.beginPath();
                ctx.moveTo(n.x - n.radius*0.7, n.y - n.radius*0.7);
                ctx.lineTo(n.x + n.radius*0.7, n.y + n.radius*0.7);
                ctx.moveTo(n.x + n.radius*0.7, n.y - n.radius*0.7);
                ctx.lineTo(n.x - n.radius*0.7, n.y + n.radius*0.7);
                ctx.stroke();
            }
         }
      });

      // Draw explosions
      for (let i = explosions.length - 1; i >= 0; i--) {
         const ex = explosions[i];
         ex.radius += 1.5;
         ex.alpha -= 0.04;
         if (ex.alpha <= 0) {
            explosions.splice(i, 1);
            continue;
         }
         ctx.beginPath();
         ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
         ctx.fillStyle = ex.isOriginator ? `rgba(255, 184, 108, ${ex.alpha * 0.3})` : `rgba(239, 68, 68, ${ex.alpha * 0.3})`;
         ctx.fill();
         ctx.strokeStyle = ex.isOriginator ? `rgba(255, 184, 108, ${ex.alpha})` : `rgba(239, 68, 68, ${ex.alpha})`;
         ctx.lineWidth = 2;
         ctx.stroke();
      }
    }
  });

  const originalRemove = engine.removeNode.bind(engine);
  engine.removeNode = function(node) {
    explosions.push({ x: node.x, y: node.y, radius: node.radius, alpha: 1, isOriginator: node.isOriginator });
    originalRemove(node);
  };

  // Make clicking nodes remove them
  canvas.addEventListener('click', (e) => {
    const nodes = engine.getNodes();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedNode = nodes.find(n => n.state === 1 && Math.hypot(n.x - x, n.y - y) < n.radius + 5);
    if (clickedNode) {
      engine.removeNode(clickedNode);
      engine.rebuildSimulation();
    }
  });

  if (controls['spawn-idea']) {
    controls['spawn-idea'].addEventListener('click', () => {
      const nodes = engine.getNodes();
      const links = engine.getLinks();
      const aliveNodes = nodes.filter(n => n.state === 1);
      if (aliveNodes.length === 0) return;
      
      const sourceNode = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
      sourceNode.pulse = 1;
      sourceNode.isOriginator = true;
      
      const connected = links.filter(l => 
          (typeof l.source === 'object' ? l.source.id === sourceNode.id : l.source === sourceNode.id) ||
          (typeof l.target === 'object' ? l.target.id === sourceNode.id : l.target === sourceNode.id)
      );
      
      let targetId = sourceNode.id;
      if (connected.length > 0) {
          const nextLink = connected[Math.floor(Math.random() * connected.length)];
          const sId = typeof nextLink.source === 'object' ? nextLink.source.id : nextLink.source;
          const tId = typeof nextLink.target === 'object' ? nextLink.target.id : nextLink.target;
          targetId = sId === sourceNode.id ? tId : sId;
      }

      ideas.push({
         currNodeId: sourceNode.id,
         nextNodeId: targetId,
         progress: 0
      });
    });
  }

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    ideas = [];
    explosions = [];
  };

  engine.init();
  return engine;
}
