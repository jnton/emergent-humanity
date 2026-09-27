export function initIllusionOfSignificance(canvas, controls) {
  const ctx = canvas.getContext('2d');
  const stats = document.getElementById('stats-illusion-of-significance');

  let isActive = false;
  let animationFrame = null;
  let width = 0;
  let height = 0;
  let frame = 0;
  let stepCount = 0;
  let regime = 'sensitive';
  let perturbed = false;

  const nodeCount = 54;
  let layout = [];
  let adjacency = [];
  let stateA = [];
  let stateB = [];

  function resize() {
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildTopology() {
    layout = [];
    adjacency = Array.from({ length: nodeCount }, () => new Set());

    const rings = 3;
    for (let i = 0; i < nodeCount; i += 1) {
      const ring = i % rings;
      const angle = (i / nodeCount) * Math.PI * 2 * 3 + ring * 0.35;
      const radius = 38 + ring * 32 + ((i * 17) % 13);
      layout.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    }

    const connect = (a, b) => {
      if (a === b) return;
      adjacency[a].add(b);
      adjacency[b].add(a);
    };

    for (let i = 0; i < nodeCount; i += 1) {
      connect(i, (i + 1) % nodeCount);
      connect(i, (i + 3) % nodeCount);
      if (i % 6 === 0) connect(i, (i + 17) % nodeCount);
    }
  }

  function seedStates() {
    stateA = [];
    stateB = [];
    for (let i = 0; i < nodeCount; i += 1) {
      const value = 0.12 + (((i * 37) % 83) / 100);
      stateA.push(value);
      stateB.push(value);
    }
    perturbed = false;
    stepCount = 0;
    frame = 0;

    if (controls['shift-node']) {
      controls['shift-node'].disabled = false;
      controls['shift-node'].textContent = 'Perturb One Node';
    }
  }

  function circularAverage(values, indices) {
    if (indices.size === 0) return 0;
    let total = 0;
    for (const index of indices) total += values[index];
    return total / indices.size;
  }

  function stableStep(values) {
    const next = new Array(values.length);
    for (let i = 0; i < values.length; i += 1) {
      const neighborMean = circularAverage(values, adjacency[i]);
      next[i] = 0.62 * values[i] + 0.38 * neighborMean;
    }
    return next;
  }

  function sensitiveStep(values) {
    const transformed = values.map((value) => 3.9 * value * (1 - value));
    const next = new Array(values.length);
    for (let i = 0; i < values.length; i += 1) {
      const neighborMean = circularAverage(transformed, adjacency[i]);
      next[i] = Math.min(1, Math.max(0, 0.92 * transformed[i] + 0.08 * neighborMean));
    }
    return next;
  }

  function advance() {
    if (!perturbed) {
      stateB = [...stateA];
    }

    if (regime === 'stable') {
      stateA = stableStep(stateA);
      stateB = stableStep(stateB);
    } else {
      stateA = sensitiveStep(stateA);
      stateB = sensitiveStep(stateB);
    }

    stepCount += 1;
  }

  function divergence() {
    if (!perturbed) return 0;
    let total = 0;
    for (let i = 0; i < nodeCount; i += 1) {
      total += Math.abs(stateA[i] - stateB[i]);
    }
    return total / nodeCount;
  }

  function drawTimeline(values, reference, centerX, label) {
    const scale = Math.min(1.15, Math.max(0.62, width / 1050));
    ctx.save();
    ctx.translate(centerX, height * 0.52);
    ctx.scale(scale, scale);

    ctx.beginPath();
    for (let i = 0; i < adjacency.length; i += 1) {
      for (const j of adjacency[i]) {
        if (j <= i) continue;
        ctx.moveTo(layout[i].x, layout[i].y);
        ctx.lineTo(layout[j].x, layout[j].y);
      }
    }
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      const diff = reference ? Math.abs(value - reference[i]) : 0;
      const hue = 215 - value * 150;

      ctx.beginPath();
      ctx.arc(layout[i].x, layout[i].y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue} 78% 58%)`;
      ctx.fill();

      if (reference && perturbed && diff > 0.02) {
        ctx.beginPath();
        ctx.arc(layout[i].x, layout[i].y, 6.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.min(1, diff * 4)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(layout[0].x, layout[0].y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, centerX, height - 34);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const split = width <= 700;
    if (split) {
      const scaleY = 0.74;
      ctx.save();
      ctx.translate(0, -height * 0.13);
      drawTimeline(stateA, null, width / 2, 'Timeline A');
      ctx.restore();

      ctx.save();
      ctx.translate(0, height * 0.28);
      ctx.scale(1, scaleY);
      drawTimeline(stateB, stateA, width / 2, 'Timeline B');
      ctx.restore();
    } else {
      drawTimeline(stateA, null, width * 0.27, 'Timeline A');
      drawTimeline(stateB, stateA, width * 0.73, 'Timeline B');
    }

    if (stats) {
      const d = divergence();
      stats.textContent = `${regime === 'stable' ? 'averaging: residual may persist' : 'sensitive nonlinear'} · step ${stepCount} · mean |Δ| ${d.toExponential(2)}`;
    }
  }

  function loop() {
    animationFrame = null;
    if (!isActive) return;
    animationFrame = requestAnimationFrame(loop);

    frame += 1;
    if (frame % 5 === 0) advance();
    draw();
  }

  function setRegime(nextRegime) {
    regime = nextRegime;
    seedStates();

    controls['stable-regime']?.classList.toggle('active', regime === 'stable');
    controls['sensitive-regime']?.classList.toggle('active', regime === 'sensitive');
  }

  controls['stable-regime']?.addEventListener('click', () => setRegime('stable'));
  controls['sensitive-regime']?.addEventListener('click', () => setRegime('sensitive'));
  controls['shift-node']?.addEventListener('click', () => {
    if (perturbed) return;
    perturbed = true;

    // Deliberately tiny state perturbation: the two trajectories remain
    // identical except for this one value at t = 0.
    stateB[0] = Math.min(0.999999, stateB[0] + 1e-7);

    controls['shift-node'].disabled = true;
    controls['shift-node'].textContent = 'Perturbation Applied';
  });

  function init() {
    resize();
    buildTopology();
    seedStates();
    draw();
  }

  init();

  return {
    init,
    renderStatic:draw,
    resize(){resize();draw();},
    destroy(){isActive=false;if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=null;},
    activate() {
      isActive = true;
      if (!animationFrame) loop();
    },
    deactivate() {
      isActive = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };
}
