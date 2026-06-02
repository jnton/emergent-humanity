import { createNetworkEngine } from '../lib/network-engine.js';

export function initEchoChambers(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 40,
    chargeStrength: -50,
  });

  let homophily = 0.2;
  let rewiringInterval = null;

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    nodes.length = 0;
    links.length = 0;

    // Create 2 communities evenly mixed initially
    for (let i = 0; i < 60; i++) {
      nodes.push({
        id: i, state: 1, quality: 0.5, signal: 0,
        radius: 4, 
        community: i % 2, // 0 or 1
        x: canvas.clientWidth/2 + (Math.random()-0.5)*150,
        y: canvas.clientHeight/2 + (Math.random()-0.5)*150
      });
    }

    // Connect randomly
    for (let i = 0; i < 60; i++) {
      for (let j = 0; j < 2; j++) {
        const target = Math.floor(Math.random() * 60);
        if (i !== target) {
          links.push({
            source: i, target: target,
            type: 'default', weight: 1.0, active: true
          });
        }
      }
    }

    engine.rebuildSimulation();

    function rewire() {
      if (!engine.isActive) return;
      if (homophily < 0.1) return; // not enough force

      let changed = false;
      const linksToRemove = [];
      const linksToAdd = [];

      // Probabilistically break links between different communities
      for (let i = 0; i < links.length; i++) {
        const l = links[i];
        const s = typeof l.source === 'object' ? l.source : nodes[l.source];
        const t = typeof l.target === 'object' ? l.target : nodes[l.target];
        
        if (s.community !== t.community) {
          if (Math.random() < homophily * 0.1) {
            linksToRemove.push(i);
            
            // Rewire to someone in same community
            const sameCommNodes = nodes.filter(n => n.community === s.community && n.id !== s.id);
            if (sameCommNodes.length > 0) {
              const newTarget = sameCommNodes[Math.floor(Math.random() * sameCommNodes.length)];
              linksToAdd.push({ source: s, target: newTarget, type: 'default', weight: 1.0, active: true });
              changed = true;
            }
          }
        }
      }

      if (changed) {
        // Remove links in reverse order
        for (let i = linksToRemove.length - 1; i >= 0; i--) {
          links.splice(linksToRemove[i], 1);
        }
        links.push(...linksToAdd);
        engine.getSimulation().force('link').links(links);
        engine.getSimulation().alpha(0.3).restart();
      }
    }

    if (rewiringInterval) clearInterval(rewiringInterval);
    rewiringInterval = setInterval(rewire, 500);

    if (controls['homophily-slider']) {
      controls['homophily-slider'].addEventListener('input', (e) => {
        homophily = parseFloat(e.target.value);
        const valSpan = e.target.parentElement.querySelector('.slider-value');
        if (valSpan) valSpan.textContent = Math.round(homophily * 100) + '%';
        
        // Visual feedback: split forces if homophily is high
        if (homophily > 0.5) {
          engine.getSimulation().force('x', d3.forceX(d => canvas.clientWidth/2 + (d.community === 0 ? -100 : 100)).strength(homophily * 0.1));
          engine.getSimulation().alpha(0.5).restart();
        } else {
          engine.getSimulation().force('x', null);
        }
      });
    }

    if (controls['inject-misinfo']) {
      controls['inject-misinfo'].addEventListener('click', () => {
        // Pick random node, flood its community
        const source = nodes[Math.floor(Math.random() * nodes.length)];
        const targetComm = source.community;
        
        nodes.forEach(n => {
          if (n.community === targetComm) {
             n.signal = 1.0;
             n.signalType = 'noise'; // fake news
             setTimeout(() => { if(n) n.signal = 0; }, 1000);
          }
        });
      });
    }
  };

  const origDestroy = engine.destroy;
  engine.destroy = function() {
    if (rewiringInterval) clearInterval(rewiringInterval);
    origDestroy();
  };

  engine.init();
  return engine;
}
