const button = document.getElementById('toggle-soundscape');

if (button instanceof HTMLButtonElement) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let context = null;
  let master = null;
  let playing = false;
  let shimmerTimer = null;
  let lastSliderSound = 0;

  const updateButton = () => {
    button.setAttribute('aria-pressed', String(playing));
    button.classList.toggle('playing', playing);
    const label = button.querySelector('.audio-label');
    if (label) label.textContent = playing ? 'Soundscape on' : 'Soundscape off';
  };

  const connectWithOptionalPan = (source, destination, panValue, panLfoFrequency = 0) => {
    if (typeof context.createStereoPanner !== 'function') {
      source.connect(destination);
      return;
    }

    const panner = context.createStereoPanner();
    panner.pan.value = panValue;
    source.connect(panner);
    panner.connect(destination);

    if (panLfoFrequency > 0) {
      const panLfo = context.createOscillator();
      const panDepth = context.createGain();
      panLfo.type = 'sine';
      panLfo.frequency.value = panLfoFrequency;
      panDepth.gain.value = 0.18;
      panLfo.connect(panDepth);
      panDepth.connect(panner.pan);
      panLfo.start();
    }
  };

  const createAirTexture = (destination) => {
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate * 3, sampleRate);
    const data = buffer.getChannelData(0);
    let previous = 0;

    for (let index = 0; index < data.length; index += 1) {
      const white = (Math.random() * 2) - 1;
      previous = (previous * 0.985) + (white * 0.015);
      data[index] = previous * 2.2;
    }

    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = 1150;
    filter.Q.value = 0.45;
    gain.gain.value = 0.018;
    noise.connect(filter);
    filter.connect(gain);
    connectWithOptionalPan(gain, destination, 0.15, 0.008);
    noise.start();
  };

  const createSoundscape = () => {
    if (!AudioContextClass) return;

    context = new AudioContextClass();
    master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const highpass = context.createBiquadFilter();
    const lowpass = context.createBiquadFilter();
    const ambientBus = context.createGain();

    master.gain.value = 0.0001;
    compressor.threshold.value = -28;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.03;
    compressor.release.value = 0.8;
    highpass.type = 'highpass';
    highpass.frequency.value = 48;
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 980;
    lowpass.Q.value = 0.35;

    ambientBus.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(master);
    master.connect(compressor);
    compressor.connect(context.destination);

    const filterLfo = context.createOscillator();
    const filterDepth = context.createGain();
    filterLfo.type = 'sine';
    filterLfo.frequency.value = 0.021;
    filterDepth.gain.value = 210;
    filterLfo.connect(filterDepth);
    filterDepth.connect(lowpass.frequency);
    filterLfo.start();

    const voices = [
      { frequency: 73.42, gain: 0.15, type: 'sine', pan: -0.38, drift: 0.011 },
      { frequency: 110, gain: 0.075, type: 'sine', pan: 0.32, drift: 0.014 },
      { frequency: 146.83, gain: 0.045, type: 'triangle', pan: -0.08, drift: 0.009 },
      { frequency: 220, gain: 0.018, type: 'sine', pan: 0.48, drift: 0.017 },
    ];

    voices.forEach((voice, index) => {
      const oscillator = context.createOscillator();
      const voiceGain = context.createGain();
      const detuneLfo = context.createOscillator();
      const detuneDepth = context.createGain();

      oscillator.type = voice.type;
      oscillator.frequency.value = voice.frequency;
      voiceGain.gain.value = voice.gain;
      detuneLfo.type = 'sine';
      detuneLfo.frequency.value = voice.drift;
      detuneDepth.gain.value = 1.5 + index * 0.55;
      detuneLfo.connect(detuneDepth);
      detuneDepth.connect(oscillator.detune);
      oscillator.connect(voiceGain);
      connectWithOptionalPan(voiceGain, ambientBus, voice.pan, voice.drift * 0.6);
      oscillator.start();
      detuneLfo.start();
    });

    createAirTexture(ambientBus);
  };

  const scheduleShimmer = () => {
    window.clearTimeout(shimmerTimer);
    if (!playing || !context || !master) return;

    const delay = 15000 + Math.random() * 17000;
    shimmerTimer = window.setTimeout(() => {
      if (!playing || context.state !== 'running') {
        scheduleShimmer();
        return;
      }

      const now = context.currentTime;
      const notes = [293.66, 369.99, 440, 587.33];
      const frequency = notes[Math.floor(Math.random() * notes.length)];
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      filter.type = 'lowpass';
      filter.frequency.value = 1600;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.006, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
      oscillator.connect(filter);
      filter.connect(gain);
      connectWithOptionalPan(gain, master, (Math.random() * 1.2) - 0.6);
      oscillator.start(now);
      oscillator.stop(now + 5.7);
      scheduleShimmer();
    }, delay);
  };

  button.addEventListener('click', async () => {
    if (!context) createSoundscape();
    if (!context || !master) {
      button.disabled = true;
      button.setAttribute('aria-label', 'Ambient audio is unavailable in this browser');
      return;
    }

    if (!playing) {
      await context.resume();
      playing = true;
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.018, now + 1.8);
      scheduleShimmer();
    } else {
      playing = false;
      window.clearTimeout(shimmerTimer);
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      window.setTimeout(() => {
        if (!playing && context?.state === 'running') context.suspend();
      }, 1300);
    }

    updateButton();
  });

  window.playInteractionSound = (type = 'click') => {
    if (!playing || !context || context.state !== 'running' || !master) return;

    const nowMs = performance.now();
    if (type === 'slider' && nowMs - lastSliderSound < 140) return;
    if (type === 'slider') lastSliderSound = nowMs;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const isSlider = type === 'slider';

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(isSlider ? 330 : 520, now);
    oscillator.frequency.exponentialRampToValueAtTime(isSlider ? 270 : 220, now + (isSlider ? 0.035 : 0.09));
    filter.type = 'lowpass';
    filter.frequency.value = 1300;
    gain.gain.setValueAtTime(isSlider ? 0.0011 : 0.0028, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isSlider ? 0.04 : 0.1));
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + (isSlider ? 0.045 : 0.11));
  };

  document.addEventListener('visibilitychange', () => {
    if (!context || !playing) return;
    if (document.hidden && context.state === 'running') context.suspend();
    if (!document.hidden && context.state === 'suspended') context.resume();
  });

  updateButton();
}
