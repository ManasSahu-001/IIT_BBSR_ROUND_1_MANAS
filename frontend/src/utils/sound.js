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
   * This is the key fix: tone is scheduled INSIDE the .then() so it runs
   * after the context is fully running, not before.
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

  // Soft UI click — boosted gain & duration so it's clearly audible
  playClick() {
    this.playTone(660, 'triangle', 0.15, 0.18);
  }

  // Satisfying quest completion arpeggio
  playQuestComplete() {
    if (this.isMuted) return;
    const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.3, 0.22);
      }, idx * 70);
    });
  }

  // Boss damage strike
  playBossDamage() {
    if (this.isMuted) return;
    this.playTone(110, 'sawtooth', 0.25, 0.28);
    setTimeout(() => {
      this.playTone(73.42, 'triangle', 0.35, 0.22);
    }, 45);
  }

  // Boss Defeat Victory Fanfare
  playBossDefeat() {
    if (this.isMuted) return;
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D major
      [329.63, 415.30, 493.88], // E major
      [523.25, 659.25, 783.99], // High C octave
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
      setTimeout(() => {
        this.playTone(f, 'square', 0.35, 0.15);
      }, i * 120);
    });
  }
}

export const soundFx = new SoundSynthesizer();
