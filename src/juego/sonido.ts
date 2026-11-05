// Los sonidos de la web, hechos con Web Audio (sin ficheros): pitidos de 8 bits.
// El navegador no deja sonar nada hasta que la persona hace clic o pulsa una
// tecla, así que el contexto de audio se crea la primera vez que hace falta.

export type Sonido = 'paso' | 'bien' | 'fallo' | 'fantasma' | 'golpe' | 'victoria' | 'click' | 'sube' | 'jefe';

const CLAVE = 'lord-of-eda-sonido';
let ctx: AudioContext | null = null;
let silencio = (() => {
  try {
    return localStorage.getItem(CLAVE) === 'no';
  } catch {
    return false;
  }
})();
const oyentes = new Set<(s: boolean) => void>();

export const silenciado = () => silencio;
export function silenciar(s: boolean) {
  silencio = s;
  try {
    localStorage.setItem(CLAVE, s ? 'no' : 'si');
  } catch {
    /* sin almacenamiento */
  }
  oyentes.forEach((f) => f(s));
}
export function alCambiar(f: (s: boolean) => void) {
  oyentes.add(f);
  return () => oyentes.delete(f);
}

function audio(): AudioContext | null {
  if (silencio) return null;
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Una nota: frecuencia, cuándo empieza (s), cuánto dura (s), onda y volumen. */
function nota(a: AudioContext, f: number, t0: number, d: number, onda: OscillatorType = 'square', vol = 0.06, hasta?: number) {
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = onda;
  o.frequency.setValueAtTime(f, a.currentTime + t0);
  if (hasta) o.frequency.exponentialRampToValueAtTime(hasta, a.currentTime + t0 + d);
  g.gain.setValueAtTime(vol, a.currentTime + t0);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + d);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + t0);
  o.stop(a.currentTime + t0 + d + 0.02);
}

function ruido(a: AudioContext, t0: number, d: number, vol = 0.05) {
  const n = Math.floor(a.sampleRate * d);
  const b = a.createBuffer(1, n, a.sampleRate);
  const x = b.getChannelData(0);
  for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = a.createBufferSource();
  const g = a.createGain();
  g.gain.value = vol;
  s.buffer = b;
  s.connect(g).connect(a.destination);
  s.start(a.currentTime + t0);
}

export function sonar(que: Sonido) {
  const a = audio();
  if (!a) return;
  switch (que) {
    case 'click':
      nota(a, 660, 0, 0.05, 'square', 0.04);
      break;
    case 'paso':
      nota(a, 180, 0, 0.04, 'triangle', 0.08);
      nota(a, 140, 0.09, 0.04, 'triangle', 0.08);
      break;
    case 'bien': // una moneda
      nota(a, 988, 0, 0.07, 'square', 0.05);
      nota(a, 1319, 0.07, 0.18, 'square', 0.05);
      break;
    case 'fallo':
      nota(a, 220, 0, 0.12, 'sawtooth', 0.05);
      nota(a, 165, 0.12, 0.25, 'sawtooth', 0.05);
      break;
    case 'fantasma':
      nota(a, 520, 0, 0.5, 'sine', 0.06, 260);
      nota(a, 530, 0.05, 0.5, 'sine', 0.03, 250);
      break;
    case 'golpe':
      ruido(a, 0, 0.15, 0.08);
      nota(a, 120, 0, 0.15, 'square', 0.06, 60);
      break;
    case 'sube':
      [523, 659, 784].forEach((f, i) => nota(a, f, i * 0.07, 0.1, 'square', 0.045));
      break;
    case 'jefe':
      [196, 185, 175, 165].forEach((f, i) => nota(a, f, i * 0.16, 0.18, 'sawtooth', 0.04));
      break;
    case 'victoria':
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => nota(a, f, i * 0.11, i === 5 ? 0.45 : 0.1, 'square', 0.05));
      nota(a, 262, 0, 0.66, 'triangle', 0.06);
      break;
  }
}
