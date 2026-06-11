import { createNetworkEngine } from '../lib/network-engine.js';

export function initExternalStorage(canvas, controls) {
  // ── State ──
  let epoch = 0; // 0=Bio, 1=Writing, 2=Press, 3=Instruments, 4=Cloud
  let packets = [];
  let artifacts = [];     // Stone tablets / books
  let instruments = [];   // Recording devices orbiting humans
  let cloudNode = null;
  let deathBursts = [];   // Visual bursts when nodes die & info is lost
  let infoLost = 0;
  let infoSaved = 0;
  let epochFlashAlpha = 0;
  let epochFlashText = '';

  const EPOCH_NAMES = [
    'Biological Memory',
    'Monuments & Writing',
    'The Printing Press',
    'Recording Instruments',
    'The Internet & Cloud'
  ];
  const EPOCH_SUBS = [
    'Information lives and dies with the node',
    'Information outlasts its creator',
    'Copies make information immortal',
    'Devices capture reality objectively',
    'Everything connects. Everyone has access.'
  ];

  // ── Engine ──
  const engine = createNetworkEngine(canvas, {
    nodeCount: 30,
    linkDistance: 55,
    chargeStrength: -90,   // spread nodes out
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;

      // ── Header: epoch label ──
      ctx.save();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(EPOCH_NAMES[epoch], 16, 24);
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.fillText(EPOCH_SUBS[epoch], 16, 40);
      ctx.restore();

      // ── Counters (top-right) ──
      ctx.save();
      ctx.textAlign = 'right';
      ctx.font = '12px Inter, sans-serif';
      if (infoLost > 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.fillText(`☠ Lost: ${infoLost}`, W - 16, 24);
      }
      if (infoSaved > 0) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
        ctx.fillText(`✦ Preserved: ${infoSaved}`, W - 16, 40);
      }
      ctx.restore();

      // ── Cloud connections (Epoch 4) ──
      if (epoch >= 4 && cloudNode) {
        ctx.save();
        ctx.lineWidth = 0.6;
        const t = performance.now() * 0.001;
        nodes.forEach(n => {
          if (n.state === 1 && !n.isArtifact && !n.isCloud) {
            const alpha = 0.06 + 0.04 * Math.sin(t + n.id);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(cloudNode.x, cloudNode.y);
            ctx.stroke();
          }
        });
        // Also connect instruments to cloud
        instruments.forEach(inst => {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
          ctx.beginPath();
          ctx.moveTo(inst.x, inst.y);
          ctx.lineTo(cloudNode.x, cloudNode.y);
          ctx.stroke();
        });
        ctx.restore();
      }

      // ── Draw Artifacts (stone tablets) ──
      if (epoch >= 1) {
        artifacts.forEach(a => {
          if (a.spawnT < 1) a.spawnT = Math.min(1, a.spawnT + 0.025);
          const s = easeOutBack(a.spawnT);

          ctx.save();
          ctx.translate(a.x, a.y);
          ctx.scale(s, s);

          // Stone tablet shape
          const tw = 18, th = 22;
          ctx.beginPath();
          roundRect(ctx, -tw/2, -th/2, tw, th, 3);

          // Glow if it has marks
          if (a.marks > 0) {
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 8 + a.marks * 2;
          }

          ctx.fillStyle = a.marks > 0
            ? `hsl(35, ${30 + a.marks * 10}%, ${18 + a.marks * 3}%)`
            : '#1e293b';
          ctx.fill();

          ctx.strokeStyle = a.marks > 0 ? '#d97706' : '#475569';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Draw marks (little lines on the tablet)
          if (a.marks > 0) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 1;
            for (let m = 0; m < Math.min(a.marks, 5); m++) {
              const my = -th/2 + 5 + m * 4;
              ctx.beginPath();
              ctx.moveTo(-tw/2 + 3, my);
              ctx.lineTo(tw/2 - 3, my);
              ctx.stroke();
            }
          }

          // Label
          ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.font = '8px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(epoch >= 2 ? '📜' : '🪨', 0, th/2 + 10);

          // Pulse ring on write
          if (a.pulse > 0) {
            a.pulse -= 0.03;
            ctx.beginPath();
            ctx.arc(0, 0, 15 + (1 - a.pulse) * 20, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(251, 191, 36, ${a.pulse})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          ctx.restore();
        });
      }

      // ── Draw Instruments (Epoch 3+) ──
      if (epoch >= 3) {
        for (let i = instruments.length - 1; i >= 0; i--) {
          const inst = instruments[i];
          const host = inst.host;

          // If host is dead, instrument persists but floats free
          if (host.state !== 1) {
            instruments.splice(i, 1);
            continue;
          }

          inst.angle += 0.03;
          const orbitR = host.radius + 10;
          inst.x = host.x + Math.cos(inst.angle) * orbitR;
          inst.y = host.y + Math.sin(inst.angle) * orbitR;

          if (inst.spawnT < 1) inst.spawnT = Math.min(1, inst.spawnT + 0.04);
          const s = easeOutBack(inst.spawnT);

          ctx.save();
          ctx.translate(inst.x, inst.y);
          ctx.scale(s, s);

          // Camera/lens shape: small filled circle with a ring
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#0ea5e9';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Inner "lens" dot
          ctx.beginPath();
          ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#bae6fd';
          ctx.fill();

          // Flash on capture
          if (inst.flashAlpha > 0) {
            inst.flashAlpha -= 0.05;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(186, 230, 253, ${inst.flashAlpha * 0.6})`;
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // ── Draw Cloud (Epoch 4) ──
      if (epoch >= 4 && cloudNode) {
        if (cloudNode.spawnT < 1) cloudNode.spawnT = Math.min(1, cloudNode.spawnT + 0.015);
        const s = easeOutBack(cloudNode.spawnT);

        ctx.save();
        ctx.translate(cloudNode.x, cloudNode.y);
        ctx.scale(s, s);

        // Outer glow
        const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, 45);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(-50, -50, 100, 100);

        // Cloud body
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#1e3a8a';
        ctx.fill();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Cloud symbol
        ctx.fillStyle = '#bfdbfe';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☁', 0, 1);

        // Pulse
        if (cloudNode.pulse > 0) {
          cloudNode.pulse -= 0.03;
          ctx.beginPath();
          ctx.arc(0, 0, 30 + (1 - cloudNode.pulse) * 35, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${cloudNode.pulse})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      }

      // ── Draw Packets ──
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (!p.source || !p.target) { packets.splice(i, 1); continue; }
        // Skip if target is dead human
        if (p.target.state !== undefined && p.target.state !== 1
            && !p.target.isArtifact && !p.target.isCloud) {
          packets.splice(i, 1); continue;
        }

        p.progress += p.speed || 0.025;

        if (p.progress >= 1) {
          handlePacketArrival(p, nodes);
          packets.splice(i, 1);
          continue;
        }

        // Interpolated position
        const sx = p.source.x ?? p.source.fx ?? 0;
        const sy = p.source.y ?? p.source.fy ?? 0;
        const tx = p.target.x ?? p.target.fx ?? 0;
        const ty = p.target.y ?? p.target.fy ?? 0;
        const x = sx + (tx - sx) * p.progress;
        const y = sy + (ty - sy) * p.progress;

        // Trail
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, p.isObjective ? 3 : 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.isObjective ? 8 : 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Small trail line
        const trailLen = 0.06;
        if (p.progress > trailLen) {
          const tx2 = sx + (tx - sx) * (p.progress - trailLen);
          const ty2 = sy + (ty - sy) * (p.progress - trailLen);
          ctx.beginPath();
          ctx.moveTo(tx2, ty2);
          ctx.lineTo(x, y);
          ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, '0.3)');
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Death Bursts ──
      for (let i = deathBursts.length - 1; i >= 0; i--) {
        const b = deathBursts[i];
        b.life -= 0.015;
        if (b.life <= 0) { deathBursts.splice(i, 1); continue; }

        ctx.save();
        // Expanding ring
        const radius = 10 + (1 - b.life) * 40;
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = b.preserved
          ? `rgba(34, 197, 94, ${b.life * 0.6})`
          : `rgba(239, 68, 68, ${b.life * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Scatter particles
        b.particles.forEach(pt => {
          const px = b.x + pt.vx * (1 - b.life) * 60;
          const py = b.y + pt.vy * (1 - b.life) * 60;
          ctx.beginPath();
          ctx.arc(px, py, 2 * b.life, 0, Math.PI * 2);
          ctx.fillStyle = b.preserved
            ? `rgba(34, 197, 94, ${b.life})`
            : `rgba(239, 68, 68, ${b.life})`;
          ctx.fill();
        });

        // Label
        if (b.life > 0.5) {
          ctx.fillStyle = b.preserved
            ? `rgba(34, 197, 94, ${(b.life - 0.5) * 2})`
            : `rgba(239, 68, 68, ${(b.life - 0.5) * 2})`;
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            b.preserved ? 'info preserved ✓' : 'info lost ✗',
            b.x, b.y - radius - 8
          );
        }
        ctx.restore();
      }

      // ── Epoch transition flash ──
      if (epochFlashAlpha > 0) {
        epochFlashAlpha -= 0.008;
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(epochFlashAlpha, 0.9)})`;
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(epochFlashText, W / 2, H / 2);
        ctx.restore();
      }

      // ── "Memory glow" on human nodes that have stored info ──
      nodes.forEach(n => {
        if (n.state === 1 && n.hasMemory && !n.isArtifact && !n.isCloud) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      });
    }
  });

  // ── Helpers ──

  function easeOutBack(t) {
    const c = 1.3;
    return 1 + (--t) * t * ((c + 1) * t + c);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function handlePacketArrival(p, nodes) {
    const t = p.target;
    if (t.isArtifact) {
      t.marks = (t.marks || 0) + 1;
      t.pulse = 1;
      infoSaved++;

      // Epoch 2+: Press duplication — clone to other artifacts
      if (epoch >= 2 && !p.isClone) {
        artifacts.forEach(other => {
          if (other !== t) {
            packets.push({
              source: t, target: other,
              progress: 0, speed: 0.04,
              color: '#fbbf24', isClone: true
            });
          }
        });
      }
    } else if (t.isCloud) {
      t.pulse = 1;
      infoSaved++;
      // Broadcast to a few random humans
      const alive = nodes.filter(n => n.state === 1 && !n.isArtifact && !n.isCloud);
      const sample = alive.sort(() => Math.random() - 0.5).slice(0, 4);
      sample.forEach(n => {
        packets.push({
          source: t, target: n,
          progress: 0, speed: 0.06,
          color: '#3b82f6'
        });
      });
    } else {
      // Human-to-human: mark memory
      t.hasMemory = true;
      t.pulse = 1;
    }
  }

  function createDeathBurst(x, y, preserved) {
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i + Math.random() * 0.3;
      particles.push({ vx: Math.cos(angle), vy: Math.sin(angle) });
    }
    deathBursts.push({ x, y, life: 1, preserved, particles });
  }

  // ── Epoch Setup ──

  function setupEpoch(e) {
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const alive = nodes.filter(n => n.state === 1 && !n.isArtifact && !n.isCloud);

    epochFlashText = EPOCH_NAMES[e];
    epochFlashAlpha = 1;

    if (e === 1) {
      // Spawn stone tablets around the periphery of the network
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
        const dist = 120 + Math.random() * 30;
        const a = {
          id: 'art' + i,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: 0, vy: 0,
          radius: 14,
          state: 1,
          isArtifact: true,
          marks: 0,
          pulse: 0,
          spawnT: 0
        };
        artifacts.push(a);
        nodes.push(a);

        // Link to 2 nearby humans
        const nearby = [...alive].sort((a2, b) => {
          const da = Math.hypot(a2.x - a.x, a2.y - a.y);
          const db = Math.hypot(b.x - a.x, b.y - a.y);
          return da - db;
        }).slice(0, 2);
        nearby.forEach(h => links.push({ source: a, target: h, type: 'default', weight: 0.5, active: true, phase: 0 }));
      }
    }

    if (e === 2) {
      // Add more artifacts (book copies)
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 / 4) * i + Math.PI / 4;
        const dist = 80 + Math.random() * 50;
        const a = {
          id: 'press' + i,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: 0, vy: 0,
          radius: 12,
          state: 1,
          isArtifact: true,
          marks: 0,
          pulse: 0,
          spawnT: 0
        };
        artifacts.push(a);
        nodes.push(a);

        const nearby = [...alive].sort((a2, b) => {
          const da = Math.hypot(a2.x - a.x, a2.y - a.y);
          const db = Math.hypot(b.x - a.x, b.y - a.y);
          return da - db;
        }).slice(0, 1);
        nearby.forEach(h => links.push({ source: a, target: h, type: 'default', weight: 0.3, active: true, phase: 0 }));
      }
    }

    if (e === 3) {
      // Give instruments to alive humans
      alive.forEach(h => {
        instruments.push({
          host: h,
          angle: Math.random() * Math.PI * 2,
          spawnT: 0,
          flashAlpha: 0,
          x: h.x, y: h.y
        });
      });
    }

    if (e === 4) {
      // Cloud node
      cloudNode = {
        id: 'cloud',
        x: W / 2, y: H * 0.15,
        vx: 0, vy: 0,
        radius: 28,
        state: 1,
        isCloud: true,
        pulse: 0,
        spawnT: 0,
        fx: W / 2,
        fy: H * 0.15
      };
      nodes.push(cloudNode);

      // Give instruments to any humans who don't have one
      alive.forEach(h => {
        if (!instruments.find(i => i.host === h)) {
          instruments.push({
            host: h,
            angle: Math.random() * Math.PI * 2,
            spawnT: 0,
            flashAlpha: 0,
            x: h.x, y: h.y
          });
        }
      });
    }

    engine.rebuildSimulation();
  }

  // ── Button Wiring ──

  const BUTTON_LABELS = [
    'Invent Writing & Monuments',
    'Invent the Printing Press',
    'Invent Recording Instruments',
    'Build the Internet & Cloud',
    'Final Epoch Reached'
  ];

  if (controls['invent']) {
    controls['invent'].addEventListener('click', () => {
      if (epoch < 4) {
        epoch++;
        setupEpoch(epoch);
        controls['invent'].textContent = BUTTON_LABELS[epoch];
        if (epoch === 4) controls['invent'].disabled = true;
      }
    });
  }

  // ── Init Override ──

  const defaultInit = engine.init.bind(engine);
  engine.init = function () {
    defaultInit();
    epoch = 0;
    packets = [];
    artifacts = [];
    instruments = [];
    cloudNode = null;
    deathBursts = [];
    infoLost = 0;
    infoSaved = 0;
    epochFlashAlpha = 0;

    if (controls['invent']) {
      controls['invent'].disabled = false;
      controls['invent'].textContent = BUTTON_LABELS[0];
    }

    if (engine.intervalId) clearInterval(engine.intervalId);

    // ── Main loop: spawn ideas, capture, kill ──
    engine.intervalId = setInterval(() => {
      const nodes = engine.getNodes();
      const alive = nodes.filter(n => n.state === 1 && !n.isArtifact && !n.isCloud);
      if (alive.length === 0) return;

      // ── 1. Subjective idea (human → human or human → artifact) ──
      if (Math.random() < 0.5) {
        const src = alive[Math.floor(Math.random() * alive.length)];
        src.hasMemory = true;
        src.pulse = 1;

        let target = null;
        let color = '#f59e0b';
        let speed = 0.025;

        // With artifacts available, sometimes write to them
        if (epoch >= 1 && artifacts.length > 0 && Math.random() < 0.35) {
          target = artifacts[Math.floor(Math.random() * artifacts.length)];
        } else {
          // Human to human
          const others = alive.filter(n => n !== src);
          if (others.length > 0) target = others[Math.floor(Math.random() * others.length)];
        }

        if (target) {
          packets.push({ source: src, target, progress: 0, color, speed });
        }
      }

      // ── 2. Objective capture (Epoch 3+) ──
      if (epoch >= 3 && instruments.length > 0 && Math.random() < 0.35) {
        const inst = instruments[Math.floor(Math.random() * instruments.length)];
        inst.flashAlpha = 1; // camera flash!

        let target = null;
        const color = 'rgba(56, 189, 248, 1)';
        let speed = 0.035;

        if (epoch >= 4 && cloudNode) {
          target = cloudNode;
          speed = 0.05;
        } else if (artifacts.length > 0) {
          target = artifacts[Math.floor(Math.random() * artifacts.length)];
        }

        if (target) {
          packets.push({
            source: inst, target,
            progress: 0,
            color: '#38bdf8',
            speed,
            isObjective: true
          });
        }
      }

      // ── 3. Death ──
      if (Math.random() < 0.25 && alive.length > 3) {
        const victim = alive[Math.floor(Math.random() * alive.length)];
        const hadMemory = victim.hasMemory;

        // Determine if info is preserved (artifacts exist)
        const preserved = epoch >= 1 && artifacts.some(a => a.marks > 0);

        createDeathBurst(victim.x, victim.y, preserved);

        if (hadMemory && !preserved) {
          infoLost++;
        } else if (hadMemory && preserved) {
          // Info was already on a tablet somewhere
        }

        engine.removeNode(victim);

        // Remove instruments attached to dead node
        instruments = instruments.filter(inst => inst.host !== victim);

        // New humans born later may get instruments
        setTimeout(() => {
          if (epoch >= 3) {
            const currentAlive = engine.getNodes().filter(n => n.state === 1 && !n.isArtifact && !n.isCloud);
            currentAlive.forEach(h => {
              if (!instruments.find(inst => inst.host === h)) {
                instruments.push({
                  host: h,
                  angle: Math.random() * Math.PI * 2,
                  spawnT: 0,
                  flashAlpha: 0,
                  x: h.x, y: h.y
                });
              }
            });
          }
        }, 1000);
      }
    }, 1200);
  };

  engine.init();
  return engine;
}
