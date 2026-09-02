type Listener = (isBusy: boolean) => void;

/**
 * Quién manda en el audio. Cuando algo con sonido propio (Spotify, Sonic)
 * toma el turno, la música de fondo se calla sola.
 */
class AudioFocus {
  private holders = new Set<string>();
  private listeners = new Set<Listener>();

  get isBusy() {
    return this.holders.size > 0;
  }

  claim(id: string) {
    if (this.holders.has(id)) return;
    this.holders.add(id);
    this.emit();
  }

  release(id: string) {
    if (!this.holders.delete(id)) return;
    this.emit();
  }

  /** El interruptor de la barra manda sobre todo lo demás. */
  clear() {
    if (this.holders.size === 0) return;
    this.holders.clear();
    this.emit();
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.isBusy));
  }
}

export const audioFocus = new AudioFocus();
