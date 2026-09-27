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
        for (let i = 1; i < nodes.length; i++) {
          if (nodes[i].quality < nodes[i].targetQuality) {
            nodes[i].quality += 0.005;
          }
        }

        if (organismOpacity < 1) organismOpacity += 0.002;
        if (zoomProgress < 1) zoomProgress += 0.005;
      }

      if (phase === 2 && fadeProgress < 1) fadeProgress += 0.005;

      if (nodes.length > 0) {
        ctx.save();

        if (phase >= 1 && organismOpacity > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, organismRadius + Math.sin(Date.now() * 0.001) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(79, 156, 247, ${0.15 * organismOpacity})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([10, 15]);
          ctx.fillStyle = `rgba(79, 156, 247, ${0.015 * organismOpacity})`;
          ctx.fill();
          ctx.stroke();
        }

        const you = nodes[0];
        const youOpacity = 1 - fadeProgress;
        if (youOpacity > 0.01) {
          ctx.fillStyle = `rgba(255, 255, 255, ${youOpacity})`;
          ctx.font = '500 14px system-ui, sans-serif';
          ctx.fillText('You', you.x + 8, you.y + 4);
        }

        ctx.restore();

        // Desktop keeps the dramatic zoom. On mobile it would crop the graph.
        const currentZoom = mobile ? 1 : 2.0 - zoomProgress;
        canvas.style.transform = `scale(${currentZoom})`;
      }
    }
  });

  const defaultDestroy = engine.destroy.bind(engine);
  engine.destroy = function() {
    defaultDestroy();
    canvas.style.transform = '';
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
    const { mobile, centerX, centerY } = layoutMetrics();

    isIsolated = true;
    organismOpacity = 0;
    zoomProgress = 0;
    fadeProgress = 0;
    phase = 0;
    nodes.length = 1;
    links.length = 0;

    nodes[0].x = centerX;
    nodes[0].y = centerY;
    nodes[0].quality = 0.5;
    nodes[0].radius = 3;
    nodes[0].vx = 0;
    nodes[0].vy = 0;

    const sim = engine.getSimulation();
    sim.force('charge').strength(mobile ? -8 : -20);
    sim.nodes(nodes);
    sim.force('link').links(links);
    sim.alpha(1).restart();

    transitionTimeout = setTimeout(() => {
      phase = 1;
      isIsolated = false;
      const metrics = layoutMetrics();
      sim.force('charge').strength(metrics.mobile ? -6 : -15);

      if (window.d3?.forceRadial) {
        sim.force(
          'radial',
          window.d3.forceRadial(
            Math.max(48, metrics.organismRadius * (metrics.mobile ? 0.68 : 0.8)),
            metrics.centerX,
            metrics.centerY
          ).strength(metrics.mobile ? 0.09 : 0.04)
        );
      }

      // Hundreds of dots communicate scale on desktop. On a narrow phone they
      // merge into an unreadable square, so use a lower but still dramatic count.
      const targetNodes = metrics.mobile ? 140 : 350;
      const batchSize = metrics.mobile ? 2 : 3;
      let currentIndex = 1;

      spawnInterval = setInterval(() => {
        if (currentIndex >= targetNodes) {
          clearInterval(spawnInterval);
          return;
        }

        const batchEnd = Math.min(targetNodes, currentIndex + batchSize);
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

          links.push({ source: nodes[i], target: parentNode, type: 'default', weight: 1, active: true });

          const addSecondLink = Math.random() > (metrics.mobile ? 0.86 : 0.7);
          if (addSecondLink && i > 3) {
            const secondParent = Math.floor(Math.random() * i);
            if (secondParent !== parentIndex) {
              links.push({ source: nodes[i], target: nodes[secondParent], type: 'default', weight: 1, active: true });
            }
          }
        }

        currentIndex = batchEnd;
        sim.nodes(nodes);
        sim.force('link').links(links);
        sim.alpha(0.3).restart();
      }, 20);

      fadeTimeout = setTimeout(() => {
        phase = 2;
      }, 4500);
    }, 1000);
  };

  engine.init();
  return engine;
}
