import Peer, { type DataConnection } from 'peerjs';
import { BLOCKS, Calibrator, TICK_MS } from './calibration';
import { peerOptions } from './peer-config';
import { PointerLoop } from './pointer-loop';
import { ScrollDriver } from './scroll-driver';
import { orientToPoint } from './pointer-map';
import { SECTIONS, type DesktopMsg, type HintKey, type Orient, type Phase, type PhoneMsg } from './protocol';

export type SenseState = { peerId: string | null; phase: Phase; progress: number; hint: HintKey; section: string; error: string | null };

const HINT_WAIT: HintKey = 'wait';
const HINT_STILL: HintKey = 'still';
const HINT_SHAKEN: HintKey = 'shaken';
const HINT_READY: HintKey = 'ready';
const HINT_LOST: HintKey = 'lost';
const HAPTIC = { ready: 40, section: 30, click: 12 };

/** Lado PC del mando: señalización, calibración y estado. */
export class SenseSession {
  readonly pointer = new PointerLoop();
  private scroller = new ScrollDriver();
  state: SenseState = { peerId: null, phase: 'waiting', progress: 0, hint: HINT_WAIT, section: SECTIONS[0].id, error: null };
  private peer: Peer;
  private conn: DataConnection | null = null;
  private calibrator = new Calibrator();
  private ticker: number | null = null;
  private onChange: (s: SenseState) => void;

  constructor(onChange: (s: SenseState) => void) {
    this.onChange = onChange;
    this.peer = new Peer(peerOptions());
    this.peer.on('open', (id) => this.patch({ peerId: id }));
    this.peer.on('error', (e) => this.patch({ error: e.message }));
    this.peer.on('connection', (c) => this.attach(c));
    this.pointer.start();
  }

  destroy() {
    this.scroller.stop();
    this.stopTicker();
    this.pointer.stop();
    this.peer.destroy();
  }

  recalibrate() {
    this.calibrator.reset();
    this.pointer.active = false;
    this.patch({ phase: 'calibrating', progress: 0, hint: HINT_STILL });
    this.stopTicker();
    this.ticker = window.setInterval(() => this.tick(), TICK_MS);
  }

  reset() {
    this.conn?.close();
    this.conn = null;
    this.calibrator.reset();
    this.pointer.active = false;
    this.patch({ phase: 'waiting', progress: 0, hint: HINT_WAIT });
  }

  private attach(c: DataConnection) {
    this.conn?.close();
    this.conn = c;
    c.on('data', (d) => this.receive(d as PhoneMsg));
    c.on('close', () => this.lost());
  }

  private lost() {
    this.stopTicker();
    this.pointer.active = false;
    this.patch({ phase: 'lost', hint: HINT_LOST });
  }

  private receive(m: PhoneMsg) {
    if (m.t === 'hello' || m.t === 'recalibrate') return this.recalibrate();
    if (m.t === 'orient') return this.orient({ a: m.a, b: m.b, g: m.g });
    if (m.t === 'press') return this.press(m.down);
    if (m.t === 'button') return this.button(m.name, m.down);
    if (m.t === 'scroll') return this.scroll(m.dy, m.end);
  }

  private orient(o: Orient) {
    const { phase } = this.state;
    if (phase === 'calibrating') return this.calibrator.push(o);
    const base = this.calibrator.baseline;
    if (phase !== 'ready' || !base) return;
    this.pointer.target = orientToPoint(o, base);
  }

  private press(isDown: boolean) {
    this.pointer.pressed = isDown;
    if (isDown) this.send({ t: 'haptic', ms: HAPTIC.click });
  }

  private button(name: 'a' | 'b', isDown: boolean) {
    this.pointer[name] = isDown;
    if (name === 'a') this.pointer.pressed = isDown;
    if (isDown) this.send({ t: 'haptic', ms: HAPTIC.click });
  }

  private scroll(dy: number, isEnd?: boolean) {
    if (isEnd) this.scroller.release();
    else this.scroller.push(dy);
    const id = sectionAtCenter();
    if (id && id !== this.state.section) {
      this.send({ t: 'haptic', ms: HAPTIC.section });
      this.patch({ section: id });
    }
  }

  private tick() {
    const cal = this.calibrator;
    const isDone = cal.tick();
    const hint = cal.shaken ? HINT_SHAKEN : HINT_STILL;
    this.patch({ progress: cal.progress, hint });
    if (!isDone) return;
    this.stopTicker();
    this.pointer.center();
    this.pointer.active = true;
    this.patch({ phase: 'ready', progress: BLOCKS, hint: HINT_READY });
    this.send({ t: 'haptic', ms: HAPTIC.ready });
  }

  private stopTicker() {
    if (this.ticker) window.clearInterval(this.ticker);
    this.ticker = null;
  }

  private send(m: DesktopMsg) {
    if (this.conn?.open) this.conn.send(m);
  }

  private patch(p: Partial<SenseState>) {
    const before = this.state;
    this.state = { ...before, ...p };
    this.onChange(this.state);
    const { phase, progress, section, hint } = this.state;
    const isSame =
      before.phase === phase && before.progress === progress && before.section === section && before.hint === hint;
    if (phase !== 'waiting' && !isSame) this.send({ t: 'state', phase, progress, blocks: BLOCKS, section, hint });
  }
}

/** Sección que ocupa el centro de la pantalla, para etiquetar el mando. */
function sectionAtCenter(): string | null {
  const middle = window.innerHeight / 2;
  for (const { id } of SECTIONS) {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top <= middle && rect.bottom >= middle) return id;
  }
  return null;
}
