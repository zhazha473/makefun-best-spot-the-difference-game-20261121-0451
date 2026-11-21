// Synthetic harbour sounds for Harbourlog: no audio files, every tone is
// built with the Web Audio API. A soft bell for a found difference, a low
// thud for a miss, a bright arpeggio when a scene is cleared, and a quiet
// loop of filtered noise that sounds like surf against the quay.
export class SoundBank {
  constructor() {
    this.context = null;
    this.master = null;
    this.muted = false;
    this.ambience = null;
  }

  // The browser only lets audio start after a gesture, so create the context
  // on the first click or key press and reuse it afterwards.
  ensure() {
    if (this.context) {
      if (this.context.state === 'suspended') this.context.resume();
      return true;
    }
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      this.context = new Ctor();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.context.destination);
      this.startSurf();
      return true;
    } catch {
      return false;
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.5;
  }

  // One sine note with a quick attack and a gentle decay.
  tone(freq, when, length, volume, type = 'sine') {
    if (!this.context || !this.master) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + length);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(when);
    osc.stop(when + length + 0.05);
  }

  // Two-note bell chime: a found difference should feel like a small reward.
  found() {
    if (!this.ensure()) return;
    const now = this.context.currentTime;
    this.tone(880, now, 0.35, 0.22, 'sine');
    this.tone(1318.5, now + 0.09, 0.5, 0.18, 'sine');
  }

  // A low, short buzz for a wrong click.
  wrong() {
    if (!this.ensure()) return;
    const now = this.context.currentTime;
    this.tone(140, now, 0.22, 0.25, 'triangle');
    this.tone(98, now + 0.05, 0.28, 0.2, 'triangle');
  }

  // A single soft ping when a hint is spent.
  hint() {
    if (!this.ensure()) return;
    const now = this.context.currentTime;
    this.tone(1568, now, 0.4, 0.12, 'sine');
  }

  // A rising arpeggio for a finished scene, longer for the whole logbook.
  fanfare(long) {
    if (!this.ensure()) return;
    const now = this.context.currentTime;
    const notes = long
      ? [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568]
      : [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      this.tone(freq, now + index * 0.11, 0.55, 0.18, 'sine');
    });
  }

  click() {
    if (!this.ensure()) return;
    const now = this.context.currentTime;
    this.tone(660, now, 0.08, 0.1, 'sine');
  }

  // Surf: a looped noise buffer through a low-pass filter whose cutoff
  // breathes slowly, like waves arriving and withdrawing.
  startSurf() {
    if (!this.context || this.ambience) return;
    try {
      const length = this.context.sampleRate * 2;
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 320;
      const gain = this.context.createGain();
      gain.gain.value = 0.035;
      const lfo = this.context.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = this.context.createGain();
      lfoGain.gain.value = 140;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start();
      lfo.start();
      this.ambience = { source, lfo };
    } catch {
      this.ambience = null;
    }
  }
}
