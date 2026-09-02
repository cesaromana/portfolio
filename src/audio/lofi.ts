// Música de fondo generada en el navegador con Web Audio: un pad de acordes
// lento y un pulso suave. Sin archivos, sin copyright, volumen bajo.

const BPM = 68;
const MASTER_GAIN = 0.04;
const CHORDS: number[][] = [
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [130.81, 164.81, 196.0, 246.94], // Cmaj7
  [196.0, 246.94, 293.66, 349.23], // G
];

export class LofiLoop {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private bar = 0;

  private isDucked = false;

  get isOn() {
    return this.ctx !== null;
  }

  /** Silencia sin apagar: otra cosa está sonando. */
  duck(isQuiet: boolean) {
    this.isDucked = isQuiet;
    if (!this.ctx || !this.master) return;
    const target = isQuiet ? 0 : MASTER_GAIN;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.5);
  }

  async start() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.gain.linearRampToValueAtTime(this.isDucked ? 0 : MASTER_GAIN, this.ctx.currentTime + 2);
    this.master.connect(this.ctx.destination);
    this.bar = 0;
    this.playBar();
    this.timer = window.setInterval(() => this.playBar(), this.barSeconds() * 1000);
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    window.setTimeout(() => ctx.close(), 900);
    this.ctx = null;
    this.master = null;
  }

  private barSeconds() {
    return (60 / BPM) * 4;
  }

  private playBar() {
    if (!this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime;
    const chord = CHORDS[this.bar % CHORDS.length];
    chord.forEach((f) => this.pad(f, t0, this.barSeconds()));
    for (let beat = 0; beat < 4; beat++) this.tick(t0 + beat * (60 / BPM), beat % 2 === 0);
    this.bar += 1;
  }

  private pad(freq: number, t: number, dur: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 8;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.6);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.4);
    osc.connect(filter).connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.5);
  }

  private tick(t: number, isLow: boolean) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isLow ? 110 : 1800, t);
    osc.frequency.exponentialRampToValueAtTime(isLow ? 50 : 1200, t + 0.08);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(isLow ? 0.28 : 0.03, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (isLow ? 0.18 : 0.05));
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.2);
  }
}
