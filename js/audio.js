const button = document.getElementById('toggle-soundscape');
const volumeInput = document.getElementById('ambient-volume');
const volumeControl = document.getElementById('ambient-volume-control');

if (button instanceof HTMLButtonElement) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const SCORE_VERSION = 'tonal-score-v2';
  const CHORD_INTERVAL_MS = 15_000;
  const CHORD_DURATION_SECONDS = 23;
  const CHORDS = [
    [146.83, 220, 329.63, 369.99], // Dmaj(add9)
    [123.47, 185, 220, 293.66],    // Bm7
    [98, 146.83, 220, 246.94],     // Gmaj(add9)
    [110, 164.81, 246.94, 293.66], // Asus4(add9)
  ];

  let context = null;
  let master = null;
  let analyser = null;
  let scoreBus = null;
  let effectsInput = null;
  let playing = false;
  let chordTimer = null;
  let chordIndex = 0;
  let lastButtonSound = 0;
  const activeSources = new Set();

  const selectedVolume = () => {
    const raw = volumeInput instanceof HTMLInputElement ? Number(volumeInput.value) : 55;
    return Math.min(1, Math.max(0, raw / 100));
  };

  // Enough headroom for small speakers, with a gentle low-to-mid range.
  const targetGain = () => 0.34 * Math.pow(selectedVolume(), 1.45);

  const updateButton = () => {
    button.setAttribute('aria-pressed', String(playing));
    button.classList.toggle('playing', playing);
    button.dataset.audioState = playing ? 'running' : 'stopped';
    const label = button.querySelector('.audio-label');
    if (label) label.textContent = playing ? 'Soundtrack on' : 'Soundtrack off';
    if (volumeControl instanceof HTMLElement) volumeControl.hidden = !playing;
  };

  const connectWithOptionalPan = (source, destination, panValue) => {
    if (typeof context.createStereoPanner !== 'function') {
      source.connect(destination);
      return;
    }

    const panner = context.createStereoPanner();
    panner.pan.value = panValue;
    source.connect(panner);
    panner.connect(destination);
  };

  const createDelaySpace = (input, destination) => {
    const dry = context.createGain();
    const wet = context.createGain();
    const delayA = context.createDelay(1);
    const delayB = context.createDelay(1);
    const feedbackA = context.createGain();
    const feedbackB = context.createGain();
    const toneA = context.createBiquadFilter();
    const toneB = context.createBiquadFilter();

    dry.gain.value = 0.82;
    wet.gain.value = 0.24;
    delayA.delayTime.value = 0.31;
    delayB.delayTime.value = 0.47;
    feedbackA.gain.value = 0.19;
    feedbackB.gain.value = 0.14;
    toneA.type = 'lowpass';
    toneB.type = 'lowpass';
    toneA.frequency.value = 1650;
    toneB.frequency.value = 1380;

    input.connect(dry);
    dry.connect(destination);

    input.connect(delayA);
    delayA.connect(toneA);
    toneA.connect(wet);
    toneA.connect(feedbackA);
    feedbackA.connect(delayA);

    input.connect(delayB);
    delayB.connect(toneB);
    toneB.connect(wet);
    toneB.connect(feedbackB);
    feedbackB.connect(delayB);

    wet.connect(destination);
  };

  const createSoundtrack = () => {
    if (!AudioContextClass) return;

    context = new AudioContextClass();
    master = context.createGain();
    analyser = context.createAnalyser();
    scoreBus = context.createGain();
    effectsInput = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const highpass = context.createBiquadFilter();
    const lowpass = context.createBiquadFilter();

    master.gain.value = 0.0001;
    scoreBus.gain.value = 0.88;
    effectsInput.gain.value = 1;
    analyser.fftSize = 256;

    compressor.threshold.value = -14;
    compressor.knee.value = 10;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.65;
    highpass.type = 'highpass';
    highpass.frequency.value = 58;
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1850;
    lowpass.Q.value = 0.25;

    scoreBus.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(effectsInput);
    createDelaySpace(effectsInput, master);
    master.connect(analyser);
    analyser.connect(compressor);
    compressor.connect(context.destination);
  };

  const registerSource = (source) => {
    activeSources.add(source);
    source.addEventListener('ended', () => activeSources.delete(source), { once: true });
  };

  const playPadVoice = (frequency, index, startTime, duration) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const detune = context.createOscillator();
    const detuneDepth = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    filter.type = 'lowpass';
    filter.frequency.value = 1200 + (index * 170);
    filter.Q.value = 0.35;

    const peak = [0.055, 0.041, 0.03, 0.022][index] ?? 0.018;
    const attackEnd = startTime + 4.6 + (index * 0.35);
    const releaseStart = startTime + duration - 7.2;
    const endTime = startTime + duration;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, attackEnd);
    gain.gain.setValueAtTime(peak, releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    detune.type = 'sine';
    detune.frequency.value = 0.018 + (index * 0.004);
    detuneDepth.gain.value = 1.1 + (index * 0.3);
    detune.connect(detuneDepth);
    detuneDepth.connect(oscillator.detune);

    oscillator.connect(filter);
    filter.connect(gain);
    connectWithOptionalPan(gain, scoreBus, [-0.34, 0.24, -0.08, 0.38][index] ?? 0);

    registerSource(oscillator);
    registerSource(detune);
    oscillator.start(startTime);
    detune.start(startTime);
    oscillator.stop(endTime + 0.1);
    detune.stop(endTime + 0.1);
  };

  const playChord = () => {
    if (!playing || !context || !scoreBus || context.state !== 'running') return;

    const now = context.currentTime + 0.04;
    const chord = CHORDS[chordIndex % CHORDS.length];
    chordIndex = (chordIndex + 1) % CHORDS.length;
    chord.forEach((frequency, index) => playPadVoice(frequency, index, now, CHORD_DURATION_SECONDS));
  };

  const scheduleScore = () => {
    window.clearInterval(chordTimer);
    if (!playing) return;
    playChord();
    chordTimer = window.setInterval(playChord, CHORD_INTERVAL_MS);
  };

  const stopScoreSources = () => {
    if (!context) return;
    const now = context.currentTime;
    activeSources.forEach((source) => {
      try {
        source.stop(now + 0.9);
      } catch {
        // The source may already be scheduled to stop.
      }
    });
    activeSources.clear();
  };

  const playActivationCue = () => {
    if (!context || !master || context.state !== 'running') return;
    const now = context.currentTime;

    [440, 554.37, 659.25].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + (index * 0.085);
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.026 - (index * 0.004), start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.52);
      oscillator.connect(gain);
      connectWithOptionalPan(gain, master, [-0.18, 0, 0.18][index]);
      oscillator.start(start);
      oscillator.stop(start + 0.55);
    });
  };

  button.addEventListener('click', async () => {
    if (!context) createSoundtrack();
    if (!context || !master) {
      button.disabled = true;
      button.setAttribute('aria-label', 'Ambient soundtrack is unavailable in this browser');
      return;
    }

    if (!playing) {
      await context.resume();
      playing = true;
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain()), now + 1.5);
      playActivationCue();
      scheduleScore();
    } else {
      playing = false;
      window.clearInterval(chordTimer);
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      stopScoreSources();
      window.setTimeout(() => {
        if (!playing && context?.state === 'running') context.suspend();
      }, 1200);
    }

    updateButton();
  });

  if (volumeInput instanceof HTMLInputElement) {
    volumeInput.addEventListener('input', () => {
      volumeInput.setAttribute('aria-valuetext', `${volumeInput.value}%`);
      if (!playing || !context || !master) return;
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.linearRampToValueAtTime(targetGain(), context.currentTime + 0.12);
    });
    volumeInput.setAttribute('aria-valuetext', `${volumeInput.value}%`);
  }

  // Keep controls quiet. Continuous slider ticks were intrusive during reading.
  window.playInteractionSound = (type = 'click') => {
    if (type === 'slider' || !playing || !context || context.state !== 'running' || !master) return;
    const nowMs = performance.now();
    if (nowMs - lastButtonSound < 180) return;
    lastButtonSound = nowMs;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(392, now);
    oscillator.frequency.exponentialRampToValueAtTime(293.66, now + 0.12);
    gain.gain.setValueAtTime(0.003, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
  };

  document.addEventListener('visibilitychange', () => {
    if (!context || !playing) return;
    if (document.hidden && context.state === 'running') {
      window.clearInterval(chordTimer);
      context.suspend();
    } else if (!document.hidden && context.state === 'suspended') {
      context.resume().then(scheduleScore);
    }
  });

  window.__EMERGENT_AUDIO_DEBUG__ = {
    getState: () => ({
      playing,
      contextState: context?.state ?? 'not-created',
      gain: master?.gain.value ?? 0,
      targetGain: targetGain(),
      volume: selectedVolume(),
      scoreVersion: SCORE_VERSION,
      noiseLayer: false,
      activeSources: activeSources.size,
    }),
    getLevel: () => {
      if (!analyser || !playing) return 0;
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);
      return data.reduce((peak, value) => Math.max(peak, Math.abs(value - 128)), 0);
    },
  };

  updateButton();
}
