/**
 * Zero-dependency, ultra-lightweight Web Audio Synthesizer
 * Generates procedural retro and gothic sound cues directly via AudioContext oscillators.
 * Zero external audio files to download. 100% smooth, non-blocking, and respect mute state.
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('life_rpg_sound_muted') === 'true';
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('life_rpg_sound_muted', this.isMuted.toString());
    return this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.08) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

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
    } catch (e) {
      // Audio context silently ignored on browser autoplay restriction
    }
  }

  // Soft UI click
  playClick() {
    this.playTone(600, 'triangle', 0.05, 0.04);
  }

  // Satisfying quest completion arpeggio
  playQuestComplete() {
    if (this.isMuted) return;
    const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.25, 0.06);
      }, idx * 60);
    });
  }

  // Boss damage strike
  playBossDamage() {
    if (this.isMuted) return;
    this.playTone(110, 'sawtooth', 0.22, 0.1);
    setTimeout(() => {
      this.playTone(73.42, 'triangle', 0.3, 0.08);
    }, 40);
  }

  // Boss Defeat Victory Fanfare
  playBossDefeat() {
    if (this.isMuted) return;
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D major
      [329.63, 415.30, 493.88], // E major
      [523.25, 659.25, 783.99]  // High C octave
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(freq => this.playTone(freq, 'triangle', 0.45, 0.05));
      }, i * 160);
    });
  }

  // Level Up Fanfare
  playLevelUp() {
    if (this.isMuted) return;
    const melody = [440, 554.37, 659.25, 880];
    melody.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'square', 0.3, 0.04);
      }, i * 110);
    });
  }
}

export const soundFx = new SoundSynthesizer();
