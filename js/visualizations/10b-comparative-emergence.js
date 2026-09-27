export function initComparativeEmergence(canvas, controls) {
  const ctx = canvas.getContext('2d');
  const stats = document.getElementById('stats-comparative-emergence');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 1;
  let height = 1;
  let isActive = false;
  let animationFrame = null;
  let lastTime = performance.now();
  let mode = 'trace';
  let seed = 74291;

  let traceSystems = [];
  let alignmentSystems = [];
  let networkSystems = [];

  const showMeasurements=()=>document.documentElement.dataset.measurements==='true';
  const MODES = {
    trace: {
      title: 'REINFORCEMENT + DECAY',
      formula: 'Tₑ(t+1) = (1−ρ)Tₑ(t) + αFₑ(t)',
      left: 'ANT COLONY',
      right: 'HUMAN EXTERNAL TRACE',
      note: 'same toy state-update rule'
    },
    alignment: {
      title: 'DIRECTIONAL ORDER',
      formula: 'R = |(1/N) Σ exp(iθᵢ)|',
      left: 'FLOCK',
      right: 'HUMAN COORDINATION',
      note: 'same order parameter'
    },
    network: {
      title: 'ADAPTIVE NETWORK TRADE-OFF',
      formula: 'J = E − λC + μB',
      left: 'PHYSARUM-LIKE NETWORK',
      right: 'HUMAN INFRASTRUCTURE',
      note: 'B: connected fraction; J: chosen toy score'
    }
  };

  function random() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function resize() {
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(320, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function panelBounds(index) {
    const gutter = Math.max(20, width * 0.045);
    const gap = Math.max(22, width * 0.045);
    const top = 112;
    const bottom = Math.max(top + 120, height - 44);
    const panelWidth = (width - gutter * 2 - gap) / 2;
    const x = gutter + index * (panelWidth + gap);
    return { x, y: top, w: panelWidth, h: bottom - top };
  }

  function chooseWeighted(values, exponent = 1.5) {
    const weights = values.map((value) => Math.pow(Math.max(0.02, value), exponent));
    const total = weights.reduce((sum, value) => sum + value, 0);
    let pick = random() * total;
    for (let i = 0; i < weights.length; i += 1) {
      pick -= weights[i];
      if (pick <= 0) return i;
    }
    return weights.length - 1;
  }

  function initTraceSystems() {
    traceSystems = [0, 1].map((systemIndex) => {
      const traces = systemIndex === 0 ? [0.58, 0.34] : [0.52, 0.38];
      const agents = Array.from({ length: 32 }, () => ({
        phase: random(),
        route: random() < 0.5 ? 0 : 1,
        speed: 0.12 + random() * 0.09
      }));
      return { traces, agents };
    });
  }

  function initAlignmentSystems() {
    alignmentSystems = [0, 1].map((systemIndex) => {
      const agents = Array.from({ length: 42 }, (_, index) => ({
        x: random(),
        y: random(),
        theta: random() * Math.PI * 2,
        anchorX: ((index * 37) % 101) / 101,
        anchorY: ((index * 61) % 97) / 97,
        speed: 0.045 + random() * 0.025
      }));
      return {
        agents,
        coupling: systemIndex === 0 ? 1.25 : 1.05,
        noise: systemIndex === 0 ? 0.34 : 0.42
      };
    });
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function initNetworkSystems() {
    networkSystems = [0, 1].map((systemIndex) => {
      const n = 13;
      const nodes = Array.from({ length: n }, (_, i) => {
        const ring = i < 9;
        const angle = (i / 9) * Math.PI * 2 + systemIndex * 0.17;
        return ring
          ? {
              x: 0.5 + Math.cos(angle) * (0.34 + random() * 0.035),
              y: 0.5 + Math.sin(angle) * (0.31 + random() * 0.035)
            }
          : {
              x: 0.28 + random() * 0.44,
              y: 0.28 + random() * 0.44
            };
      });

      const edges = [];
      const seen = new Set();
      const addEdge = (a, b) => {
        if (a === b) return;
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        const key = lo + ':' + hi;
        if (seen.has(key)) return;
        seen.add(key);
        edges.push({
          a: lo,
          b: hi,
          length: distance(nodes[lo], nodes[hi]),
          weight: 0.34 + random() * 0.24
        });
      };

      for (let i = 0; i < 9; i += 1) {
        addEdge(i, (i + 1) % 9);
        addEdge(i, (i + 2) % 9);
      }

      for (let i = 9; i < n; i += 1) {
        const nearest = [...Array(n).keys()]
          .filter((j) => j !== i)
          .sort((a, b) => distance(nodes[i], nodes[a]) - distance(nodes[i], nodes[b]))
          .slice(0, 3);
        nearest.forEach((j) => addEdge(i, j));
      }

      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          if (distance(nodes[i], nodes[j]) < 0.34 && random() < 0.45) addEdge(i, j);
        }
      }

      return { nodes, edges, demandClock: random() * 0.4 };
    });
  }

  function resetStates() {
    seed = 74291 + (mode === 'trace' ? 0 : mode === 'alignment' ? 1009 : 2027);
    initTraceSystems();
    initAlignmentSystems();
    initNetworkSystems();
  }

  function updateTrace(system, dt) {
    const rho = 0.07;
    const alpha = 0.055;

    system.traces[0] *= Math.max(0, 1 - rho * dt);
    system.traces[1] *= Math.max(0, 1 - rho * dt);

    for (const agent of system.agents) {
      const routeFactor = agent.route === 0 ? 1.0 : 0.78;
      agent.phase += agent.speed * routeFactor * dt;
      if (agent.phase < 1) continue;

      agent.phase -= 1;
      system.traces[agent.route] = Math.min(1.6, system.traces[agent.route] + alpha);
      agent.route = chooseWeighted(system.traces, 1.7);
    }
  }

  function circularOrder(agents) {
    if (!agents.length) return 0;
    let x = 0;
    let y = 0;
    for (const agent of agents) {
      x += Math.cos(agent.theta);
      y += Math.sin(agent.theta);
    }
    return Math.hypot(x, y) / agents.length;
  }

  function meanAngle(agents) {
    let x = 0;
    let y = 0;
    for (const agent of agents) {
      x += Math.cos(agent.theta);
      y += Math.sin(agent.theta);
    }
    return Math.atan2(y, x);
  }

  function angleDiff(target, current) {
    return Math.atan2(Math.sin(target - current), Math.cos(target - current));
  }

  function updateAlignment(system, dt, moving) {
    const target = meanAngle(system.agents);
    for (const agent of system.agents) {
      const deterministic = angleDiff(target, agent.theta) * system.coupling * dt;
      const stochastic = (random() - 0.5) * system.noise * Math.sqrt(dt);
      agent.theta += deterministic + stochastic;

      if (moving) {
        agent.x += Math.cos(agent.theta) * agent.speed * dt;
        agent.y += Math.sin(agent.theta) * agent.speed * dt;
        if (agent.x < 0) agent.x += 1;
        if (agent.x > 1) agent.x -= 1;
        if (agent.y < 0) agent.y += 1;
        if (agent.y > 1) agent.y -= 1;
      }
    }
  }

  function shortestPath(system, source, target) {
    const n = system.nodes.length;
    const dist = Array(n).fill(Infinity);
    const prev = Array(n).fill(-1);
    const used = Array(n).fill(false);
    dist[source] = 0;

    for (let step = 0; step < n; step += 1) {
      let u = -1;
      let best = Infinity;
      for (let i = 0; i < n; i += 1) {
        if (!used[i] && dist[i] < best) {
          best = dist[i];
          u = i;
        }
      }
      if (u < 0 || u === target) break;
      used[u] = true;

      for (let edgeIndex = 0; edgeIndex < system.edges.length; edgeIndex += 1) {
        const edge = system.edges[edgeIndex];
        let v = -1;
        if (edge.a === u) v = edge.b;
        else if (edge.b === u) v = edge.a;
        if (v < 0 || used[v]) continue;

        const edgeCost = edge.length / (0.12 + edge.weight);
        const candidate = dist[u] + edgeCost;
        if (candidate < dist[v]) {
          dist[v] = candidate;
          prev[v] = edgeIndex;
        }
      }
    }

    if (!Number.isFinite(dist[target])) return { distance: Infinity, edges: [] };

    const pathEdges = [];
    let current = target;
    while (current !== source) {
      const edgeIndex = prev[current];
      if (edgeIndex < 0) break;
      pathEdges.push(edgeIndex);
      const edge = system.edges[edgeIndex];
      current = edge.a === current ? edge.b : edge.a;
    }
    return { distance: dist[target], edges: pathEdges };
  }

  function updateNetwork(system, dt) {
    for (const edge of system.edges) {
      edge.weight = Math.max(0.07, edge.weight * Math.pow(0.996, dt * 60));
    }

    system.demandClock -= dt;
    if (system.demandClock > 0) return;
    system.demandClock = 0.11 + random() * 0.15;

    const source = Math.floor(random() * system.nodes.length);
    let target = Math.floor(random() * system.nodes.length);
    if (target === source) target = (target + 1) % system.nodes.length;
    const path = shortestPath(system, source, target);
    for (const edgeIndex of path.edges) {
      const edge = system.edges[edgeIndex];
      edge.weight = Math.min(1.25, edge.weight + 0.048);
    }
  }

  function networkMetrics(system) {
    let weightedCost = 0;
    let possibleCost = 0;
    for (const edge of system.edges) {
      weightedCost += edge.length * edge.weight;
      possibleCost += edge.length * 1.25;
    }
    const cost = possibleCost ? weightedCost / possibleCost : 0;

    let efficiency = 0;
    let pairs = 0;
    for (let i = 0; i < system.nodes.length; i += 1) {
      for (let j = i + 1; j < system.nodes.length; j += 1) {
        const path = shortestPath(system, i, j);
        if (!Number.isFinite(path.distance)) continue;
        efficiency += 1 / (1 + path.distance);
        pairs += 1;
      }
    }
    efficiency = pairs ? efficiency / pairs : 0;

    const adjacency = Array.from({ length: system.nodes.length }, () => []);
    for (const edge of system.edges) {
      if (edge.weight < 0.2) continue;
      adjacency[edge.a].push(edge.b);
      adjacency[edge.b].push(edge.a);
    }

    const visited = new Set();
    let largest = 0;
    for (let start = 0; start < adjacency.length; start += 1) {
      if (visited.has(start)) continue;
      const stack = [start];
      visited.add(start);
      let count = 0;
      while (stack.length) {
        const u = stack.pop();
        count += 1;
        for (const v of adjacency[u]) {
          if (visited.has(v)) continue;
          visited.add(v);
          stack.push(v);
        }
      }
      largest = Math.max(largest, count);
    }
    const robustness = largest / system.nodes.length; // Thresholded connectivity; not a failure-resilience measurement.
    const score = efficiency - 0.22 * cost + 0.18 * robustness;
    return { cost, efficiency, robustness, score };
  }

  function update(dt) {
    if (mode === 'trace') {
      updateTrace(traceSystems[0], dt);
      updateTrace(traceSystems[1], dt);
    } else if (mode === 'alignment') {
      updateAlignment(alignmentSystems[0], dt, true);
      updateAlignment(alignmentSystems[1], dt, false);
    } else {
      updateNetwork(networkSystems[0], dt);
      updateNetwork(networkSystems[1], dt);
    }
  }

  function drawHeader() {
    const meta = MODES[mode];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(164, 171, 188, 0.9)';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText(meta.title, width / 2, 28);

    ctx.fillStyle = '#e8ecf4';
    ctx.font = '600 17px SFMono-Regular, Consolas, monospace';
    if(showMeasurements())ctx.fillText(meta.formula, width / 2, 55);
    else{ctx.font='500 14px system-ui';ctx.fillText({trace:'A path becomes easier to follow.',alignment:'Neighbours begin to move together.',network:'Some routes grow stronger than others.'}[mode],width/2,55);}

    ctx.fillStyle = 'rgba(79, 156, 247, 0.9)';
    ctx.font = '11px SFMono-Regular, Consolas, monospace';
    ctx.fillText(showMeasurements()?meta.note:'A shared pattern, different underlying systems.',width / 2, 78);

    const left = panelBounds(0);
    const right = panelBounds(1);
    ctx.fillStyle = 'rgba(226, 232, 240, 0.76)';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText(meta.left, left.x + left.w / 2, 103);
    ctx.fillText(meta.right, right.x + right.w / 2, 103);

    ctx.beginPath();
    ctx.moveTo(width / 2, 96);
    ctx.lineTo(width / 2, height - 32);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function quadraticPoint(x0, y0, cx, cy, x1, y1, t) {
    const inv = 1 - t;
    return {
      x: inv * inv * x0 + 2 * inv * t * cx + t * t * x1,
      y: inv * inv * y0 + 2 * inv * t * cy + t * t * y1
    };
  }

  function drawTraceSystem(system, bounds, human) {
    const x0 = bounds.x + bounds.w * 0.12;
    const x1 = bounds.x + bounds.w * 0.88;
    const y = bounds.y + bounds.h * 0.53;
    const curve = Math.min(70, bounds.h * 0.24);

    for (let route = 0; route < 2; route += 1) {
      const cy = y + (route === 0 ? -curve : curve);
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.quadraticCurveTo((x0 + x1) / 2, cy, x1, y);
      const intensity = Math.min(1, system.traces[route] / 1.1);
      ctx.strokeStyle = human
        ? 'rgba(139, 92, 246, ' + (0.14 + intensity * 0.72) + ')'
        : 'rgba(79, 156, 247, ' + (0.14 + intensity * 0.72) + ')';
      ctx.lineWidth = 1.2 + intensity * 5.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(164, 171, 188, 0.58)';
      ctx.font = '10px SFMono-Regular, Consolas, monospace';
      ctx.textAlign = 'center';
      if(showMeasurements())ctx.fillText('T' + (route + 1) + ' ' + system.traces[route].toFixed(2), (x0 + x1) / 2, cy + (route === 0 ? -11 : 17));
    }

    for (const agent of system.agents) {
      const cy = y + (agent.route === 0 ? -curve : curve);
      const p = quadraticPoint(x0, y, (x0 + x1) / 2, cy, x1, y, agent.phase);
      ctx.fillStyle = human ? 'rgba(196, 181, 253, 0.9)' : 'rgba(147, 197, 253, 0.95)';
      if (human) {
        ctx.fillRect(p.x - 2.1, p.y - 2.1, 4.2, 4.2);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = 'rgba(226, 232, 240, 0.84)';
    ctx.beginPath();
    ctx.arc(x0, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x1, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(164, 171, 188, 0.7)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(human ? 'source' : 'nest', x0, y + 23);
    ctx.fillText(human ? 'shared target' : 'food', x1, y + 23);
  }

  function drawArrow(x, y, theta, size, color) {
    const tx = x + Math.cos(theta) * size;
    const ty = y + Math.sin(theta) * size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const wing = 4;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - Math.cos(theta - 0.55) * wing, ty - Math.sin(theta - 0.55) * wing);
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - Math.cos(theta + 0.55) * wing, ty - Math.sin(theta + 0.55) * wing);
    ctx.stroke();
  }

  function drawAlignmentSystem(system, bounds, human) {
    const pad = 20;
    const order = circularOrder(system.agents);

    if (human) {
      const threshold = Math.min(bounds.w, bounds.h) * 0.22;
      for (let i = 0; i < system.agents.length; i += 1) {
        const a = system.agents[i];
        const ax = bounds.x + pad + a.anchorX * (bounds.w - pad * 2);
        const ay = bounds.y + pad + a.anchorY * (bounds.h - pad * 2);
        for (let j = i + 1; j < system.agents.length; j += 1) {
          const b = system.agents[j];
          const bx = bounds.x + pad + b.anchorX * (bounds.w - pad * 2);
          const by = bounds.y + pad + b.anchorY * (bounds.h - pad * 2);
          if (Math.hypot(ax - bx, ay - by) > threshold) continue;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.055)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    for (const agent of system.agents) {
      const px = bounds.x + pad + (human ? agent.anchorX : agent.x) * (bounds.w - pad * 2);
      const py = bounds.y + pad + (human ? agent.anchorY : agent.y) * (bounds.h - pad * 2);
      drawArrow(px, py, agent.theta, human ? 9 : 11, human ? 'rgba(196, 181, 253, 0.78)' : 'rgba(147, 197, 253, 0.82)');
      if (human) {
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.72)';
        ctx.fill();
      }
    }

    ctx.fillStyle = '#e8ecf4';
    ctx.font = '600 12px SFMono-Regular, Consolas, monospace';
    ctx.textAlign = 'left';
    if(showMeasurements())ctx.fillText('R = ' + order.toFixed(2), bounds.x + 12, bounds.y + 18);
  }

  function drawNetworkSystem(system, bounds, human) {
    const pad = 24;
    const metrics = networkMetrics(system);

    for (const edge of system.edges) {
      const a = system.nodes[edge.a];
      const b = system.nodes[edge.b];
      const ax = bounds.x + pad + a.x * (bounds.w - pad * 2);
      const ay = bounds.y + pad + a.y * (bounds.h - pad * 2);
      const bx = bounds.x + pad + b.x * (bounds.w - pad * 2);
      const by = bounds.y + pad + b.y * (bounds.h - pad * 2);
      const intensity = Math.min(1, edge.weight / 1.05);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = human
        ? 'rgba(139, 92, 246, ' + (0.05 + intensity * 0.68) + ')'
        : 'rgba(79, 156, 247, ' + (0.05 + intensity * 0.68) + ')';
      ctx.lineWidth = 0.6 + intensity * (human ? 3.6 : 5.4);
      ctx.stroke();
    }

    for (const node of system.nodes) {
      const x = bounds.x + pad + node.x * (bounds.w - pad * 2);
      const y = bounds.y + pad + node.y * (bounds.h - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, human ? 3.6 : 4.8, 0, Math.PI * 2);
      ctx.fillStyle = human ? 'rgba(221, 214, 254, 0.9)' : 'rgba(191, 219, 254, 0.9)';
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
    ctx.font = '11px SFMono-Regular, Consolas, monospace';
    ctx.textAlign = 'left';
    if(showMeasurements())ctx.fillText('E ' + metrics.efficiency.toFixed(2), bounds.x + 10, bounds.y + 16);
    if(showMeasurements())ctx.fillText('C ' + metrics.cost.toFixed(2), bounds.x + 10, bounds.y + 31);
    if(showMeasurements())ctx.fillText('B ' + metrics.robustness.toFixed(2), bounds.x + 10, bounds.y + 46);
    if(showMeasurements())ctx.fillText('J ' + metrics.score.toFixed(2), bounds.x + 10, bounds.y + 61);
  }

  function drawStats() {
    if (!stats) return;
    if (mode === 'trace') {
      const ant = traceSystems[0].traces;
      const human = traceSystems[1].traces;
      stats.textContent =
        'same update rule · ants T₁/T₂ ' + ant[0].toFixed(2) + '/' + ant[1].toFixed(2) +
        ' · humans T₁/T₂ ' + human[0].toFixed(2) + '/' + human[1].toFixed(2);
    } else if (mode === 'alignment') {
      stats.textContent =
        'same order parameter · flock R ' + circularOrder(alignmentSystems[0].agents).toFixed(2) +
        ' · human toy network R ' + circularOrder(alignmentSystems[1].agents).toFixed(2);
    } else {
      const bio = networkMetrics(networkSystems[0]);
      const human = networkMetrics(networkSystems[1]);
      stats.textContent =
        'same toy metrics · Physarum-like J ' + bio.score.toFixed(2) +
        ' · infrastructure J ' + human.score.toFixed(2) +
        ' · J is illustrative, not a biological law';
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(width, height) * 0.7);
    gradient.addColorStop(0, 'rgba(79, 156, 247, 0.035)');
    gradient.addColorStop(1, 'rgba(8, 11, 18, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawHeader();
    const left = panelBounds(0);
    const right = panelBounds(1);

    if (mode === 'trace') {
      drawTraceSystem(traceSystems[0], left, false);
      drawTraceSystem(traceSystems[1], right, true);
    } else if (mode === 'alignment') {
      drawAlignmentSystem(alignmentSystems[0], left, false);
      drawAlignmentSystem(alignmentSystems[1], right, true);
    } else {
      drawNetworkSystem(networkSystems[0], left, false);
      drawNetworkSystem(networkSystems[1], right, true);
    }

    drawStats();
  }

  function setMode(nextMode) {
    if (!MODES[nextMode]) return;
    mode = nextMode;
    resetStates();

    controls['pattern-trace']?.classList.toggle('active', mode === 'trace');
    controls['pattern-alignment']?.classList.toggle('active', mode === 'alignment');
    controls['pattern-network']?.classList.toggle('active', mode === 'network');

    draw();
  }

  controls['pattern-trace']?.addEventListener('click', () => setMode('trace'));
  controls['pattern-alignment']?.addEventListener('click', () => setMode('alignment'));
  controls['pattern-network']?.addEventListener('click', () => setMode('network'));

  function loop(now) {
    animationFrame = null;
    if (!isActive) return;
    animationFrame = requestAnimationFrame(loop);

    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    if (!reduceMotion.matches) update(dt);
    draw();
  }

  function init() {
    resetStates();
    resize();
    setMode('trace');
    draw();
  }

  document.addEventListener('measurements-change',draw);
  init();

  return {
    init,
    resize,
    renderStatic:draw,
    destroy(){isActive=false;if(animationFrame)cancelAnimationFrame(animationFrame);document.removeEventListener('measurements-change',draw);},
    activate() {
      isActive = true;
      lastTime = performance.now();
      if(!animationFrame)animationFrame=requestAnimationFrame(loop);
    },
    deactivate() {
      isActive = false;
      if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=null;
    }
  };
}
