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
  let initialDistance = 0;

  const nodeCount = 54;
  const epsilon = 1e-7;
  let layout = [];
  let adjacency = [];
  let stateA = [];
  let stateB = [];

  function resize() {
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildTopology() {
    layout = [];
    adjacency = Array.from({ length: nodeCount }, () => new Set());

    for (let i = 0; i < nodeCount; i += 1) {
      const ring = i % 3;
      const angle = (i / nodeCount) * Math.PI * 6 + ring * 0.35;
      const radius = 38 + ring * 32 + ((i * 17) % 13);
      layout.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
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
    initialDistance = 0;
    stepCount = 0;
    frame = 0;

    if (controls['shift-node']) {
      controls['shift-node'].disabled = false;
      controls['shift-node'].textContent = 'Perturb One Node';
    }
  }

  function mean(values, indices) {
    if (indices.size === 0) return 0;
    let total = 0;
    for (const index of indices) total += values[index];
    return total / indices.size;
  }

  function stableStep(values) {
    const next = new Array(values.length);
    for (let i = 0; i < values.length; i += 1) {
      const neighborMean = mean(values, adjacency[i]);
      next[i] = 0.62 * values[i] + 0.38 * neighborMean;
    }
    return next;
  }

  function sensitiveStep(values) {
    const transformed = values.map((value) => 3.9 * value * (1 - value));
    const next = new Array(values.length);
    for (let i = 0; i < values.length; i += 1) {
      const neighborMean = mean(transformed, adjacency[i]);
      next[i] = Math.min(1, Math.max(0, 0.92 * transformed[i] + 0.08 * neighborMean));
    }
    return next;
  }

  function distance() {
    if (!perturbed) return 0;
    let sumSq = 0;
    for (let i = 0; i < nodeCount; i += 1) {
      const d = stateA[i] - stateB[i];
      sumSq += d * d;
    }
    return Math.sqrt(sumSq);
  }

  function finiteTimeRate() {
    const d = distance();
    if (!perturbed || stepCount < 1 || d <= 0 || initialDistance <= 0) return null;
    return Math.log(d / initialDistance) / stepCount;
  }

  function advance() {
    if (!perturbed) stateB = [...stateA];

    if (regime === 'stable') {
      stateA = stableStep(stateA);
      stateB = stableStep(stateB);
    } else {
      stateA = sensitiveStep(stateA);
      stateB = sensitiveStep(stateB);
    }

    stepCount += 1;
  }

  function drawTimeline(values, reference, centerX, centerY, label, scale = 1) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    for (let i = 0; i < adjacency.length; i += 1) {
      for (const j of adjacency[i]) {
        if (j <= i) continue;
        ctx.moveTo(layout[i].x, layout[i].y);
        ctx.lineTo(layout[j].x, layout[j].y);
      }
    }
    ctx.strokeStyle = 'rgba(148,163,184,0.14)';
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

      if (reference && perturbed && diff > 0.005) {
        ctx.beginPath();
        ctx.arc(layout[i].x, layout[i].y, 6.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239,68,68,${Math.min(1, diff * 5)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    ctx.restore();
    ctx.fillStyle = 'rgba(226,232,240,0.72)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, centerX, centerY + 135 * scale);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(226,232,240,0.78)';
    ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('||δxₜ|| ≈ ||δx₀|| e^(λt)', width / 2, 25);

    if (width <= 700) {
      const scale = Math.min(0.7, width / 420);
      drawTimeline(stateA, null, width / 2, height * 0.32, 'Timeline A', scale);
      drawTimeline(stateB, stateA, width / 2, height * 0.72, 'Timeline B', scale);
    } else {
      const scale = Math.min(1.05, width / 1050);
      drawTimeline(stateA, null, width * 0.27, height * 0.52, 'Timeline A', scale);
      drawTimeline(stateB, stateA, width * 0.73, height * 0.52, 'Timeline B', scale);
    }

    if (stats) {
      const d = distance();
      const lambda = finiteTimeRate();
      const rate = lambda === null ? '—' : lambda.toFixed(3);
      stats.textContent = `${regime === 'stable' ? 'contracting regime' : 'sensitive nonlinear regime'} · ε ${epsilon.toExponential(0)} · step ${stepCount} · ||δx|| ${d.toExponential(2)} · finite-time λ̂ ${rate}/step`;
    }
  }

  function loop() {
    animationFrame = requestAnimationFrame(loop);
    if (!isActive) return;
    frame += 1;
    if (frame % 6 === 0) advance();
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
    stateB[0] = Math.min(0.999999, stateB[0] + epsilon);
    initialDistance = distance();
    controls['shift-node'].disabled = true;
    controls['shift-node'].textContent = 'ε Applied';
  });

  function init() {
    resize();
    buildTopology();
    seedStates();
    if (!animationFrame) loop();
  }

  init();

  return {
    init,
    activate() { isActive = true; },
    deactivate() { isActive = false; },
    resize
  };
}
