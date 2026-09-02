// Cuánta página recorre un centímetro de dedo. A 1 sería idéntico al móvil,
// pero la página es mucho más alta que la pantalla del teléfono.
const GAIN = 1.9;
// Cuánto se frena la inercia en cada fotograma tras soltar.
const FRICTION = 0.94;
// Por debajo de esto la inercia se considera terminada.
const STOP = 0.4;
// Peso de la última medida en la velocidad suavizada.
const VELOCITY_MIX = 0.35;

/**
 * Mueve la página desde el mando. Los mensajes llegan al ritmo de la red, así
 * que se acumulan y se aplican una vez por fotograma: eso es lo que hace que
 * se sienta continuo en vez de a tirones. Al soltar el dedo queda inercia.
 */
export class ScrollDriver {
  private pending = 0;
  private velocity = 0;
  private isCoasting = false;
  private raf = 0;

  push(dy: number) {
    this.pending += dy * GAIN;
    this.isCoasting = false;
    this.start();
  }

  /** El dedo se levantó: sigue rodando con lo que llevaba. */
  release() {
    this.isCoasting = true;
    this.start();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.pending = 0;
    this.velocity = 0;
    this.isCoasting = false;
  }

  private start() {
    if (this.raf !== 0) return;
    this.raf = requestAnimationFrame(this.step);
  }

  private step = () => {
    this.raf = 0;
    if (this.isCoasting) return this.coast();

    const dy = this.pending;
    this.pending = 0;
    this.velocity += (dy - this.velocity) * VELOCITY_MIX;
    if (dy !== 0) window.scrollBy(0, dy);
    this.start();
  };

  private coast() {
    if (Math.abs(this.velocity) < STOP) {
      this.velocity = 0;
      return;
    }
    window.scrollBy(0, this.velocity);
    this.velocity *= FRICTION;
    this.start();
  }
}
