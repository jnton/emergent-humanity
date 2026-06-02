import { createNetworkEngine } from '../lib/network-engine.js';

export function initWhatsNext(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 100,
    linkDistance: 30,
    chargeStrength: -30,
  });

  let mode = 'independent'; // 'independent' or 'herding'
  let interval = null;

  engine.init = function() {
    engine.resize();
    
    // Custom network for collective intelligence
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    
    nodes.length = 0;
    links.length = 0;
    
    for(let i=0; i<100; i++) {
        nodes.push({
            id: i, state: 1, quality: 0.5, signal: 0,
            radius: 3, community: null,
            x: canvas.clientWidth/2 + (Math.random()-0.5)*200,
            y: canvas.clientHeight/2 + (Math.random()-0.5)*200
        });
    }
    
    for(let i=0; i<100; i++) {
        for(let j=0; j<2; j++) {
            const target = Math.floor(Math.random()*100);
            if(i !== target) {
                links.push({
                    source: i, target: target, type: 'default', weight: 0.5, active: true
                });
            }
        }
    }
    
    engine.rebuildSimulation();

    function updateWisdom() {
      if (!engine.isActive) return;
      const trueState = 1; // target truth
      let correctCount = 0;

      if (mode === 'independent') {
        // Independence: Each node guesses with slightly better than 50% accuracy
        nodes.forEach(n => {
          const guess = Math.random() < 0.55 ? 1 : 0;
          if (guess === trueState) {
            correctCount++;
            n.signal = 1;
            n.signalType = 'signal'; // green/blue glow
          } else {
            n.signal = 1;
            n.signalType = 'noise'; // red glow
          }
          // fade out
          setTimeout(() => { if (n) n.signal = 0; }, 800);
        });
      } else {
        // Herding: Nodes copy a few leaders who might be wrong
        const leaderGuess = Math.random() < 0.55 ? 1 : 0; // The leader
        nodes.forEach(n => {
          // high correlation
          const guess = Math.random() < 0.9 ? leaderGuess : (Math.random() < 0.5 ? 1 : 0);
          if (guess === trueState) {
            correctCount++;
            n.signal = 1;
            n.signalType = 'signal';
          } else {
            n.signal = 1;
            n.signalType = 'noise';
          }
          setTimeout(() => { if (n) n.signal = 0; }, 800);
        });
      }

      // Update UI stats
      const statsEl = document.getElementById('stats-whats-next');
      if (statsEl) {
        const accuracy = (correctCount / nodes.length * 100).toFixed(0);
        statsEl.innerHTML = `Collective Accuracy: ${accuracy}%`;
      }
    }

    if (interval) clearInterval(interval);
    interval = setInterval(updateWisdom, 1000);

    if (controls['mode-independent']) {
      controls['mode-independent'].addEventListener('click', () => {
        mode = 'independent';
      });
    }
    if (controls['mode-herding']) {
      controls['mode-herding'].addEventListener('click', () => {
        mode = 'herding';
      });
    }
  };

  const origDestroy = engine.destroy;
  engine.destroy = function() {
    if (interval) clearInterval(interval);
    origDestroy();
  };

  engine.init();
  return engine;
}
