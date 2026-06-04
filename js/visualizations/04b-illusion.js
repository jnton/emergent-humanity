export function initIllusionOfSignificance(canvas, controls) {
  let isActive = false;
  let hasShifted = false;
  let timeElapsed = 0;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let animFrame;

  const numNodes = 100;
  let nodesA = [];
  let nodesB = [];

  const init = () => {
    hasShifted = false;
    timeElapsed = 0;
    
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1. Initialize Boids
    nodesA = [];
    nodesB = [];
    for (let i = 0; i < numNodes; i++) {
      const boid = {
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      };
      nodesA.push({...boid});
      nodesB.push({...boid});
    }

    if (controls['shift-node']) {
      controls['shift-node'].addEventListener('click', () => {
        if (hasShifted) return;
        hasShifted = true;
        
        if (window.playInteractionSound) window.playInteractionSound('click');

        // A tiny perturbation
        nodesB[0].x += 5;
        nodesB[0].y += 5;

        controls['shift-node'].textContent = "Observe Divergence";
        controls['shift-node'].disabled = true;
        controls['shift-node'].classList.add('disabled');
      });
    }

    if (!animFrame) {
      loop();
    }
  };

  // Boids / Flocking Rules (Organic Complex System)
  const applyFlocking = (nodes) => {
    const visualRange = 50;
    const speedLimit = 1.2; // Slow, elegant movement
    const centeringFactor = 0.005; // Cohesion
    const avoidFactor = 0.05; // Separation
    const matchingFactor = 0.05; // Alignment
    const boundaryRadius = 150;

    nodes.forEach(boid => {
      let centerX = 0, centerY = 0;
      let moveX = 0, moveY = 0;
      let avgDx = 0, avgDy = 0;
      let numNeighbors = 0;

      nodes.forEach(otherBoid => {
        if (boid.id !== otherBoid.id) {
          const dx = boid.x - otherBoid.x;
          const dy = boid.y - otherBoid.y;
          const dist = Math.hypot(dx, dy);

          if (dist < visualRange) {
            centerX += otherBoid.x;
            centerY += otherBoid.y;
            avgDx += otherBoid.vx;
            avgDy += otherBoid.vy;
            numNeighbors += 1;
          }

          if (dist < 20) {
            moveX += dx;
            moveY += dy;
          }
        }
      });

      if (numNeighbors > 0) {
        centerX = centerX / numNeighbors;
        centerY = centerY / numNeighbors;
        avgDx = avgDx / numNeighbors;
        avgDy = avgDy / numNeighbors;

        boid.vx += (centerX - boid.x) * centeringFactor;
        boid.vy += (centerY - boid.y) * centeringFactor;
        boid.vx += (avgDx - boid.vx) * matchingFactor;
        boid.vy += (avgDy - boid.vy) * matchingFactor;
      }

      boid.vx += moveX * avoidFactor;
      boid.vy += moveY * avoidFactor;

      // Soft boundary so they stay on screen
      const distFromCenter = Math.hypot(boid.x, boid.y);
      if (distFromCenter > boundaryRadius) {
        boid.vx -= (boid.x / distFromCenter) * 0.05;
        boid.vy -= (boid.y / distFromCenter) * 0.05;
      }

      // Add a tiny bit of elegant swirling to keep the flock rotating
      boid.vx += -boid.y * 0.001;
      boid.vy += boid.x * 0.001;

      // Limit speed
      const speed = Math.hypot(boid.vx, boid.vy);
      if (speed > speedLimit) {
        boid.vx = (boid.vx / speed) * speedLimit;
        boid.vy = (boid.vy / speed) * speedLimit;
      }
    });

    // Apply velocities
    nodes.forEach(boid => {
      boid.x += boid.vx;
      boid.y += boid.vy;
    });
  };

  const loop = () => {
    animFrame = requestAnimationFrame(loop);
    if (!isActive) return;

    timeElapsed += 1;

    // Timeline A is standard
    applyFlocking(nodesA);

    // Timeline B
    if (!hasShifted) {
      // Force exact sync
      nodesB.forEach((n, i) => {
        n.x = nodesA[i].x; n.y = nodesA[i].y;
        n.vx = nodesA[i].vx; n.vy = nodesA[i].vy;
      });
    } else {
      // B runs its own physics. 
      // Because Flocking is a complex, sensitive system, the tiny shift naturally cascades.
      applyFlocking(nodesB);
    }

    draw();
  };

  const formatTime = (frames) => {
    const totalSeconds = Math.floor(frames / 60);
    const ms = Math.floor((frames % 60) * 16.66);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    const msStr = ms.toString().padStart(3, '0').substring(0, 2);
    return `T + ${m}:${s}:${msStr}`;
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    
    // Time UI
    ctx.save();
    ctx.translate(width / 2, 40);
    ctx.beginPath();
    ctx.roundRect(-80, 0, 160, 30, 4);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(79, 156, 247, 0.3)';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4f9cf7';
    ctx.font = '500 14px "JetBrains Mono", "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatTime(timeElapsed), 0, 15);
    ctx.restore();

    ctx.save();
    ctx.translate(width / 2, height / 2);
    
    const scale = Math.min(1, width / 1200);
    ctx.scale(scale, scale);

    // Draw A
    ctx.save();
    ctx.translate(-width * 0.25, 0); 
    drawNetwork(nodesA, null);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Timeline A (Control Flock)', 0, 220);
    ctx.restore();

    // Draw B
    ctx.save();
    ctx.translate(width * 0.25, 0);
    drawNetwork(nodesB, nodesA);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px Inter, sans-serif';
    
    let divergedNodes = 0;
    if (hasShifted) {
      nodesB.forEach((n, i) => {
        if (Math.hypot(n.x - nodesA[i].x, n.y - nodesA[i].y) > 20) divergedNodes++;
      });
    }
    
    if (hasShifted) {
       ctx.fillText(`Timeline B (Diverged Nodes: ${Math.floor((divergedNodes/numNodes)*100)}%)`, 0, 220);
    } else {
       ctx.fillText('Timeline B (Synchronized)', 0, 220);
    }
    ctx.restore();

    ctx.restore();
  };

  const drawNetwork = (nodes, referenceNodes) => {
    // Dynamic proximity links (draw lines between nearby boids to create a network web)
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 40) {
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
        }
      }
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw nodes
    nodes.forEach((n, i) => {
      let color = '#4f9cf7';
      let r = 2.5;
      
      // Calculate how far this node has drifted from its exact control counterpart
      if (referenceNodes && hasShifted) {
        const ref = referenceNodes[i];
        const dist = Math.hypot(n.x - ref.x, n.y - ref.y);
        
        if (dist > 80) {
          color = '#ef4444'; // Red
          r = 3.5;
        } else if (dist > 20) {
          color = '#f59e0b'; // Orange
          r = 3;
        } else if (dist > 5) {
          color = '#34d399'; // Green
        }
      }

      ctx.beginPath();
      ctx.moveTo(n.x + r, n.y);
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    // Highlight node 0 (the perturbed node)
    ctx.beginPath();
    ctx.arc(nodes[0].x, nodes[0].y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  init();

  return {
    init,
    activate: () => {
      isActive = true;
    },
    deactivate: () => {
      isActive = false;
      if (controls['shift-node']) {
        controls['shift-node'].textContent = "Shift One Node";
        controls['shift-node'].disabled = false;
        controls['shift-node'].classList.remove('disabled');
        hasShifted = false;
      }
    }
  };
}
