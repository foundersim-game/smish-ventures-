// Studio-Grade Ultra-Low Latency Sound Engine for CHAOS Party Game
// Uses real pre-recorded game-show audio files decoded into memory AudioBuffers for 0ms latency.

export type SoundType =
  | "click"
  | "lock"
  | "phones_down"
  | "tick_calm"
  | "tick_urgent"
  | "time_up"
  | "box_shake"
  | "box_open"
  | "fanfare"
  | "reveal_bgm"
  | "reveal_tension"
  | "flip"
  | "coin_flip"
  | "coin_land"
  | "buzzer"
  | "strike"
  | "correct"
  | "invalid"
  | "beep"
  | "buzz_in"
  | "buzzer_bullshit"
  | "buzzer_cap"
  | "buzzer_anvil";

const SOUND_FILE_MAP: Record<string, string> = {
  click: "/sounds/click.wav",
  lock: "/sounds/lock.wav",
  tick_calm: "/sounds/tick.wav",
  tick_urgent: "/sounds/beep.mp3",
  time_up: "/sounds/time_up.mp3",
  box_shake: "/sounds/flip.wav",
  box_open: "/sounds/box_open.ogg",
  fanfare: "/sounds/fanfare.ogg",
  flip: "/sounds/flip.wav",
  buzzer: "/sounds/buzzer.mp3",
  strike: "/sounds/strike.ogg",
  correct: "/sounds/correct.ogg",
  invalid: "/sounds/invalid.mp3",
  beep: "/sounds/beep.mp3",
  buzz_in: "/sounds/buzz_in.mp3",
  phones_down: "/sounds/strike.ogg",
  buzzer_bullshit: "/sounds/buzzer.mp3",
  buzzer_cap: "/sounds/invalid.mp3",
  buzzer_anvil: "/sounds/strike.ogg",
};

