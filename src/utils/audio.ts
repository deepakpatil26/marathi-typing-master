class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.4;
  private metronomeTimer: number | null = null;
  private metronomeRunning: boolean = false;
  private metronomeBpm: number = 150; // default 150 CPM = 30 WPM cadence
  private onBeatCallback: (() => void) | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.metronomeRunning) {
      this.stopMetronome();
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Metronome Controls
  public setMetronomeBpm(bpm: number) {
    this.metronomeBpm = Math.max(40, Math.min(300, bpm));
    if (this.metronomeRunning) {
      this.stopMetronome();
      this.startMetronome(this.onBeatCallback || undefined);
    }
  }

  public getMetronomeBpm(): number {
    return this.metronomeBpm;
  }

  public isMetronomeRunning(): boolean {
    return this.metronomeRunning;
  }

  public startMetronome(onBeat?: () => void) {
    if (onBeat) this.onBeatCallback = onBeat;
    this.metronomeRunning = true;
    this.initCtx();
    
    if (this.metronomeTimer) {
      window.clearInterval(this.metronomeTimer);
    }

    const intervalMs = (60 / this.metronomeBpm) * 1000;
    this.playMetronomeTick();
    if (this.onBeatCallback) this.onBeatCallback();

    this.metronomeTimer = window.setInterval(() => {
      this.playMetronomeTick();
      if (this.onBeatCallback) this.onBeatCallback();
    }, intervalMs);
  }

  public stopMetronome() {
    this.metronomeRunning = false;
    if (this.metronomeTimer) {
      window.clearInterval(this.metronomeTimer);
      this.metronomeTimer = null;
    }
  }

  public toggleMetronome(onBeat?: () => void): boolean {
    if (this.metronomeRunning) {
      this.stopMetronome();
      return false;
    } else {
      this.startMetronome(onBeat);
      return true;
    }
  }

  // Metronome crisp woodblock tick sound
  public playMetronomeTick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // AudioContext blocked until gesture
    }
  }

  // Realistic mechanical keyboard switch sound (short crisp noise pulse + damp sine)
  public playKeyClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.038);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Error thud sound
  public playErrorSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // AudioContext blocked
    }
  }

  // Completion fanfare chords
  public playSuccessSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.38);
      });
    } catch {
      // AudioContext blocked
    }
  }
}

export const sound = new SoundEngine();
