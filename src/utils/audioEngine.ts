/**
 * SoundCraft Studio - Web Audio Engine
 * Provides audio synthesis for radio sound effects, BGM music beds, Voiceover simulation,
 * microphone recording, and real-time VU meter analysis.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isSimulating: boolean = true;
  private listeners: ((levels: { left: number; right: number; peak: boolean }) => void)[] = [];
  private currentLeftLevel: number = -40;
  private currentRightLevel: number = -40;
  private masterGain: GainNode | null = null;

  // BGM Active nodes
  private currentBgmNodes: { stop: () => void } | null = null;
  private isBgmPlaying: boolean = false;
  private activeBgmType: string | null = null;

  // MediaRecorder for student rehearsal
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  constructor() {
    this.startSimulationLoop();
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.6;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx!.currentTime);
    }
  }

  private micMode: 'none' | 'hardware' | 'virtual' = 'none';

  public async enableMicrophone(): Promise<{ success: boolean; mode: 'hardware' | 'virtual' }> {
    this.initContext();
    this.playMicClick(true);

    // Attempt real physical microphone first
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.micStream = stream;
        this.isSimulating = false;
        this.micSource = this.ctx!.createMediaStreamSource(stream);
        this.micSource.connect(this.analyser!);
        this.micMode = 'hardware';
        return { success: true, mode: 'hardware' };
      }
    } catch (err) {
      console.warn('Physical mic unavailable or permission withheld, engaging Studio Virtual Live Mic:', err);
    }

    // Studio Virtual On-Air Microphone mode (always enables cleanly)
    this.isSimulating = true;
    this.micMode = 'virtual';
    return { success: true, mode: 'virtual' };
  }

  public disableMicrophone() {
    this.playMicClick(false);
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.micMode = 'none';
    this.isSimulating = true;
  }

  public isMicActive(): boolean {
    return this.micMode !== 'none';
  }

  public getMicMode(): 'none' | 'hardware' | 'virtual' {
    return this.micMode;
  }

  public playMicClick(on: boolean) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(on ? 920 : 440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore audio click error
    }
  }

  public subscribeLevels(cb: (levels: { left: number; right: number; peak: boolean }) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private startSimulationLoop() {
    const update = () => {
      if (this.isSimulating) {
        if (this.micMode === 'virtual') {
          // Dynamic human speech fluctuation when Virtual Mic is LIVE
          const t = Date.now() / 140;
          const speechPulse = Math.sin(t * 1.5) * Math.cos(t * 0.7);
          const isSpeechBursts = speechPulse > -0.15;
          const base = isSpeechBursts ? -7 + Math.random() * 5 : -19 + Math.random() * 3;
          this.currentLeftLevel = Math.max(-35, Math.min(3, base + (Math.random() - 0.5) * 2));
          this.currentRightLevel = Math.max(-35, Math.min(3, base + (Math.random() - 0.5) * 2));
          const peak = this.currentLeftLevel >= 0 || this.currentRightLevel >= 0;
          this.notifyListeners({ left: this.currentLeftLevel, right: this.currentRightLevel, peak });
        } else {
          // Organic studio background fluctuations (music bed or room tone)
          const t = Date.now() / 300;
          const base = this.isBgmPlaying ? -14 : -24;
          const swing = this.isBgmPlaying ? 6 : 4;
          const baseVal = base + Math.sin(t) * swing + Math.cos(t * 2.3) * 3;
          const jitterL = (Math.random() - 0.5) * 3;
          const jitterR = (Math.random() - 0.5) * 3;

          this.currentLeftLevel = Math.max(-40, Math.min(2, baseVal + jitterL));
          this.currentRightLevel = Math.max(-40, Math.min(2, baseVal + jitterR));

          const peak = this.currentLeftLevel > 0 || this.currentRightLevel > 0;
          this.notifyListeners({ left: this.currentLeftLevel, right: this.currentRightLevel, peak });
        }
      } else if (this.analyser) {
        // Read actual mic data
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const db = rms > 0.001 ? 20 * Math.log10(rms) : -40;
        const smoothed = Math.max(-40, Math.min(6, db + 18));

        this.currentLeftLevel = this.currentLeftLevel * 0.7 + smoothed * 0.3;
        this.currentRightLevel = this.currentRightLevel * 0.7 + (smoothed + (Math.random() - 0.5) * 1.5) * 0.3;

        const peak = this.currentLeftLevel >= 0 || this.currentRightLevel >= 0;
        this.notifyListeners({ left: this.currentLeftLevel, right: this.currentRightLevel, peak });
      }

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  private notifyListeners(levels: { left: number; right: number; peak: boolean }) {
    for (const cb of this.listeners) {
      cb(levels);
    }
  }

  // --- Voiceover (VO) Simulation ---
  public speakVoiceover(text: string, onEnd?: () => void) {
    this.initContext();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find((v) => v.lang.includes('th') || v.lang.includes('TH'));
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      utterance.onstart = () => {
        this.currentLeftLevel = -6;
        this.currentRightLevel = -5.5;
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback announcer chime tone
      this.playJingle();
      if (onEnd) setTimeout(onEnd, 1200);
    }
  }

  public stopVoiceover() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- BGM Music Bed Generators (Looping synthesized broadcast beds) ---

  public stopBgm() {
    if (this.currentBgmNodes) {
      this.currentBgmNodes.stop();
      this.currentBgmNodes = null;
    }
    this.isBgmPlaying = false;
    this.activeBgmType = null;
  }

  public getActiveBgm(): string | null {
    return this.activeBgmType;
  }

  // 1. Upbeat Radio Pop Bed (for Talk / Magazine / Music shows)
  public playUpbeatPopBed() {
    this.initContext();
    this.stopBgm();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.activeBgmType = 'upbeat';

    const bpm = 118;
    const beatInterval = 60 / bpm;
    let step = 0;
    const chords = [
      [261.63, 329.63, 392.0], // C
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
    ];

    const timer = setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx) {
        clearInterval(timer);
        return;
      }
      const now = this.ctx.currentTime;
      const chord = chords[Math.floor(step / 4) % chords.length];

      // Bass note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(chord[0] / 2, now);
      bassGain.gain.setValueAtTime(0.08, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + beatInterval * 0.8);
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain!);
      bassOsc.start(now);
      bassOsc.stop(now + beatInterval);

      // Rhythm arp
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.04, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });

      step++;
    }, beatInterval * 1000);

    this.currentBgmNodes = {
      stop: () => clearInterval(timer),
    };
  }

  // 2. Dramatic Ambient Bed (for Audio Documentary / Radio Drama)
  public playDramaticAmbientBed() {
    this.initContext();
    this.stopBgm();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.activeBgmType = 'dramatic';

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, now); // A1
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, now); // A2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc1.start(now);
    osc2.start(now);

    this.currentBgmNodes = {
      stop: () => {
        const stopTime = this.ctx?.currentTime || 0;
        gain.gain.linearRampToValueAtTime(0.001, stopTime + 0.6);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch (_) {}
        }, 700);
      },
    };
  }

  // 3. Lo-Fi Chill Bed (for Podcasts & Deep Discussion)
  public playLoFiChillBed() {
    this.initContext();
    this.stopBgm();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.activeBgmType = 'lofi';

    const interval = setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx) {
        clearInterval(interval);
        return;
      }
      const now = this.ctx.currentTime;
      const notes = [220, 261.63, 329.63, 392.0]; // Am7
      const randomNote = notes[Math.floor(Math.random() * notes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(randomNote, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.9);
    }, 1200);

    this.currentBgmNodes = {
      stop: () => clearInterval(interval),
    };
  }

  // --- Studio Sound Effects (Sound Cart & Radio Drama) ---

  // 1. On-Air Jingle (FM Radio Chime)
  public playJingle() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1);
    });

    this.currentLeftLevel = 1.5;
    this.currentRightLevel = 1.8;
  }

  // 2. Breaking News Stinger Fanfare
  public playNewsStinger() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const tones = [
      { f: 440, t: 0, d: 0.12 },
      { f: 440, t: 0.14, d: 0.12 },
      { f: 440, t: 0.28, d: 0.12 },
      { f: 587.33, t: 0.45, d: 0.5 },
      { f: 554.37, t: 1.0, d: 0.2 },
      { f: 659.25, t: 1.25, d: 0.8 },
    ];

    tones.forEach(({ f, t, d }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.28, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + t);
      osc.stop(now + t + d + 0.1);
    });

    this.currentLeftLevel = 2.2;
    this.currentRightLevel = 2.0;
  }

  // 3. Station ID Whoosh & Sub drop
  public playStationWhoosh() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(160, now);
    sub.frequency.exponentialRampToValueAtTime(35, now + 0.7);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    sub.connect(subGain);
    subGain.connect(this.masterGain!);
    sub.start(now);
    sub.stop(now + 0.8);

    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.8);
    filter.Q.value = 3;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + 0.85);

    this.currentLeftLevel = 1.0;
    this.currentRightLevel = 1.4;
  }

  // 4. Censor Bleep (Standard 1000Hz Tone)
  public playCensorBeep(duration = 0.5) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.setValueAtTime(0.35, now + duration - 0.02);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    this.currentLeftLevel = -2;
    this.currentRightLevel = -2;
  }

  // 5. Studio Applause
  public playApplause() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.0;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (0.8 + Math.sin(i / 1000) * 0.2);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gain.gain.setValueAtTime(0.3, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + duration + 0.1);

    this.currentLeftLevel = 0.5;
    this.currentRightLevel = 0.8;
  }

  // 6. Phone Ring (for Phone-In show)
  public playPhoneRing() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [0, 0.4].forEach((delay) => {
      const osc1 = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc1.frequency.setValueAtTime(440, now + delay);
      osc2.frequency.setValueAtTime(480, now + delay);

      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain!);

      osc1.start(now + delay);
      osc2.start(now + delay);
      osc1.stop(now + delay + 0.35);
      osc2.stop(now + delay + 0.35);
    });
  }

  // 7. Radio Drama Door Creak
  public playDoorCreak() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.3);
    osc.frequency.linearRampToValueAtTime(240, now + 0.6);
    osc.frequency.linearRampToValueAtTime(90, now + 0.9);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 1.05);
  }

  // 8. Countdown Tone
  public playCountdownTone(isFinal = false) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1760 : 880, now);

    const dur = isFinal ? 0.4 : 0.12;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  // --- Student Rehearsal Recording (MediaRecorder) ---
  public async startRecording(): Promise<boolean> {
    try {
      if (!this.micStream) {
        await this.enableMicrophone();
      }
      if (!this.micStream) return false;

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.micStream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };
      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error('Error starting recording:', err);
      return false;
    }
  }

  public stopRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      this.mediaRecorder.stop();
    });
  }
}

export const studioAudio = new AudioEngine();
