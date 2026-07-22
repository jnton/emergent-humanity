import { createNetworkEngine } from '../lib/network-engine.js';

export function initIntro(canvas, controls) {
  let isIsolated = true;
  let organismOpacity = 0;
  let zoomProgress = 0;
  let fadeProgress = 0;
  let phase = 0; // 0 = isolated, 1 = blooming, 2 = fading you

  function layoutMetrics() {
    const mobile = canvas.clientWidth <= 900;
    const centerX = canvas.clientWidth / 2;
    const centerY = mobile ? canvas.clientHeight * 0.59 : canvas.clientHeight / 2;
    const organismRadius = Math.min(
      mobile ? 132 : 220,
      canvas.clientWidth * (mobile ? 0.34 : 0.42),
      canvas.clientHeight * (mobile ? 0.29 : 0.4)
    );
    return { mobile, centerX, centerY, organismRadius };
  }

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1, // Start with exactly one node
    linkDistance: 40,
    chargeStrength: -20,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      const { mobile, centerX, centerY, organismRadius } = layoutMetrics();

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
          // Draw the emergent organism circle "membrane" within the visible canvas.
          ctx.beginPath();
          ctx.arc(centerX, centerY, organismRadius + Math.sin(Date.now() * 0.001) * 4, 0, Math.PI * 2);
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
          ctx.font = '500 14px system-ui, sans-serif';
          // Position label slightly further away so it doesn't overlap
          ctx.fillText('You', you.x + 8, you.y + 4);
        }

        ctx.restore();

        // Desktop keeps the dramatic zoom. On mobile it would crop the graph.
        const currentZoom = mobile ? 1 : 2.0 - (zoomProgress * 1.0);
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
    const { centerX, centerY, organismRadius } = layoutMetrics();

    // Reset to isolated state
    isIsolated = true;
    organismOpacity = 0;
    zoomProgress = 0;
    fadeProgress = 0;
    phase = 0;
    nodes.length = 1;
    links.length = 0;

    // Make "You" completely normal and insignificant
    nodes[0].x = centerX;
    nodes[0].y = centerY;
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

      // Add a radial force sized to the current canvas rather than a fixed desktop radius.
      if (window.d3 && window.d3.forceRadial) {
        const metrics = layoutMetrics();
        sim.force(
          'radial',
          window.d3.forceRadial(
            Math.max(48, metrics.organismRadius * 0.8),
            metrics.centerX,
            metrics.centerY
          ).strength(0.04)
        );
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
            const secondParent = Math.floor(Math.random() * i);
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