class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmTrack: "ambient" | "debate" | null = null;
  private isSoundEnabled = true;
  private isMusicEnabled = true;
  private musicVolume = 0.22;
  private isPreloaded = false;

  private constructor() {
    if (typeof window !== "undefined") {
      const initAudio = () => {
        this.initContext();
        this.preloadAllSounds();
        // If music was requested before first user interaction, resume now
        if (this.currentBgmTrack && this.isMusicEnabled && (!this.bgmAudio || this.bgmAudio.paused)) {
          this.playBGM(this.currentBgmTrack, this.musicVolume);
        }
        window.removeEventListener("pointerdown", initAudio);
        window.removeEventListener("touchstart", initAudio);
        window.removeEventListener("keydown", initAudio);
        window.removeEventListener("click", initAudio);
      };

      window.addEventListener("pointerdown", initAudio, { passive: true, once: true });
      window.addEventListener("touchstart", initAudio, { passive: true, once: true });
      window.addEventListener("keydown", initAudio, { passive: true, once: true });
      window.addEventListener("click", initAudio, { passive: true, once: true });

      // Start preloading immediately in background even before first interaction
      setTimeout(() => {
        this.initContext();
        this.preloadAllSounds();
      }, 50);
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initContext(): void {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx({ latencyHint: "interactive" });
        if (this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  /**
   * Preload and decode all audio files into memory AudioBuffers for instant 0ms latency
   */
  public async preloadAllSounds(): Promise<void> {
    if (this.isPreloaded || typeof window === "undefined") return;
    this.isPreloaded = true;

    if (!this.ctx) this.initContext();
    if (!this.ctx) return;

    const uniqueFiles = Array.from(new Set(Object.values(SOUND_FILE_MAP)));

    await Promise.all(
      uniqueFiles.map(async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return;
          const arrayBuffer = await res.arrayBuffer();
          if (this.ctx) {
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            // Map to all sound keys that use this URL
            for (const [key, mappedUrl] of Object.entries(SOUND_FILE_MAP)) {
              if (mappedUrl === url) {
                this.buffers.set(key, audioBuffer);
              }
            }
          }
        } catch {
          // Graceful fallback for any network error
        }
      })
    );
  }

  /**
   * Cinematic suspense tension rumble for mystery briefcase shaking
   */
  /**
   * Futuristic pneumatic unseal & sparkling crystal chime for briefcase opening
   * Zero harshness, 100% luxury tactile cyber feedback
   */
  public playChestOpen(volume = 0.5): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Soft pneumatic sci-fi air release (filtered noise sweep)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(320, now + 0.26);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Dual crystalline chime bells (C6 1046.5Hz + G6 1567.98Hz)
      const chimeFreqs = [1046.5, 1567.98];
      chimeFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + 0.04 * idx);

        gain.gain.setValueAtTime(0.001, now + 0.04 * idx);
        gain.gain.linearRampToValueAtTime(volume * 0.15, now + 0.06 * idx);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 0.04 * idx);
        osc.stop(now + 0.58);
      });

      // 3. Warm sub thump
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(42, now + 0.22);
      subGain.gain.setValueAtTime(volume * 0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.26);
    } catch {
      // Ignored
    }
  }

  /**
   * Lush, warm, celebratory game-show synth chord for the winning reveal
   * Zero abrasive clipping or harsh brass; rich pentatonic major harmony
   */
  public playFanfare(volume = 0.5): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // C major chord triad spread across octaves
      const chord = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(800, now + 1.2);

        const startTime = now + idx * 0.035;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.12, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.25);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * High-pitch metallic ping & rapid spinning flutter for coin toss
   */
  public playCoinFlip(volume = 0.5): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High coin ping
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = "sine";
      ping.frequency.setValueAtTime(2200, now);
      ping.frequency.exponentialRampToValueAtTime(1750, now + 0.35);
      pingGain.gain.setValueAtTime(volume * 0.35, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);
      ping.start(now);
      ping.stop(now + 0.42);

      // Rapid flutter ticks simulating coin spinning in mid-air
      for (let i = 0; i < 7; i++) {
        const tickTime = now + 0.06 + i * 0.055;
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = "triangle";
        tick.frequency.setValueAtTime(1300 + i * 90, tickTime);
        tickGain.gain.setValueAtTime(volume * 0.09, tickTime);
        tickGain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.035);
        tick.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tick.start(tickTime);
        tick.stop(tickTime + 0.04);
      }
    } catch {
      // Ignored
    }
  }

  /**
   * Crisp golden catch / land sound when the coin lands decisively
   */
  public playCoinLand(volume = 0.5): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1650, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.28);
      gain.gain.setValueAtTime(volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Ignored
    }
  }

  /**
   * Complete Game-Show BGM Reveal Music Cue
   * Phase 1: High-suspense cinematic riser with ticking heartbeat & swelling synth pad (0.0s - 1.8s)
   * Phase 2: Rapid 3D card flip whoosh sweep (1.6s - 1.85s)
   * Phase 3: Grand, joyous, triumphant game-show chord & sparkling fanfare resolution (1.8s - 4.2s)
   */
  public playRevealBGM(volume = 0.55): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // --- SECTION 1: THE SUSPENSE RISER (0.0s - 1.8s) ---
      // 1. Ticking rhythmic suspense pulse
      [0, 0.45, 0.9, 1.35].forEach((tOffset, i) => {
        if (!this.ctx) return;
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = "sine";
        tickOsc.frequency.setValueAtTime(75 + i * 20, now + tOffset);
        tickOsc.frequency.exponentialRampToValueAtTime(45, now + tOffset + 0.12);
        tickGain.gain.setValueAtTime(volume * (0.2 + i * 0.08), now + tOffset);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + tOffset + 0.15);
        tickOsc.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tickOsc.start(now + tOffset);
        tickOsc.stop(now + tOffset + 0.18);
      });

      // 2. Swelling synth pad with resonant lowpass filter sweep
      const padOsc1 = this.ctx.createOscillator();
      const padOsc2 = this.ctx.createOscillator();
      const padFilter = this.ctx.createBiquadFilter();
      const padGain = this.ctx.createGain();

      padOsc1.type = "sawtooth";
      padOsc2.type = "triangle";
      padOsc1.frequency.setValueAtTime(130.81, now); // C3
      padOsc2.frequency.setValueAtTime(196.0, now);  // G3

      padFilter.type = "lowpass";
      padFilter.frequency.setValueAtTime(280, now);
      padFilter.frequency.exponentialRampToValueAtTime(1800, now + 1.75);
      padFilter.Q.setValueAtTime(3.5, now);

      padGain.gain.setValueAtTime(0.001, now);
      padGain.gain.linearRampToValueAtTime(volume * 0.22, now + 1.2);
      padGain.gain.linearRampToValueAtTime(volume * 0.32, now + 1.75);
      padGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

      padOsc1.connect(padFilter);
      padOsc2.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(this.ctx.destination);

      padOsc1.start(now);
      padOsc2.start(now);
      padOsc1.stop(now + 1.95);
      padOsc2.stop(now + 1.95);

      // --- SECTION 2: THE CARD FLIP WHOOSH (1.6s - 1.85s) ---
      const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.25), this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
      const whooshSource = this.ctx.createBufferSource();
      whooshSource.buffer = noiseBuffer;
      const whooshFilter = this.ctx.createBiquadFilter();
      whooshFilter.type = "bandpass";
      whooshFilter.frequency.setValueAtTime(800, now + 1.6);
      whooshFilter.frequency.exponentialRampToValueAtTime(2400, now + 1.78);
      whooshFilter.frequency.exponentialRampToValueAtTime(600, now + 1.88);
      const whooshGain = this.ctx.createGain();
      whooshGain.gain.setValueAtTime(0.001, now + 1.6);
      whooshGain.gain.linearRampToValueAtTime(volume * 0.22, now + 1.74);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);
      whooshSource.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(this.ctx.destination);
      whooshSource.start(now + 1.6);

      // --- SECTION 3: TRIUMPHANT GAME-SHOW FANFARE HIT (1.8s - 4.2s) ---
      const revealChord = [130.81, 196.0, 261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
      const hitTime = now + 1.8;

      revealChord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx < 2 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, hitTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3200, hitTime);
        filter.frequency.exponentialRampToValueAtTime(650, hitTime + 2.0);

        const stagger = hitTime + (idx * 0.02);
        gain.gain.setValueAtTime(0.001, stagger);
        gain.gain.linearRampToValueAtTime(volume * (idx < 2 ? 0.28 : 0.16), stagger + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, stagger + 2.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(stagger);
        osc.stop(stagger + 2.3);
      });

      // Shimmering celestial glockenspiel bells on top
      const bells = [1046.5, 1318.5, 1567.98, 2093.0];
      bells.forEach((freq, idx) => {
        if (!this.ctx) return;
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bellOsc.type = "sine";
        bellOsc.frequency.setValueAtTime(freq, hitTime + 0.06 * idx);
        bellGain.gain.setValueAtTime(0.001, hitTime + 0.06 * idx);
        bellGain.gain.linearRampToValueAtTime(volume * 0.18, hitTime + 0.06 * idx + 0.02);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, hitTime + 0.06 * idx + 1.2);
        bellOsc.connect(bellGain);
        bellGain.connect(this.ctx.destination);
        bellOsc.start(hitTime + 0.06 * idx);
        bellOsc.stop(hitTime + 0.06 * idx + 1.3);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Cinematic suspense tension rumble for card shaking
   */
  public playTensionRumble(): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(95, now);
      filter.frequency.linearRampToValueAtTime(140, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Ignored
    }
  }

  /**
   * Warm, deep, cinematic bass drop for consequences & dramatic moments (Zero harshness, pure luxury feel)
   */
  public playCinematicDrop(volume = 0.45): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.55);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(55, now + 0.55);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Ignored
    }
  }

  /**
   * Gentle two-tone chime for time up (replaces any loud harsh alarm)
   */
  public playSoftTimeUp(volume = 0.35): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [329.63, 261.63]; // E4 -> C4
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        gain.gain.setValueAtTime(0.001, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(volume * 0.25, now + idx * 0.18 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.5);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Play real studio sound effect with zero latency
   */
  public play(type: SoundType, volume = 1.0): void {
    if (!this.isSoundEnabled || typeof window === "undefined") return;

    // Smooth synthesized sounds for core dramatic moments - ZERO harshness
    if (type === "box_shake") {
      this.playTensionRumble();
      return;
    }

    if (type === "reveal_bgm") {
      this.playRevealBGM(volume);
      return;
    }

    if (type === "reveal_tension") {
      this.playTensionRumble();
      return;
    }

    if (type === "box_open") {
      this.playChestOpen(volume * 0.6);
      return;
    }

    if (type === "coin_flip") {
      this.playCoinFlip(volume);
      return;
    }

    if (type === "coin_land") {
      this.playCoinLand(volume);
      return;
    }

    if (type === "fanfare") {
      this.playFanfare(volume * 0.6);
      return;
    }

    if (type === "time_up") {
      this.playSoftTimeUp(volume * 0.5);
      return;
    }

    // Replace abrasive BAM metallic crashes with warm, smooth cinematic bass drops
    if (type === "strike" || type === "phones_down" || type === "buzzer_anvil") {
      this.playCinematicDrop(volume * 0.4);
      return;
    }

    if (!this.ctx) {
      this.initContext();
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const buffer = this.buffers.get(type);

    if (this.ctx && buffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(Math.min(1.0, Math.max(0.1, volume)), this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch (err) {
        console.warn("Audio playback error:", err);
      }
    }

    // Direct HTML5 Audio fallback if buffer wasn't ready
    const fallbackUrl = SOUND_FILE_MAP[type];
    if (fallbackUrl) {
      try {
        const audio = new Audio(fallbackUrl);
        audio.volume = Math.min(1.0, Math.max(0.1, volume));
        audio.play().catch(() => {});
      } catch {
        // Ignored
      }
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isSoundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;
    if (!enabled) {
      this.pauseBGM();
    } else {
      this.resumeBGM();
    }
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  public getCurrentTrack(): "ambient" | "debate" | null {
    return this.currentBgmTrack;
  }

  /**
   * Play looping background music track (royalty-free)
   * 'ambient' = Kevin MacLeod's "Carefree" (lobby, voting, reveal)
   * 'debate' = Kevin MacLeod's "Sneaky Snitch" (discussion countdown)
   */
  public playBGM(track: "ambient" | "debate" = "ambient", volume = 0.22): void {
    if (typeof window === "undefined") return;
    this.musicVolume = volume;
    this.currentBgmTrack = track;

    if (!this.isMusicEnabled) return;

    const fileMap: Record<"ambient" | "debate", string> = {
      ambient: "/sounds/bg_music.ogg",
      debate: "/sounds/debate_music.ogg",
    };
    const targetUrl = fileMap[track];

    // If already playing this track smoothly, just update volume
    if (this.bgmAudio && !this.bgmAudio.paused && this.bgmAudio.src.includes(targetUrl)) {
      this.bgmAudio.volume = volume;
      return;
    }

    try {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.src = "";
        this.bgmAudio = null;
      }

      const audioEl = new Audio(targetUrl);
      audioEl.loop = true;
      audioEl.volume = volume;
      this.bgmAudio = audioEl;

      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy waiting for user click
          console.debug("BGM autoplay pending user gesture:", err);
        });
      }
    } catch (e) {
      console.warn("Error playing BGM:", e);
    }
  }

  public stopBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmAudio = null;
    }
    this.currentBgmTrack = null;
  }

  public pauseBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  public resumeBGM(): void {
    if (!this.isMusicEnabled) return;
    if (this.bgmAudio && this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    } else if (this.currentBgmTrack) {
      this.playBGM(this.currentBgmTrack, this.musicVolume);
    } else {
      this.playBGM("ambient", this.musicVolume);
    }
  }

  public toggleMusic(): boolean {
    const next = !this.isMusicEnabled;
    this.setMusicEnabled(next);
    return next;
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.musicVolume;
    }
  }
}

export const audio = AudioManager.getInstance();
