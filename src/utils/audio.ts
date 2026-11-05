/**
 * Luxury Audio Soundscape Engine for Maison Aurelia
 * Synthesizes high-fidelity boutique & runway soundtracks using the browser Web Audio API:
 * 1. "Place Vendôme Nocturne" — Lush neo-classical piano arpeggios, cello drone, velvet atmosphere (Satie/Debussy salon vibe)
 * 2. "Grand Palais Runway" — Deep French chic minimalist runway beat, sub-bass, filtered velvet stabs (YSL / Chanel runway show)
 * 3. "Atelier Rain & Strings" — Warm acoustic salon rain, resonant double cello harmonics
 * 100% client-side, zero external media dependencies, zero broken links, instant playback.
 */

export interface TrackInfo {
  id: string;
  title: string;
  frenchTitle: string;
  genre: string;
  bpm: number;
}

export const LUXURY_TRACKS: TrackInfo[] = [
  {
    id: 'place-vendome',
    title: 'Place Vendôme Nocturne',
    frenchTitle: 'Nocturne au 14 Place Vendôme',
    genre: 'Neo-Classical Piano & Cello',
    bpm: 72,
  },
  {
    id: 'grand-palais',
    title: 'Grand Palais Runway MMXXVI',
    frenchTitle: 'Défilé Haute Couture au Grand Palais',
    genre: 'Chic Minimalist French Runway',
    bpm: 112,
  },
  {
    id: 'salon-prive',
    title: 'Salon Privé & Warm Rain',
    frenchTitle: 'Pluie d\'Automne & Cordes de Cello',
    genre: 'Atelier Acoustic Ambiance',
    bpm: 60,
  },
];

class LuxuryAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.35;
  private masterGain: GainNode | null = null;
  private loopInterval: number | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private listeners: ((playing: boolean, track: TrackInfo, volume: number) => void)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(fn: (playing: boolean, track: TrackInfo, volume: number) => void) {
    this.listeners.push(fn);
    fn(this.isPlaying, LUXURY_TRACKS[this.currentTrackIndex], this.volume);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const currentTrack = LUXURY_TRACKS[this.currentTrackIndex];
    this.listeners.forEach((fn) => fn(this.isPlaying, currentTrack, this.volume));
  }

  public getCurrentTrack(): TrackInfo {
    return LUXURY_TRACKS[this.currentTrackIndex];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public nextTrack() {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentTrackIndex = (this.currentTrackIndex + 1) % LUXURY_TRACKS.length;
    if (wasPlaying) {
      setTimeout(() => this.play(), 200);
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + LUXURY_TRACKS.length) % LUXURY_TRACKS.length;
    if (wasPlaying) {
      setTimeout(() => this.play(), 200);
    } else {
      this.notify();
    }
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < LUXURY_TRACKS.length) {
      const wasPlaying = this.isPlaying;
      this.stop();
      this.currentTrackIndex = index;
      if (wasPlaying) {
        setTimeout(() => this.play(), 200);
      } else {
        this.notify();
      }
    }
  }

  public play() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.stopNodes();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(this.volume, this.ctx.currentTime + 1.2);
      this.masterGain.connect(this.ctx.destination);

      const track = LUXURY_TRACKS[this.currentTrackIndex];
      if (track.id === 'place-vendome') {
        this.playNocturneTrack();
      } else if (track.id === 'grand-palais') {
        this.playRunwayTrack();
      } else {
        this.playSalonPriveTrack();
      }

      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('Audio play error:', e);
      this.isPlaying = false;
      this.notify();
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        this.stopNodes();
        this.isPlaying = false;
        this.notify();
      }, 850);
    } catch {
      this.stopNodes();
      this.isPlaying = false;
      this.notify();
    }
  }

  private stopNodes() {
    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (typeof node === 'number') {
          clearTimeout(node);
        } else if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
          node.disconnect();
        } else {
          node.disconnect();
        }
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  // --- Track 1: Place Vendôme Nocturne (Lush Neo-Classical Piano & Cello) ---
  private playNocturneTrack() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // Soft warm background velvet drone (A2 / E3 fifth)
    const drone1 = ctx.createOscillator();
    drone1.type = 'sine';
    drone1.frequency.setValueAtTime(110, ctx.currentTime); // A2
    const drone1Gain = ctx.createGain();
    drone1Gain.gain.setValueAtTime(0.06, ctx.currentTime);
    drone1.connect(drone1Gain);
    drone1Gain.connect(master);
    drone1.start();
    this.activeNodes.push(drone1, drone1Gain);

    const drone2 = ctx.createOscillator();
    drone2.type = 'triangle';
    drone2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(320, ctx.currentTime);
    const drone2Gain = ctx.createGain();
    drone2Gain.gain.setValueAtTime(0.04, ctx.currentTime);
    drone2.connect(droneFilter);
    droneFilter.connect(drone2Gain);
    drone2Gain.connect(master);
    drone2.start();
    this.activeNodes.push(drone2, droneFilter, drone2Gain);

    // Subtle atmospheric vinyl warmth
    this.addVinylWarmth(0.12);

    // Neo-Classical Chord Arpeggiator (Fmaj9 -> Dm9 -> Gm9 -> C9sus4 / Am7)
    // Fmaj9: [F3: 174.61, A3: 220, C4: 261.63, E4: 329.63, G4: 392]
    // Dm9:   [D3: 146.83, F3: 174.61, A3: 220, C4: 261.63, E4: 329.63]
    // Gm9:   [G2: 98, Bb3: 233.08, D4: 293.66, F4: 349.23, A4: 440]
    // C9sus: [C3: 130.81, G3: 196, Bb3: 233.08, D4: 293.66, F4: 349.23]
    const chordSequences = [
      [174.61, 220, 261.63, 329.63, 392, 523.25], // Fmaj9
      [146.83, 174.61, 220, 261.63, 329.63, 440], // Dm9
      [98.0, 233.08, 293.66, 349.23, 440, 587.33], // Gm9
      [130.81, 196.0, 261.63, 293.66, 392, 523.25], // C9/Am7
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playPianoNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const currentChord = chordSequences[chordIdx];
      const freq = currentChord[noteIdx % currentChord.length];

      this.triggerPianoHarmonic(freq, 0.08 + Math.random() * 0.03);

      noteIdx++;
      if (noteIdx >= currentChord.length * 2) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chordSequences.length;
        // Trigger subtle low root bass note for new chord
        this.triggerCelloBass(currentChord[0] / 2, 0.12);
      }
    };

    // First bass note
    this.triggerCelloBass(87.3, 0.14);

    const stepMs = 640; // ~72 BPM elegant waltz pace
    const timer = window.setInterval(playPianoNote, stepMs);
    this.loopInterval = timer;
  }

  // --- Track 2: Grand Palais Runway (Deep Minimalist French Electro-Chic) ---
  private playRunwayTrack() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // Sub Bass Pulse (Minimalist deep runway 4-on-the-floor kick & sub glide)
    // 112 BPM -> 1 beat = 535ms
    const stepMs = 535 / 2; // 8th notes
    let beat = 0;

    // Shimmering filtered synth chords: Fmin7 -> Ebmaj7 -> Dbmaj7 -> C7
    const runwayChords = [
      [174.61, 207.65, 261.63, 311.13], // Fm7
      [155.56, 196.0, 233.08, 293.66],  // Eb7
      [138.59, 174.61, 207.65, 261.63], // Dbmaj7
      [130.81, 164.81, 196.0, 233.08],  // C7
    ];

    let chordStep = 0;

    const tick = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const quarter = beat % 2 === 0;

      // Deep muted runway kick on quarters 1, 2, 3, 4
      if (quarter) {
        this.triggerRunwayKick();
      }

      // Elegant high-hat / silk shaker on off-beats
      if (!quarter) {
        this.triggerSilkHat();
      }

      // Filtered French chic chords on beat 2 and 4
      if (beat % 4 === 2) {
        const chord = runwayChords[Math.floor(chordStep / 8) % runwayChords.length];
        this.triggerRunwayChord(chord);
      }

      // Rolling minimalist sub-bass
      if (beat % 4 === 0) {
        const rootFreq = runwayChords[Math.floor(chordStep / 8) % runwayChords.length][0] / 2;
        this.triggerRunwayBass(rootFreq);
      }

      beat = (beat + 1) % 16;
      chordStep = (chordStep + 1) % 32;
    };

    const timer = window.setInterval(tick, stepMs);
    this.loopInterval = timer;
  }

  // --- Track 3: Salon Privé 14 Vendôme (Acoustic Rain & Double Cello) ---
  private playSalonPriveTrack() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // 1. Soft Parisian rainfall noise
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      output[i] = lastOut * 0.18;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(420, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.28, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(master);
    rainSource.start();
    this.activeNodes.push(rainSource, rainFilter, rainGain);

    // 2. Harmonic warm acoustic cello chords
    const celloDrone1 = ctx.createOscillator();
    celloDrone1.type = 'sawtooth';
    celloDrone1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2
    const celloFilter1 = ctx.createBiquadFilter();
    celloFilter1.type = 'lowpass';
    celloFilter1.frequency.setValueAtTime(220, ctx.currentTime);

    const celloGain1 = ctx.createGain();
    celloGain1.gain.setValueAtTime(0.06, ctx.currentTime);

    celloDrone1.connect(celloFilter1);
    celloFilter1.connect(celloGain1);
    celloGain1.connect(master);
    celloDrone1.start();
    this.activeNodes.push(celloDrone1, celloFilter1, celloGain1);

    // 3. Gentle gentle chimes occasionally
    const playChime = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major pentatonic
      const note = notes[Math.floor(Math.random() * notes.length)];
      this.triggerPianoHarmonic(note, 0.04);
    };

    const timer = window.setInterval(playChime, 2400);
    this.loopInterval = timer;
  }

  // --- Sound Generation Primitives ---

  private triggerPianoHarmonic(freq: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // Dual oscillator for rich, warm Rhodes/piano chime
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, t);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 1.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(gainVal, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.3);
    osc2.stop(t + 2.3);
  }

  private triggerCelloBass(freq: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(gainVal, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 3.6);
  }

  private triggerRunwayKick() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  private triggerSilkHat() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(t);
    source.stop(t + 0.05);
  }

  private triggerRunwayChord(chordFreqs: number[]) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;
    const t = ctx.currentTime;

    chordFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.exponentialRampToValueAtTime(250, t + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  private triggerRunwayBass(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.48);
  }

  private addVinylWarmth(level: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.activeNodes.push(source, filter, gain);
  }
}

export const luxuryAudio = new LuxuryAudioEngine();
// Compatibility alias for existing code:
export const atelierAudio = luxuryAudio;
