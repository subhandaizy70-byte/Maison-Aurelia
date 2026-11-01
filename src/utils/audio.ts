/**
 * Ambient Audio Generator for Maison Aurelia
 * Synthesizes a subtle, warm acoustic atmosphere (soft Parisian rain & resonant atelier cello drone)
 * using the browser Web Audio API with zero external media dependencies.
 */

class AtelierAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private oscDrone1: OscillatorNode | null = null;
  private oscDrone2: OscillatorNode | null = null;
  private volume = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(this.volume, this.ctx.currentTime + 1.8);
      this.masterGain.connect(this.ctx.destination);

      // 1. Soft Rainfall filtered noise (simulating rain against Place Vendôme atelier windows)
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 0.15;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Lowpass filter for muffled rain
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const rainGain = this.ctx.createGain();
      rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.noiseNode.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.masterGain);
      this.noiseNode.start();

      // 2. Harmonic warm acoustic drone (simulating cello/viola warmth)
      this.oscDrone1 = this.ctx.createOscillator();
      this.oscDrone1.type = 'sine';
      this.oscDrone1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2 note

      const drone1Gain = this.ctx.createGain();
      drone1Gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.oscDrone1.connect(drone1Gain);
      drone1Gain.connect(this.masterGain);
      this.oscDrone1.start();

      this.oscDrone2 = this.ctx.createOscillator();
      this.oscDrone2.type = 'triangle';
      this.oscDrone2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3 note

      const drone2Gain = this.ctx.createGain();
      drone2Gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.oscDrone2.connect(drone2Gain);
      drone2Gain.connect(this.masterGain);
      this.oscDrone2.start();

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      }
      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.oscDrone1?.stop();
          this.oscDrone2?.stop();
          this.noiseNode?.disconnect();
          this.oscDrone1?.disconnect();
          this.oscDrone2?.disconnect();
        } catch {
          // ignore cleanup errors
        }
        this.isPlaying = false;
      }, 1050);
    } catch {
      this.isPlaying = false;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const atelierAudio = new AtelierAudioEngine();
