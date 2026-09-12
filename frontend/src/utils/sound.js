/**
 * Zero-dependency, ultra-lightweight Web Audio Synthesizer
 * Generates procedural retro and gothic sound cues directly via AudioContext oscillators.
 * Zero external audio files to download. 100% smooth, non-blocking, respects mute state.
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('life_rpg_sound_muted') === 'true';
    this._bootstrapped = false;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  /**
   * Call once on the very first user gesture (click/tap).
   * Pre-unlocks AudioContext so all subsequent sounds play without delay.
   */
  bootstrap() {
    if (this._bootstrapped) return;
    this._bootstrapped = true;
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('life_rpg_sound_muted', this.isMuted.toString());
    return this.isMuted;
  }

  /**
   * Core scheduler — awaits AudioContext resume before scheduling oscillator.
   * Tone is scheduled INSIDE the .then() so it runs after context is fully running.
   */
  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.18) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const schedule = () => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      };

      if (this.audioCtx.state === 'suspended') {
        // Schedule AFTER the context is running — prevents silent playback
        this.audioCtx.resume().then(schedule).catch(() => {});
      } else {
        schedule();
      }
    } catch (e) {
      // Silently swallow — audio is non-critical
    }
  }

  // Soft UI click
  playClick() {
    this.playTone(660, 'triangle', 0.15, 0.18);
  }

  // Quest completion arpeggio
  playQuestComplete() {
    if (this.isMuted) return;
    const notes = [392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => { this.playTone(freq, 'sine', 0.3, 0.22); }, idx * 70);
    });
  }

  // Boss damage strike
  playBossDamage() {
    if (this.isMuted) return;
    this.playTone(110, 'sawtooth', 0.25, 0.28);
    setTimeout(() => { this.playTone(73.42, 'triangle', 0.35, 0.22); }, 45);
  }

  // Boss Defeat Victory Fanfare
  playBossDefeat() {
    if (this.isMuted) return;
    const chords = [
      [261.63, 329.63, 392.00],
      [293.66, 369.99, 440.00],
      [329.63, 415.30, 493.88],
      [523.25, 659.25, 783.99],
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(freq => this.playTone(freq, 'triangle', 0.5, 0.14));
      }, i * 180);
    });
  }

  // Level Up Fanfare
  playLevelUp() {
    if (this.isMuted) return;
    const melody = [440, 554.37, 659.25, 880];
    melody.forEach((f, i) => {
      setTimeout(() => { this.playTone(f, 'square', 0.35, 0.15); }, i * 120);
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BGM ENGINE — Procedural ambient background music. Zero audio files.
// Theme H: Dark 80s Synthwave (Stranger Things / Upside Down)
// Theme G: Gothic Haunted Ambient (Horror / Cursed Necropolis)
// ─────────────────────────────────────────────────────────────────────────────

class BGMEngine {
  constructor(soundSynth) {
    this._synth = soundSynth;
    this._nodes = [];
    this._masterGain = null;
    this._theme = null;
    this._running = false;
    this._timers = [];
  }

  get ctx() { return this._synth.audioCtx; }

  start(theme) {
    if (this._running && this._theme === theme) return;
    this.stop();
    if (this._synth.isMuted) return;
    this._synth.init();
    if (!this.ctx) return;

    const go = () => {
      this._theme = theme;
      this._running = true;
      this._masterGain = this.ctx.createGain();
      this._masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this._masterGain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 3);
      this._masterGain.connect(this.ctx.destination);
      theme === 'theme-h' ? this._startStrangerThings() : this._startHauntedWorld();
    };

    this.ctx.state === 'suspended'
      ? this.ctx.resume().then(go).catch(() => {})
      : go();
  }

  stop(fadeMs = 1500) {
    this._running = false;
    this._theme = null;
    this._timers.forEach(id => { clearInterval(id); clearTimeout(id); });
    this._timers = [];

    if (this._masterGain && this.ctx) {
      const g = this._masterGain;
      const now = this.ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
      setTimeout(() => {
        this._nodes.forEach(n => { try { n.stop?.(); n.disconnect(); } catch (_) {} });
        this._nodes = [];
        try { g.disconnect(); } catch (_) {}
        this._masterGain = null;
      }, fadeMs + 150);
    } else {
      this._nodes.forEach(n => { try { n.stop?.(); n.disconnect(); } catch (_) {} });
      this._nodes = [];
      this._masterGain = null;
    }
  }

  onMuteChange(isMuted) {
    if (isMuted) {
      this.stop(600);
    } else {
      const t = this._theme;
      setTimeout(() => { if (t) this.start(t); }, 700);
    }
  }

  switchTheme(newTheme) {
    if (this._synth.isMuted) return;
    this.stop(1000);
    setTimeout(() => this.start(newTheme), 1100);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  _osc(freq, type, gainVal, connect) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    g.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    osc.connect(g);
    g.connect(connect);
    osc.start();
    this._nodes.push(osc, g);
    return { osc, gain: g };
  }

  _lfo(freq, depth, target) {
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(freq, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(depth, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(target);
    lfo.start();
    this._nodes.push(lfo, lfoGain);
  }

  // ── Theme H — Stranger Things / Upside Down ──────────────────────────────────
  // Dark pulsing 80s synthwave drone with flickering Christmas-light glitches

  _startStrangerThings() {
    const out = this._masterGain;

    // Bass sawtooth drone (41Hz) + slow tremolo LFO (0.3Hz)
    const { gain: bassGain } = this._osc(41.2, 'sawtooth', 0.08, out);
    this._lfo(0.3, 0.04, bassGain.gain);

    // Mid triangle pad (110Hz) + slow vibrato (0.15Hz ±3Hz)
    const { osc: midOsc, gain: midGain } = this._osc(110, 'triangle', 0.05, out);
    this._lfo(0.15, 3, midOsc.frequency);

    // Upper fifth (165Hz triangle)
    this._osc(165, 'triangle', 0.03, out);

    // Flickering Christmas-light glitch notes (random 3-9s intervals)
    const glitchNotes = [329.63, 369.99, 246.94, 293.66, 440];
    const scheduleGlitch = () => {
      if (!this._running) return;
      const freq = glitchNotes[Math.floor(Math.random() * glitchNotes.length)];
      const dur = 0.4 + Math.random() * 0.8;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.04, this.ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(g); g.connect(out);
      osc.start(); osc.stop(this.ctx.currentTime + dur + 0.1);
      this._nodes.push(osc, g);
      this._timers.push(setTimeout(scheduleGlitch, 3000 + Math.random() * 6000));
    };
    this._timers.push(setTimeout(scheduleGlitch, 2000 + Math.random() * 2000));

    // Slow 80s heartbeat pulse (every 1.6s)
    const pulse = () => {
      if (!this._running) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);
      g.gain.setValueAtTime(0.1, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
      osc.connect(g); g.connect(out);
      osc.start(); osc.stop(this.ctx.currentTime + 0.7);
      this._nodes.push(osc, g);
    };
    this._timers.push(setInterval(pulse, 1600));
  }

  // ── Theme G — Horror / Haunted World ─────────────────────────────────────────
  // Gothic graveyard: sub rumble + eerie wind + slow piano tones + church bells

  _startHauntedWorld() {
    const out = this._masterGain;

    // Sub rumble (30Hz + 37Hz sine)
    this._osc(30, 'sine', 0.07, out);
    this._osc(37, 'sine', 0.04, out);

    // Eerie wind (6 detuned sine waves at ~180Hz)
    [180, 183, 177, 190, 174, 186].forEach(f => this._osc(f, 'sine', 0.012, out));

    // Wind swell LFO (0.08Hz — very slow breathing)
    this._lfo(0.08, 0.018, out.gain);

    // Slow gothic piano tones: Am minor chord, random note every 6-10s
    const pianoNotes = [110, 130.81, 164.81, 196]; // A2, C3, E3, G3
    const schedulePiano = () => {
      if (!this._running) return;
      const freq = pianoNotes[Math.floor(Math.random() * pianoNotes.length)];
      const dur = 3.5 + Math.random() * 2;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(g); g.connect(out);
      osc.start(); osc.stop(this.ctx.currentTime + dur + 0.1);
      this._nodes.push(osc, g);
      // Octave overtone
      const osc2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
      g2.gain.setValueAtTime(0, this.ctx.currentTime);
      g2.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.2);
      g2.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur * 0.7);
      osc2.connect(g2); g2.connect(out);
      osc2.start(); osc2.stop(this.ctx.currentTime + dur);
      this._nodes.push(osc2, g2);
      this._timers.push(setTimeout(schedulePiano, 6000 + Math.random() * 5000));
    };
    this._timers.push(setTimeout(schedulePiano, 1000));

    // Distant church bell (every 15-25s, A3 harmonic series)
    const scheduleBell = () => {
      if (!this._running) return;
      [220, 440, 587.33, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.06 / (i + 1), this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 6);
        osc.connect(g); g.connect(out);
        osc.start(); osc.stop(this.ctx.currentTime + 6.5);
        this._nodes.push(osc, g);
      });
      this._timers.push(setTimeout(scheduleBell, 15000 + Math.random() * 10000));
    };
    this._timers.push(setTimeout(scheduleBell, 4000));
  }
}

export const soundFx = new SoundSynthesizer();
export const bgm = new BGMEngine(soundFx);
