// ==========================================================================
// Network Engine — Shared D3 force simulation + canvas rendering
// Used by all visualization modules.
// ==========================================================================

/**
 * Creates a network engine attached to a canvas element.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {object} opts
 * @param {number} [opts.nodeCount=80]
 * @param {number} [opts.linkDistance=50]
 * @param {number} [opts.chargeStrength=-70]
 * @param {boolean} [opts.enableDrag=true]
 * @param {Function} [opts.onNodeClick] - callback(node) when a node is clicked (not dragged)
 * @param {Function} [opts.onTick] - callback(engine) on each simulation tick
 * @returns {object} NetworkEngine
 */
export function createNetworkEngine(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let simulation = null;
  let nodes = [];
  let links = [];
  let animationFrame = null;
  let isActive = false;
  let draggedNode = null;
  let interactionSetup = false;

  // Track click vs drag
  let pointerDownPos = null;

  const config = {
    nodeCount: opts.nodeCount ?? 80,
    linkDistance: opts.linkDistance ?? 50,
    chargeStrength: opts.chargeStrength ?? -70,
    enableDrag: opts.enableDrag !== false,
    onNodeClick: opts.onNodeClick ?? null,
    onTick: opts.onTick ?? null,
  };

  // Colors (from CSS tokens)
  const colors = {
    nodeInactive: '#2a3244',
    nodeActive: '#4f9cf7',
    nodeGlow: 'rgba(79, 156, 247, 0.2)',
    edgeDefault: '#1a2234',
    edgeActive: 'rgba(79, 156, 247, 0.35)',
    edgeStrong: 'rgba(167, 139, 250, 0.6)', // purple-400 for strong ties
    edgeWeak: 'rgba(79, 156, 247, 0.2)',    // blue-400 for weak ties
    edgeBridge: 'rgba(234, 179, 8, 0.7)',   // yellow-500 for bridges
    nodeDanger: '#ef4444',                  // red-500
    dangerGlow: 'rgba(239, 68, 68, 0.25)',
    nodeSuccess: '#22c55e',                 // green-500 (cooperators)
    successGlow: 'rgba(34, 197, 94, 0.2)',
    signal: '#f59e0b',                      // amber-500
    signalGlow: 'rgba(245, 158, 11, 0.3)',
    noise: '#ef4444',
    // Community colors
    communities: [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#8b5cf6', // violet
      '#ec4899'  // pink
    ]
  };

  // ------ Initialization ------

  function resize() {
    const container = canvas.parentElement;
    if (!container) return;
    width = container.clientWidth;
    height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (simulation) {
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.3).restart();
    }
  }

  /**
   * Generates a scale-free network using Barabási–Albert preferential attachment.
   */
  function generateNetwork(nodeCount) {
    nodes = [];
    links = [];

    const count = nodeCount ?? config.nodeCount;

    for (let i = 0; i < count; i++) {
      nodes.push({
        id: i,
        state: 1,          // 1 = alive/active, 0 = dead
        quality: 0.5,      // 0..1 quality metric
        signal: 0,         // signal strength (for propagation viz)
        signalType: null,  // 'signal' | 'noise' | null
        radius: 4 + Math.random() * 3,
        degree: 0,
        community: null,   // integer ID of community
        strategy: null,    // 'cooperator' | 'defector' | null
      });
    }

    // Preferential attachment: each new node connects to m existing nodes
    // with probability proportional to their degree
    const m = 2; // edges per new node
    // Seed: fully connect first m+1 nodes
    for (let i = 0; i <= m && i < count; i++) {
      for (let j = i + 1; j <= m && j < count; j++) {
        links.push({ 
          source: i, target: j, 
          type: 'default', // 'strong' | 'weak' | 'bridge' | 'default'
          weight: 1.0,     // 0..1
          active: true,    // for temporal networks
          phase: Math.random() * Math.PI * 2 // temporal phase
        });
        nodes[i].degree++;
        nodes[j].degree++;
      }
    }

    for (let i = m + 1; i < count; i++) {
      const targets = new Set();
      const totalDegree = nodes.slice(0, i).reduce((s, n) => s + Math.max(n.degree, 1), 0);

      while (targets.size < m) {
        let r = Math.random() * totalDegree;
        for (let j = 0; j < i; j++) {
          r -= Math.max(nodes[j].degree, 1);
          if (r <= 0) {
            targets.add(j);
            break;
          }
        }
      }

      for (const t of targets) {
        links.push({ 
          source: i, target: t,
          type: 'default',
          weight: 1.0,
          active: true,
          phase: Math.random() * Math.PI * 2
        });
        nodes[i].degree++;
        nodes[t].degree++;
      }
    }

    return { nodes, links };
  }

  function buildSimulation() {
    if (simulation) simulation.stop();

    simulation = d3.forceSimulation(nodes)
      // Custom link distance based on type/weight
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
        if (d.type === 'strong') return config.linkDistance * 0.5;
        if (d.type === 'bridge') return config.linkDistance * 2;
        return config.linkDistance;
      }).strength(d => (d.type === 'weak' ? 0.2 : 1.0) / Math.max(1, Math.min(d.source.degree || 1, d.target.degree || 1))))
      .force('charge', d3.forceManyBody().strength(config.chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 2))
      .velocityDecay(0.4);

    // Physics only — rendering is handled by the RAF loop
  }

  function init(nodeCount) {
    resize();
    generateNetwork(nodeCount);
    buildSimulation();
    if (config.enableDrag && !interactionSetup) setupInteraction();
    return engine;
  }

  // ------ Render Loop (decoupled from D3 simulation) ------

  function startRenderLoop() {
    if (animationFrame) return; // Already running
    function loop() {
      if (!isActive) {
        animationFrame = null;
        return;
      }
      render();
      animationFrame = requestAnimationFrame(loop);
    }
    animationFrame = requestAnimationFrame(loop);
  }

  function stopRenderLoop() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function render() {
    if (!isActive) return;

    ctx.clearRect(0, 0, width, height);

    const now = performance.now();

    // Render edges
    for (const link of links) {
      const s = link.source;
      const t = link.target;
      if (s.state === 0 || t.state === 0) continue;
      // Skip inactive temporal edges, unless they blink
      if (link.active === false) {
        // Temporal visualization logic — blink on phase
        const pulse = Math.sin(now * 0.005 + link.phase);
        if (pulse < 0.8) continue; // Only show briefly
      }

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);

      // Check signal propagation
      if (s.signal > 0 && t.signal > 0 && s.signalType && t.signalType) {
        const type = s.signalType === 'noise' || t.signalType === 'noise' ? 'noise' : 'signal';
        ctx.strokeStyle = type === 'noise'
          ? `rgba(239, 68, 68, ${Math.min(s.signal, t.signal) * 0.5})`
          : `rgba(79, 156, 247, ${Math.min(s.signal, t.signal) * 0.5})`;
        ctx.lineWidth = 2;
      } else if (s.signal > 0 || t.signal > 0) {
        const sig = Math.max(s.signal, t.signal);
        const type = (s.signal > t.signal ? s : t).signalType;
        ctx.strokeStyle = type === 'noise'
          ? `rgba(239, 68, 68, ${sig * 0.3})`
          : `rgba(79, 156, 247, ${sig * 0.3})`;
        ctx.lineWidth = 1.5;
      } else {
        // Edge type styling
        let baseAlpha = link.weight !== undefined ? link.weight : 1.0;
        if (link.active === false) baseAlpha *= 0.5; // Blink state

        if (link.type === 'strong') {
          ctx.strokeStyle = colors.edgeStrong.replace(/[\d.]+\)$/, `${baseAlpha})`);
          ctx.lineWidth = 1.5 + baseAlpha * 1.5;
        } else if (link.type === 'weak') {
          ctx.strokeStyle = colors.edgeWeak.replace(/[\d.]+\)$/, `${baseAlpha * 0.5})`);
          ctx.lineWidth = 0.8;
        } else if (link.type === 'bridge') {
          ctx.strokeStyle = colors.edgeBridge.replace(/[\d.]+\)$/, `${baseAlpha})`);
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = colors.edgeDefault.replace(/[\d.]+\)$/, `${baseAlpha * 0.8})`);
          ctx.lineWidth = 0.8;
        }
      }
      ctx.stroke();
    }

    // Render nodes
    for (const node of nodes) {
      if (node.state === 0) continue;

      const r = node.radius * (0.8 + node.quality * 0.4);

      // Glow for signal or strategy
      if (node.signal > 0.1) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        const glowColor = node.signalType === 'noise' ? colors.dangerGlow : colors.nodeGlow;
        ctx.fillStyle = glowColor.replace(/[\d.]+\)$/, `${node.signal * 0.4})`);
        ctx.fill();
      } else if (node.strategy === 'cooperator') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.successGlow;
        ctx.fill();
      } else if (node.strategy === 'defector') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.dangerGlow;
        ctx.fill();
      }

      // Node body
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

      if (node.signal > 0.1) {
        ctx.fillStyle = node.signalType === 'noise'
          ? lerpColor(colors.nodeInactive, colors.nodeDanger, node.signal)
          : lerpColor(colors.nodeInactive, colors.nodeActive, node.signal);
      } else if (node.strategy === 'cooperator') {
        ctx.fillStyle = colors.nodeSuccess;
      } else if (node.strategy === 'defector') {
        ctx.fillStyle = colors.nodeDanger;
      } else if (node.community !== null) {
        // Use community color
        const colorIdx = node.community % colors.communities.length;
        ctx.fillStyle = colors.communities[colorIdx];
      } else {
        // Quality-based color
        ctx.fillStyle = lerpColor(colors.nodeInactive, colors.nodeActive, node.quality * 0.6);
      }
      ctx.fill();

      // Quality ring or Bridge indicator
      if (node.isBroker) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = colors.edgeBridge;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (node.quality > 0.7) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79, 156, 247, ${(node.quality - 0.7) * 1.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (config.onTick) config.onTick(engine);
  }

  // ------ Interaction ------

  function setupInteraction() {
    interactionSetup = true;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
  }

  function findNode(x, y) {
    let closest = null;
    let minDist = 25;
    for (const node of nodes) {
      if (node.state === 0) continue;
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < minDist) {
        minDist = dist;
        closest = node;
      }
    }
    return closest;
  }

  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerDownPos = { x, y };

    const node = findNode(x, y);
    if (node) {
      draggedNode = node;
      draggedNode.fx = draggedNode.x;
      draggedNode.fy = draggedNode.y;
      simulation.alphaTarget(0.3).restart();
      canvas.setPointerCapture(e.pointerId);
    }
  }

  function onPointerMove(e) {
    if (!draggedNode) return;
    const rect = canvas.getBoundingClientRect();
    draggedNode.fx = e.clientX - rect.left;
    draggedNode.fy = e.clientY - rect.top;
  }

  function onPointerUp(e) {
    if (draggedNode) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dist = pointerDownPos ? Math.hypot(x - pointerDownPos.x, y - pointerDownPos.y) : 999;

      // If didn't drag much, treat as click
      if (dist < 5 && config.onNodeClick) {
        config.onNodeClick(draggedNode);
      }

      draggedNode.fx = null;
      draggedNode.fy = null;
      simulation.alphaTarget(0);
      draggedNode = null;
    }
    pointerDownPos = null;
  }

  // ------ Public API ------

  function activate() {
    isActive = true;
    if (simulation) simulation.alpha(0.3).restart();
    startRenderLoop();
  }

  function deactivate() {
    isActive = false;
    if (simulation) simulation.stop();
    stopRenderLoop();
  }

  function getNodes() { return nodes; }
  function getLinks() { return links; }

  function addNode() {
    const id = nodes.length;
    const newNode = {
      id,
      state: 1,
      quality: 0.5,
      signal: 0,
      signalType: null,
      radius: 4 + Math.random() * 3,
      degree: 0,
      community: null,
      strategy: null,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    };
    nodes.push(newNode);

    // Connect to 2 random existing nodes (preferential attachment)
    const alive = nodes.filter(n => n.state === 1 && n.id !== id);
    const totalDeg = alive.reduce((s, n) => s + Math.max(n.degree, 1), 0);
    const targets = new Set();
    while (targets.size < Math.min(2, alive.length)) {
      let r = Math.random() * totalDeg;
      for (const n of alive) {
        r -= Math.max(n.degree, 1);
        if (r <= 0) {
          targets.add(n);
          break;
        }
      }
    }
    for (const t of targets) {
      links.push({ 
        source: newNode, target: t,
        type: 'default',
        weight: 1.0,
        active: true,
        phase: Math.random() * Math.PI * 2
      });
      newNode.degree++;
      t.degree++;
    }

    buildSimulation();
    return newNode;
  }

  function removeNode(node) {
    node.state = 0;
    // Don't remove from arrays — D3 references matter.
    // Just filter rendering by state.
    const affectedIds = new Set();
    for (const link of links) {
      const s = typeof link.source === 'object' ? link.source : nodes[link.source];
      const t = typeof link.target === 'object' ? link.target : nodes[link.target];
      if (s.id === node.id) affectedIds.add(t.id);
      if (t.id === node.id) affectedIds.add(s.id);
    }
    simulation.alpha(0.5).restart();
    return affectedIds;
  }

  function setAllQuality(q) {
    for (const node of nodes) {
      node.quality = q;
    }
  }

  function resetSignals() {
    for (const node of nodes) {
      node.signal = 0;
      node.signalType = null;
    }
  }

  function reset(nodeCount) {
    if (simulation) simulation.stop();
    init(nodeCount);
    activate();
  }

  function getStats() {
    const alive = nodes.filter(n => n.state === 1);
    const activeLinks = links.filter(l => {
      const s = typeof l.source === 'object' ? l.source : nodes[l.source];
      const t = typeof l.target === 'object' ? l.target : nodes[l.target];
      return s.state === 1 && t.state === 1;
    });
    const avgDegree = alive.length > 0
      ? (activeLinks.length * 2 / alive.length).toFixed(1)
      : '0';

    return {
      nodes: alive.length,
      edges: activeLinks.length,
      avgDegree,
    };
  }

  function getSimulation() { return simulation; }

  function getAdjacency() {
    const adj = new Map();
    for (const node of nodes) {
      if (node.state === 1) adj.set(node.id, []);
    }
    for (const link of links) {
      const s = typeof link.source === 'object' ? link.source : nodes[link.source];
      const t = typeof link.target === 'object' ? link.target : nodes[link.target];
      if (s.state === 1 && t.state === 1) {
        adj.get(s.id)?.push(t);
        adj.get(t.id)?.push(s);
      }
    }
    return adj;
  }

  // --- New features ---

  function rebuildSimulation() {
    buildSimulation();
    simulation.alpha(0.3).restart();
  }

  function destroy() {
    isActive = false;
    if (simulation) simulation.stop();
    stopRenderLoop();
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
  }

  const engine = {
    init,
    resize,
    activate,
    deactivate,
    destroy,
    getNodes,
    getLinks,
    getSimulation,
    getAdjacency,
    getStats,
    addNode,
    removeNode,
    setAllQuality,
    resetSignals,
    reset,
    rebuildSimulation,
    colors,
  };

  return engine;
}

// ------ Utility ------

function lerpColor(c1, c2, t) {
  const hex = s => parseInt(s, 16);
  const r1 = hex(c1.slice(1, 3)), g1 = hex(c1.slice(3, 5)), b1 = hex(c1.slice(5, 7));
  const r2 = hex(c2.slice(1, 3)), g2 = hex(c2.slice(3, 5)), b2 = hex(c2.slice(5, 7));
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}
