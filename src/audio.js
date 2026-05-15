// ============================================================
// Parasite Depths — Procedural Audio System (Web Audio API)
// ============================================================

class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicPlaying = false;
        this.musicNodes = [];
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.ctx.destination);
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.15;
            this.musicGain.connect(this.masterGain);
            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.6;
            this.sfxGain.connect(this.masterGain);
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio not available:', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    _playTone(freq, dur, type = 'sine', vol = 0.3) {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(vol, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        o.connect(g); g.connect(this.sfxGain);
        o.start(this.ctx.currentTime); o.stop(this.ctx.currentTime + dur);
    }

    _playNoise(dur, filterFreq = 1000, vol = 0.2) {
        if (!this.ctx) return;
        const sz = this.ctx.sampleRate * dur;
        const buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource(); src.buffer = buf;
        const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterFreq;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(vol, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        src.connect(f); f.connect(g); g.connect(this.sfxGain); src.start();
    }

    playSwim() { this._playNoise(0.15, 400, 0.08); }

    playBite() { this._playNoise(0.12, 2000, 0.35); this._playTone(200, 0.1, 'sawtooth', 0.2); }

    playPossess() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(200, t);
        o.frequency.exponentialRampToValueAtTime(800, t + 0.4);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.connect(g); g.connect(this.sfxGain); o.start(t); o.stop(t + 0.5);
        this._playTone(600, 0.3, 'triangle', 0.15);
    }

    playEject() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(600, t);
        o.frequency.exponentialRampToValueAtTime(150, t + 0.3);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        o.connect(g); g.connect(this.sfxGain); o.start(t); o.stop(t + 0.35);
    }

    playCollect() {
        this._playTone(880, 0.12, 'sine', 0.25);
        setTimeout(() => this._playTone(1100, 0.15, 'sine', 0.2), 80);
    }

    playImpact() { this._playNoise(0.15, 300, 0.4); this._playTone(80, 0.2, 'sine', 0.3); }

    playDeath() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(400, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.8);
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
        o.connect(g); g.connect(this.sfxGain); o.start(t); o.stop(t + 1.0);
        this._playNoise(0.6, 500, 0.25);
    }

    playDodge() { this._playTone(500, 0.08, 'triangle', 0.12); }

    playBiomeTransition() {
        this._playTone(300, 0.5, 'sine', 0.2);
        setTimeout(() => this._playTone(450, 0.4, 'sine', 0.18), 200);
        setTimeout(() => this._playTone(600, 0.3, 'sine', 0.15), 400);
    }

    startMusic() {
        if (!this.ctx || this.musicPlaying) return;
        this.musicPlaying = true;
        const d1 = this.ctx.createOscillator(); d1.type = 'sine'; d1.frequency.value = 55;
        const d1g = this.ctx.createGain(); d1g.gain.value = 0.3;
        d1.connect(d1g); d1g.connect(this.musicGain); d1.start();
        const d2 = this.ctx.createOscillator(); d2.type = 'sine'; d2.frequency.value = 82;
        const d2g = this.ctx.createGain(); d2g.gain.value = 0.15;
        d2.connect(d2g); d2g.connect(this.musicGain); d2.start();
        const bSz = this.ctx.sampleRate * 4;
        const nBuf = this.ctx.createBuffer(1, bSz, this.ctx.sampleRate);
        const nD = nBuf.getChannelData(0);
        for (let i = 0; i < bSz; i++) nD[i] = Math.random() * 2 - 1;
        const nSrc = this.ctx.createBufferSource(); nSrc.buffer = nBuf; nSrc.loop = true;
        const nF = this.ctx.createBiquadFilter(); nF.type = 'lowpass'; nF.frequency.value = 200;
        const nG = this.ctx.createGain(); nG.gain.value = 0.12;
        nSrc.connect(nF); nF.connect(nG); nG.connect(this.musicGain); nSrc.start();
        const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.15;
        const lG = this.ctx.createGain(); lG.gain.value = 8;
        lfo.connect(lG); lG.connect(d1.frequency); lfo.start();
        this.musicNodes = [d1, d2, nSrc, lfo];
    }

    stopMusic() {
        this.musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
        this.musicNodes = [];
        this.musicPlaying = false;
    }
}

const AUDIO = new AudioSystem();
