import { createNetworkEngine } from '../lib/network-engine.js';

export function initIntro(canvas, controls) {
  let isIsolated = true;
  let organismOpacity = 0;
  let zoomProgress = 0;
  let fadeProgress = 0;
  let phase = 0; // 0 = isolated, 1 = blooming, 2 = fading you

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1, // Start with exactly one node
    linkDistance: 40,
    chargeStrength: -20,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      
      if (phase >= 1) {
        // Fade in the new nodes elegantly
        let maxQualityFade = 0;
        for (let i = 1; i < nodes.length; i++) {
          if (nodes[i].quality < nodes[i].targetQuality) {
            nodes[i].quality += 0.005; // faster smooth fade in
          }
          maxQualityFade = Math.max(maxQualityFade, nodes[i].quality);
        }
        
        if (organismOpacity < 1) {
            organismOpacity += 0.002;
        }

        if (zoomProgress < 1) {
            zoomProgress += 0.005; // Smooth zoom out as network forms
        }
      }

      if (phase === 2) {
        if (fadeProgress < 1) {
          fadeProgress += 0.005; // Takes ~3.3 seconds to fade out completely in stillness
        }
      }

      if (nodes.length > 0) {
        ctx.save();
        
        if (phase >= 1 && organismOpacity > 0) {
          // Draw the emergent organism circle "membrane"
          ctx.beginPath();
          ctx.arc(canvas.clientWidth / 2, canvas.clientHeight / 2, 220 + Math.sin(Date.now()*0.001)*5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(79, 156, 247, ${0.15 * organismOpacity})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([10, 15]);
          ctx.fillStyle = `rgba(79, 156, 247, ${0.015 * organismOpacity})`;
          ctx.fill();
          ctx.stroke();
        }

        // "You" is always nodes[0]
        const you = nodes[0];
        
        const youOpacity = 1 - fadeProgress;
        if (youOpacity > 0.01) {
          // Draw the "You" label
          ctx.fillStyle = `rgba(255, 255, 255, ${youOpacity})`; // Fades completely in stillness
          ctx.font = '500 14px Inter, sans-serif';
          // Position label slightly further away so it doesn't overlap
          ctx.fillText('You', you.x + 8, you.y + 4);
        }

        ctx.restore();

        // Zoom out smoothly from 2.0x to 1x only when blooming starts
        const currentZoom = 2.0 - (zoomProgress * 1.0);
        canvas.style.transform = `scale(${currentZoom})`;
      }
    }
  });

  const defaultDestroy = engine.destroy.bind(engine);
  engine.destroy = function() {
    defaultDestroy();
    canvas.style.transform = ''; // Reset zoom when leaving section
  };

  let spawnInterval;
  let transitionTimeout;
  let fadeTimeout;

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    if (spawnInterval) clearInterval(spawnInterval);
    if (transitionTimeout) clearTimeout(transitionTimeout);
    if (fadeTimeout) clearTimeout(fadeTimeout);

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    // Reset to isolated state
    isIsolated = true;
    organismOpacity = 0;
    zoomProgress = 0;
    fadeProgress = 0;
    phase = 0;
    nodes.length = 1; 
    links.length = 0;
    
    // Make "You" completely normal and insignificant
    nodes[0].x = canvas.clientWidth / 2;
    nodes[0].y = canvas.clientHeight / 2;
    nodes[0].quality = 0.5; 
    nodes[0].radius = 3; // Standard tiny size
    nodes[0].vx = 0;
    nodes[0].vy = 0;

    const sim = engine.getSimulation();
    sim.force('charge').strength(-20);
    sim.nodes(nodes);
    sim.force('link').links(links);
    sim.alpha(1).restart();

    // Sequence Step 1: Network blooms and zooms out
    transitionTimeout = setTimeout(() => {
      phase = 1;
      isIsolated = false;
      sim.force('charge').strength(-15); // Softer gravity

      // Add a radial force to softly pull into a cell-like circle
      if (window.d3 && window.d3.forceRadial) {
         sim.force('radial', window.d3.forceRadial(180, canvas.clientWidth/2, canvas.clientHeight/2).strength(0.04));
      }

      const targetNodes = 350;
      let currentIndex = 1;

      // Progressively spawn nodes for a fluid, elegant buildup
      spawnInterval = setInterval(() => {
        if (currentIndex >= targetNodes) {
          clearInterval(spawnInterval);
          return;
        }

        // Spawn a small batch of nodes
        const batchEnd = Math.min(targetNodes, currentIndex + 3); 
        
        for (let i = currentIndex; i < batchEnd; i++) {
          const parentIndex = Math.floor(Math.random() * i);
          const parentNode = nodes[parentIndex];

          nodes.push({
            id: i,
            state: 1,
            quality: 0, 
            targetQuality: 0.1 + Math.random() * 0.8,
            signal: 0,
            radius: 3,
            x: parentNode.x + (Math.random() - 0.5) * 10,
            y: parentNode.y + (Math.random() - 0.5) * 10,
            community: null,
            strategy: null
          });

          links.push({ source: nodes[i], target: parentNode, type: 'default', weight: 1.0, active: true });

          if (Math.random() > 0.7 && i > 3) {
            let secondParent = Math.floor(Math.random() * i);
            if (secondParent !== parentIndex) {
               links.push({ source: nodes[i], target: nodes[secondParent], type: 'default', weight: 1.0, active: true });
            }
          }
        }

        currentIndex = batchEnd;
        sim.nodes(nodes);
        sim.force('link').links(links);
        sim.alpha(0.3).restart(); 
      }, 20); 

      // Sequence Step 2: Once network is fully spawned and mostly still, start fading "You"
      fadeTimeout = setTimeout(() => {
        phase = 2;
      }, 4500); // 4.5 seconds gives physics time to cool down and become completely still

    }, 1000); // Wait 1 second before starting the bloom
  };

  engine.init();
  return engine;
}
