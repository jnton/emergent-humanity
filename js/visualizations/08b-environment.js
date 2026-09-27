import { createNetworkEngine } from '../lib/network-engine.js';

export function initEnvironment(canvas, controls) {
  let particles = [];
  let inferredCount = 0;
  let observedCount = 0;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const tokens = ['A', 'B', 'C', 'D', 'E'];
  const stats = document.getElementById('stats-environment');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 40,
    chargeStrength: -30,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        let absorbed = false;
        for (const n of nodes) {
          if (n.state !== 1) continue;
          if (Math.hypot(n.x - p.x, n.y - p.y) < n.radius + 15) {
            ensureKnowledge(n).add(p.token);
            n.infoColor = p.color;
            n.pulse = 1;
            observedCount += 1;
            absorbed = true;
            break;
          }
        }

        if (absorbed) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + Math.sin(Date.now() * 0.01 + p.x), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '600 9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.token, p.x, p.y - 7);
      }

      for (const n of nodes) {
        if (n.infoColor && n.state === 1) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = n.infoColor;
          ctx.fill();
        }

        if (n.inferred && n.state === 1) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.65)';
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (n.pulse > 0) {
          n.pulse = Math.max(0, n.pulse - 0.05);
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + (1 - n.pulse) * 10, 0, Math.PI * 2);
          ctx.strokeStyle = n.infoColor || 'white';
          ctx.lineWidth = 2 * n.pulse;
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(226,232,240,0.68)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OBSERVATION: outside → node', width * 0.3, 24);
      ctx.fillText('INFERENCE: stored A + B → new I', width * 0.72, 24);

      if (stats) {
        const carriers = nodes.filter((n) => ensureKnowledge(n).size > 0).length;
        stats.textContent = `observations absorbed ${observedCount} · nodes with evidence ${carriers} · inferred propositions ${inferredCount}`;
      }
    }
  });

  function ensureKnowledge(node) {
    if (!(node.knowledge instanceof Set)) node.knowledge = new Set();
    return node.knowledge;
  }

  function releaseObservations() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    for (let i = 0; i < 12; i += 1) {
      const edge = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      const speed = 1 + Math.random() * 1.5;

      if (edge === 0) { x = Math.random() * width; y = 0; vx = (Math.random() - 0.5) * speed; vy = speed; }
      else if (edge === 1) { x = width; y = Math.random() * height; vx = -speed; vy = (Math.random() - 0.5) * speed; }
      else if (edge === 2) { x = Math.random() * width; y = height; vx = (Math.random() - 0.5) * speed; vy = -speed; }
      else { x = 0; y = Math.random() * height; vx = speed; vy = (Math.random() - 0.5) * speed; }

      const idx = Math.floor(Math.random() * tokens.length);
      particles.push({ x, y, vx, vy, color: colors[idx], token: tokens[idx] });
    }
  }

  function runInference() {
    const eligible = engine.getNodes().filter((n) => ensureKnowledge(n).size >= 2);
    if (!eligible.length) {
      // Make the action informative even if the user clicks inference first.
      const nodes = engine.getNodes();
      if (nodes.length) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        ensureKnowledge(n).add('A');
        ensureKnowledge(n).add('B');
      }
    }

    for (const node of engine.getNodes()) {
      const knowledge = ensureKnowledge(node);
      if (knowledge.size < 2 || node.inferred) continue;
      const pair = [...knowledge].slice(0, 2).sort().join('+');
      node.inferred = 'I(' + pair + ')';
      knowledge.add(node.inferred);
      node.pulse = 1;
      node.infoColor = '#ffffff';
      inferredCount += 1;

      const neighbors = engine.getAdjacency().get(node.id) ?? [];
      if (neighbors.length) {
        const target = neighbors[Math.floor(Math.random() * neighbors.length)];
        ensureKnowledge(target).add(node.inferred);
        target.inferred = node.inferred;
        target.pulse = 1;
      }
      break;
    }
  }

  controls['release-info']?.addEventListener('click', releaseObservations);
  controls['infer-knowledge']?.addEventListener('click', runInference);

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    particles = [];
    inferredCount = 0;
    observedCount = 0;
    engine.getNodes().forEach((n) => {
      n.infoColor = null;
      n.pulse = 0;
      n.inferred = null;
      n.knowledge = new Set();
    });
    return engine;
  };

  engine.init();
  return engine;
}
