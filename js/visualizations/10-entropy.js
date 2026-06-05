import { createNetworkEngine } from '../lib/network-engine.js';

export function initEntropy(canvas, controls) {
  let redundancyActive = false;
  let packets = []; // { sourceId, targetId, currentId, progress: 0-1, distortion: 0-1, path: [], hopIndex: 0 }
  
  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 45,
    chargeStrength: -40,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      try {
        const nodes = engine.getNodes();
        const links = engine.getLinks();

        // Render packets
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          const currentNode = nodes.find(n => n.id === p.path[p.hopIndex]);
          const nextNode = nodes.find(n => n.id === p.path[p.hopIndex + 1]);

          if (!currentNode || !nextNode) {
             packets.splice(i, 1);
             continue;
          }

          // Move packet
          p.progress += 0.03; // speed

          // If reached next node
          if (p.progress >= 1) {
            p.hopIndex++;
            p.progress = 0;
            // Increase distortion per hop (redundancy lowers distortion slightly by "error correcting" or just being robust)
            // But we want to show entropy, so it always distorts.
            // If redundancy is active, we can say the network auto-corrects slightly, but let's just let it distort and let the user see that at least one arrives less distorted.
            p.distortion += (0.15 + Math.random() * 0.15); 
            if (p.distortion > 1) p.distortion = 1;
            
            // If reached target
            if (p.hopIndex >= p.path.length - 1) {
               const targetNode = nodes.find(n => n.id === p.path[p.path.length - 1]);
               if (targetNode) {
                  targetNode.pulse = 1;
                  targetNode.lastDistortion = p.distortion;
               }
               packets.splice(i, 1);
               continue;
            }
          }

          // Calculate interpolated position
          const x = currentNode.x + (nextNode.x - currentNode.x) * p.progress;
          const y = currentNode.y + (nextNode.y - currentNode.y) * p.progress;

          // Draw packet
          ctx.beginPath();
          
          // Jitter based on distortion
          const jitterX = (Math.random() - 0.5) * 8 * p.distortion;
          const jitterY = (Math.random() - 0.5) * 8 * p.distortion;
          
          ctx.arc(x + jitterX, y + jitterY, 4 + p.distortion * 2, 0, Math.PI * 2);
          
          // Color based on distortion: pristine = cyan, corrupted = red
          const r = Math.floor(Math.min(255, p.distortion * 255 * 2));
          const g = Math.floor(Math.max(0, 255 - p.distortion * 255));
          const b = Math.floor(Math.max(0, 255 - p.distortion * 255));
          
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
        }

        // Draw target node pulses
        nodes.forEach(n => {
           if (n.pulse > 0) {
              n.pulse -= 0.02;
              ctx.beginPath();
              ctx.arc(n.x, n.y, n.radius + (1 - n.pulse) * 30, 0, Math.PI * 2);
              
              const r = Math.floor(Math.min(255, (n.lastDistortion || 0) * 255 * 2));
              const g = Math.floor(Math.max(0, 255 - (n.lastDistortion || 0) * 255));
              const b = Math.floor(Math.max(0, 255 - (n.lastDistortion || 0) * 255));
              
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${n.pulse})`;
              ctx.lineWidth = 2;
              ctx.stroke();
           }
        });
        
      } catch (err) {
        console.error(err);
      }
    }
  });



  function findPath(startId, endId, randomize) {
     const links = engine.getLinks();
     let queue = [[startId]];
     let visited = new Set([startId]);
     
     while (queue.length > 0) {
        let path = queue.shift();
        let currentId = path[path.length - 1];
        
        if (currentId === endId) return path;
        
        let connected = links
           .filter(l => {
               const sId = typeof l.source === 'object' ? l.source.id : l.source;
               const tId = typeof l.target === 'object' ? l.target.id : l.target;
               return sId === currentId || tId === currentId;
           })
           .map(l => {
               const sId = typeof l.source === 'object' ? l.source.id : l.source;
               const tId = typeof l.target === 'object' ? l.target.id : l.target;
               return sId === currentId ? tId : sId;
           });
           
        if (randomize) connected.sort(() => Math.random() - 0.5);
           
        for (let nextId of connected) {
           if (!visited.has(nextId)) {
              visited.add(nextId);
              queue.push([...path, nextId]);
           }
        }
     }
     return [startId, endId]; 
  }

  if (controls['toggle-redundancy']) {
    controls['toggle-redundancy'].addEventListener('change', (e) => {
      redundancyActive = e.target.checked;
    });
  }

  let cachedSourceId = null;
  let cachedTargetId = null;

  if (controls['send-message']) {
    controls['send-message'].addEventListener('click', () => {
      const nodes = engine.getNodes();
      
      if (cachedSourceId === null || !nodes.find(n => n.id === cachedSourceId)) {
          let maxDist = 0;
          let sourceNode = nodes[0];
          let targetNode = nodes[nodes.length - 1];

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const dx = nodes[i].x - nodes[j].x;
              const dy = nodes[i].y - nodes[j].y;
              const dist = dx*dx + dy*dy;
              if (dist > maxDist) {
                maxDist = dist;
                sourceNode = nodes[i];
                targetNode = nodes[j];
              }
            }
          }
          cachedSourceId = sourceNode.id;
          cachedTargetId = targetNode.id;
      }
      
      const sourceNode = nodes.find(n => n.id === cachedSourceId);
      const targetNode = nodes.find(n => n.id === cachedTargetId);
      
      if (!sourceNode || !targetNode) return;
      
      const numPackets = redundancyActive ? 5 : 1;
      
      // Light up source node
      sourceNode.pulse = 1;
      sourceNode.lastDistortion = 0;
      
      for (let i=0; i<numPackets; i++) {
         setTimeout(() => {
            packets.push({
               path: findPath(sourceNode.id, targetNode.id, true), // randomize slightly to get alternate paths
               hopIndex: 0,
               progress: 0,
               distortion: 0
            });
         }, i * 150);
      }
    });
  }

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();
    
    // reset packets on re-init
    packets.length = 0;
    const nodes = engine.getNodes();
    nodes.forEach(n => {
       n.pulse = 0;
       n.lastDistortion = 0;
    });
  };

  engine.init();
  return engine;
}
