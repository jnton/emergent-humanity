export function initWhatsNext(canvas, controls) {
  const ctx = canvas.getContext('2d');
  const stats = document.getElementById('stats-whats-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let active = false;
  let frameId = null;
  let phase = 0;
  let nodes = [];
  let edges = [];

  const clamp = (x) => Math.max(0, Math.min(1, x));
  const value = (id, fallback) => Number.parseFloat(controls[id]?.value ?? String(fallback));

  function state(overrides = {}) {
    return {
      capability: overrides.capability ?? value('thrive-capability', 0.65),
      connectivity: overrides.connectivity ?? value('thrive-connectivity', 0.55),
      fidelity: overrides.fidelity ?? value('thrive-fidelity', 0.7),
      memory: overrides.memory ?? value('thrive-memory', 0.6),
      redundancy: overrides.redundancy ?? value('thrive-redundancy', 0.5),
      alignment: overrides.alignment ?? value('thrive-alignment', 0.55),
      diversity: overrides.diversity ?? value('thrive-diversity', 0.6),
      feedback: overrides.feedback ?? value('thrive-feedback', 0.7),
    };
  }

  function metrics(s) {
    // Project-defined toy objectives. They intentionally remain separate.
    const overload = clamp((s.connectivity ** 2) * (1 - 0.45 * s.capability));
    const usableConnectivity = clamp(s.connectivity * (1 - 0.52 * overload));

    const learning = clamp(
      s.capability
      * (0.35 + 0.65 * s.fidelity)
      * (0.30 + 0.70 * s.feedback)
      * (0.68 + 0.32 * s.diversity)
    );

    const coordination = clamp(
      s.capability
      * (0.28 + 0.72 * usableConnectivity)
      * (0.30 + 0.70 * s.alignment)
      * (0.45 + 0.55 * s.fidelity)
      * (1 - 0.22 * s.diversity)
    );

    const resilience = clamp(
      0.29 * s.redundancy
      + 0.21 * s.memory
      + 0.18 * usableConnectivity
      + 0.17 * s.diversity
      + 0.15 * s.capability
    );

    const adaptability = clamp(
      s.capability
      * (0.35 + 0.65 * s.feedback)
      * (0.38 + 0.62 * s.diversity)
      * (1 - 0.45 * s.alignment * s.alignment)
      + 0.12 * s.memory
    );

    const resourceCost = clamp(
      0.18 * s.capability
      + 0.24 * s.connectivity * s.connectivity
      + 0.20 * s.redundancy
      + 0.16 * s.memory
      + 0.10 * s.alignment
      + 0.12 * s.fidelity
    );

    const lockInRisk = clamp(
      s.memory
      * (1 - s.fidelity)
      * (0.45 + 0.55 * (1 - s.feedback))
      * (0.55 + 0.45 * s.alignment)
    );

    return {
      learning,
      coordination,
      resilience,
      adaptability,
      resourceCost,
      lockInRisk,
      overload
    };
  }

  function seededUnit(i, j = 0) {
    const x = Math.sin((i + 1) * 12.9898 + (j + 1) * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function buildNodes() {
    const count = width <= 700 ? 34 : 54;
    nodes = Array.from({ length: count }, (_, i) => {
      const ring = i % 3;
      const angle = (i / count) * Math.PI * 2 + ring * 0.42;
      const radial = 0.18 + ring * 0.09 + seededUnit(i) * 0.055;
      return {
        id: i,
        nx: 0.5 + Math.cos(angle) * radial,
        ny: 0.31 + Math.sin(angle) * radial * 0.72,
        trait: seededUnit(i, 3)
      };
    });
    buildEdges();
  }

  function buildEdges() {
    const s = state();
    edges = [];
    const p = 0.018 + s.connectivity * 0.095 + s.redundancy * 0.025;

    for (let i = 0; i < nodes.length; i += 1) {
      // Guarantee a sparse backbone.
      edges.push([i, (i + 1) % nodes.length, 'backbone']);
      for (let j = i + 2; j < nodes.length; j += 1) {
        if (seededUnit(i, j) < p) edges.push([i, j, 'optional']);
      }
    }
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
    draw();
  }

  function drawNetwork(s) {
    const topHeight = height * 0.57;

    // External environment / reality signals.
    const environmentY = 28;
    ctx.save();
    ctx.fillStyle = 'rgba(226,232,240,0.65)';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXTERNAL REALITY / FEEDBACK', width / 2, environmentY - 8);

    for (let k = 0; k < 5; k += 1) {
      const x = width * (0.18 + k * 0.16);
      ctx.beginPath();
      ctx.arc(x, environmentY + 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${0.25 + 0.65 * s.feedback})`;
      ctx.fill();

      const target = nodes[(k * 11) % nodes.length];
      if (target) {
        const tx = target.nx * width;
        const ty = target.ny * topHeight;
        ctx.beginPath();
        ctx.moveTo(x, environmentY + 6);
        ctx.lineTo(tx, ty);
        const pulse = 0.35 + 0.25 * Math.sin(phase + k);
        ctx.strokeStyle = `rgba(56,189,248,${s.feedback * pulse})`;
        ctx.setLineDash([3, 7]);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    ctx.restore();

    for (const [aId, bId, kind] of edges) {
      const a = nodes[aId];
      const b = nodes[bId];
      if (!a || !b) continue;
      const alpha = (kind === 'backbone' ? 0.13 : 0.08)
        + 0.34 * s.fidelity
        + (kind === 'optional' ? 0.10 * s.redundancy : 0);
      ctx.beginPath();
      ctx.moveTo(a.nx * width, a.ny * topHeight);
      ctx.lineTo(b.nx * width, b.ny * topHeight);
      ctx.strokeStyle = `rgba(148,163,184,${Math.min(0.62, alpha)})`;
      ctx.lineWidth = 0.7 + s.redundancy * (kind === 'optional' ? 1.1 : 0.4);
      ctx.stroke();
    }

    for (const node of nodes) {
      const x = node.nx * width;
      const y = node.ny * topHeight;
      const hue = 205 + (node.trait - 0.5) * s.diversity * 180;
      const r = 2.5 + 3.5 * s.capability;

      if (node.trait < s.memory) {
        ctx.beginPath();
        ctx.arc(x, y, r + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(250,204,21,${0.15 + 0.45 * s.memory})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue} 75% ${52 + 18 * s.capability}%)`;
      ctx.fill();

      const individualHeading = (node.trait * 2 - 1) * Math.PI;
      const heading = individualHeading * (1 - s.alignment);
      const arrowLength = 7 + 7 * s.alignment;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(heading) * arrowLength, y + Math.sin(heading) * arrowLength);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function bar(x, y, w, label, val, harmful = false) {
    ctx.fillStyle = 'rgba(148,163,184,0.12)';
    ctx.fillRect(x, y, w, 7);
    ctx.fillStyle = harmful
      ? `rgba(239,68,68,${0.42 + val * 0.45})`
      : `rgba(56,189,248,${0.42 + val * 0.45})`;
    ctx.fillRect(x, y, w * val, 7);

    ctx.fillStyle = 'rgba(226,232,240,0.72)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y - 5);
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(val * 100) + '%', x + w, y - 5);
  }

  function drawMetrics(s, m) {
    const y0 = height * 0.64;
    const left = width <= 700 ? 18 : 28;
    const gap = width <= 700 ? 22 : 26;
    const chartW = width <= 700 ? width - 36 : Math.min(360, width * 0.42);

    bar(left, y0, chartW, 'learning', m.learning);
    bar(left, y0 + gap, chartW, 'coordination', m.coordination);
    bar(left, y0 + gap * 2, chartW, 'resilience', m.resilience);
    bar(left, y0 + gap * 3, chartW, 'adaptability', m.adaptability);

    if (width > 700) {
      const right = width - chartW - 28;
      bar(right, y0, chartW, 'resource cost', m.resourceCost, true);
      bar(right, y0 + gap, chartW, 'error lock-in risk', m.lockInRisk, true);
      bar(right, y0 + gap * 2, chartW, 'coordination overload', m.overload, true);

      // A two-objective slice of the larger problem: sweep alignment while
      // holding all other controls fixed.
      const px = right;
      const py = y0 + gap * 3 + 10;
      const pw = chartW;
      const ph = Math.max(52, height - py - 16);

      ctx.strokeStyle = 'rgba(148,163,184,0.25)';
      ctx.strokeRect(px, py, pw, ph);
      ctx.beginPath();

      let currentPoint = null;
      for (let i = 0; i <= 20; i += 1) {
        const a = i / 20;
        const mm = metrics({ ...s, alignment: a });
        const x = px + mm.adaptability * pw;
        const y = py + ph - mm.coordination * ph;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (Math.abs(a - s.alignment) < 0.026) currentPoint = { x, y };
      }
      ctx.strokeStyle = 'rgba(167,139,250,0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (currentPoint) {
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(226,232,240,0.6)';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('adaptability →', px + 4, py + ph - 4);
      ctx.save();
      ctx.translate(px + 8, py + ph / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('coordination →', 0, 0);
      ctx.restore();
      ctx.textAlign = 'right';
      ctx.fillText('alignment sweep: one trade-off slice', px + pw - 4, py + 12);
    } else {
      const harmY = y0 + gap * 4 + 3;
      bar(left, harmY, chartW, 'resource cost', m.resourceCost, true);
      bar(left, harmY + gap, chartW, 'error lock-in', m.lockInRisk, true);
      bar(left, harmY + gap * 2, chartW, 'coordination overload', m.overload, true);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const s = state();
    const m = metrics(s);

    drawNetwork(s);
    drawMetrics(s, m);

    if (stats) {
      stats.textContent =
        `no scalar humanity score · learning ${Math.round(m.learning * 100)} · coordination ${Math.round(m.coordination * 100)} · resilience ${Math.round(m.resilience * 100)} · adaptability ${Math.round(m.adaptability * 100)} · cost ${Math.round(m.resourceCost * 100)} · lock-in ${Math.round(m.lockInRisk * 100)}`;
    }
  }

  function loop() {
    frameId = null;
    if (!active) return;
    phase += 0.035;
    draw();
    if (!reduceMotion.matches) frameId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (frameId === null) frameId = requestAnimationFrame(loop);
  }

  for (const [id, control] of Object.entries(controls)) {
    if (!id.startsWith('thrive-') || !control) continue;
    control.addEventListener('input', () => {
      if (id === 'thrive-connectivity' || id === 'thrive-redundancy') buildEdges();
      draw();
    });
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  resize();

  return {
    activate() {
      active = true;
      startLoop();
      draw();
    },
    deactivate() {
      active = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    },
    resize,
    destroy() {
      this.deactivate();
      observer.disconnect();
    }
  };
}
