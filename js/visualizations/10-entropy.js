import { createNetworkEngine } from '../lib/network-engine.js';

export function initEntropy(canvas, controls) {
  let entropyActive = false;
  let entropyInterval;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 100,
    linkDistance: 40,
    chargeStrength: -30,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      // Optional: draw some visual indicator of entropy (like static or decay particles)
      if (entropyActive) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.05})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    function setupPerfectOrganism() {
      // Create a highly connected, perfect organism
      nodes.length = 0;
      links.length = 0;

      for (let i = 0; i < 100; i++) {
        nodes.push({
          id: i,
          state: 1,
          quality: 1.0, // High quality
          signal: 0,
          radius: 4,
          x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 400,
          y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 400,
          community: null,
          strategy: null
        });
      }

      // Strong, redundant connections
      for (let i = 0; i < nodes.length; i++) {
        const edges = 3 + Math.floor(Math.random() * 3); // 3-5 edges per node
        for (let e = 0; e < edges; e++) {
          const target = Math.floor(Math.random() * nodes.length);
          if (target !== i) {
            links.push({ source: nodes[i], target: nodes[target], type: 'default', weight: 1.0, active: true });
          }
        }
      }

      engine.rebuildSimulation();
      engine.getSimulation().alpha(1).restart();
    }

    setupPerfectOrganism();

    // Entropy Loop
    function applyEntropy() {
      if (!entropyActive) return;

      let changed = false;

      // 1. Degrade Nodes (Quality decreases, they dim)
      nodes.forEach(node => {
        if (Math.random() < 0.1) { // 10% chance per tick to degrade
          node.quality = Math.max(0.1, node.quality - 0.1);
        }
      });

      // 2. Fray Edges (Links randomly break)
      if (Math.random() < 0.3 && links.length > 0) { // 30% chance per tick to lose a link
        const linkIndex = Math.floor(Math.random() * links.length);
        links.splice(linkIndex, 1);
        changed = true;
      }

      // 3. Node Death (Rarely, a node drops to 0 and dies)
      if (Math.random() < 0.05 && nodes.length > 10) { // 5% chance per tick
        const nodeIndex = Math.floor(Math.random() * nodes.length);
        nodes.splice(nodeIndex, 1);
        
        // Remove associated links
        for (let i = links.length - 1; i >= 0; i--) {
          if (links[i].source.id === nodeIndex || links[i].target.id === nodeIndex) {
            links.splice(i, 1);
          }
        }
        changed = true;
      }

      if (changed) {
        engine.rebuildSimulation();
        engine.getSimulation().alpha(0.1).restart();
      }
    }

    // Controls
    if (controls['toggle-entropy']) {
      controls['toggle-entropy'].addEventListener('change', (e) => {
        entropyActive = e.target.checked;
        if (entropyActive) {
          entropyInterval = setInterval(applyEntropy, 200); // Fast entropy
        } else {
          clearInterval(entropyInterval);
        }
      });
    }

    if (controls['inject-energy']) {
      controls['inject-energy'].addEventListener('click', () => {
        // Inject Energy: Heal nodes, rebuild lost edges
        nodes.forEach(node => {
          node.quality = Math.min(1.0, node.quality + 0.5); // Boost quality
        });

        // Add back some nodes if we lost them
        while (nodes.length < 100) {
          const newId = nodes.length;
          nodes.push({
            id: newId,
            state: 1,
            quality: 1.0,
            signal: 0,
            radius: 4,
            x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 200,
            y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 200,
            community: null,
            strategy: null
          });
        }

        // Rebuild edges randomly to connect the graph
        for (let i = 0; i < 20; i++) { // Add 20 random edges
          const s = Math.floor(Math.random() * nodes.length);
          const t = Math.floor(Math.random() * nodes.length);
          if (s !== t) {
            links.push({ source: nodes[s], target: nodes[t], type: 'default', weight: 1.0, active: true });
          }
        }

        // Visual flash of energy
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(79, 156, 247, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        engine.rebuildSimulation();
        engine.getSimulation().alpha(0.8).restart();
      });
    }

  };

  engine.init();
  return engine;
}
