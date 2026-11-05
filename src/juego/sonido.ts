// Los sonidos de la web, hechos con Web Audio (sin ficheros): efectos de 8 bits y
// la música del prólogo, compuesta para la práctica (melodía propia, en modo
// dórico, con bordón, cuerdas, flauta y arpa, al estilo de la fantasía épica).
//
// Safari es estricto: el audio solo arranca dentro de un gesto de la persona
// (clic, toque o tecla) y a veces deja el contexto «suspended» o «interrupted».
// Por eso el contexto se desbloquea en el primer gesto, se reanuda siempre que
// haga falta y las notas se programan con un pequeño margen hacia delante.

export type Sonido = 'paso' | 'bien' | 'fallo' | 'fantasma' | 'golpe' | 'victoria' | 'click' | 'sube' | 'jefe' | 'inicio';

const CLAVE = 'lord-of-eda-sonido';
let ctx: AudioContext | null = null;
let salida: GainNode | null = null;
let eco: ConvolverNode | null = null;
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
  if (s) pararMusica(0.3);
  oyentes.forEach((f) => f(s));
}
export function alCambiar(f: (s: boolean) => void) {
  oyentes.add(f);
  return () => oyentes.delete(f);
}

function crear(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    salida = ctx.createGain();
    salida.gain.value = 0.9;
    salida.connect(ctx.destination);
    // una sala con eco, hecha de ruido que se apaga: le da cuerpo a la música
    eco = ctx.createConvolver();
    const n = Math.floor(ctx.sampleRate * 2.6);
    const imp = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const x = imp.getChannelData(c);
      for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4);
    }
    eco.buffer = imp;
    eco.connect(salida);
    return ctx;
  } catch {
    return null;
  }
}

function reanudar() {
  if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
}

/** El primer gesto desbloquea el audio (Safari y móviles lo necesitan). */
function desbloquear() {
  const a = crear();
  if (!a) return;
  reanudar();
  try {
    // un sonido vacío, dentro del gesto, deja el contexto en marcha en Safari
    const b = a.createBuffer(1, 1, 22050);
    const s = a.createBufferSource();
    s.buffer = b;
    s.connect(a.destination);
    s.start(0);
  } catch {
    /* nada */
  }
}
if (typeof window !== 'undefined') {
  for (const ev of ['pointerdown', 'touchend', 'keydown', 'click']) window.addEventListener(ev, desbloquear, { capture: true, passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) reanudar();
  });
}

function audio(): AudioContext | null {
  if (silencio) return null;
  const a = crear();
  if (!a) return null;
  reanudar();
  return a;
}

/** Cuándo empieza algo: con margen, para que Safari no se coma el principio. */
const ya = (a: AudioContext, t0 = 0) => a.currentTime + 0.03 + t0;

/** Una nota: frecuencia, cuándo empieza (s), cuánto dura (s), onda y volumen. */
function nota(a: AudioContext, f: number, t0: number, d: number, onda: OscillatorType = 'square', vol = 0.06, hasta?: number) {
  const o = a.createOscillator();
  const g = a.createGain();
  const t = ya(a, t0);
  o.type = onda;
  o.frequency.setValueAtTime(f, t);
  if (hasta) o.frequency.exponentialRampToValueAtTime(hasta, t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(salida!);
  o.start(t);
  o.stop(t + d + 0.05);
}

/** Un metal (trompa, trompeta): diente de sierra con un filtro que se abre. */
function metal(a: AudioContext, f: number, t0: number, d: number, vol = 0.05, conEco = 0.3) {
  const t = ya(a, t0);
  const g = a.createGain();
  const fl = a.createBiquadFilter();
  fl.type = 'lowpass';
  fl.Q.value = 1.2;
  fl.frequency.setValueAtTime(300, t);
  fl.frequency.exponentialRampToValueAtTime(2600, t + 0.08);
  fl.frequency.exponentialRampToValueAtTime(1400, t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.04);
  g.gain.setValueAtTime(vol * 0.85, t + Math.max(0.05, d - 0.12));
  g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.25);
  for (const det of [-6, 5]) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.detune.value = det;
    o.connect(fl);
    o.start(t);
    o.stop(t + d + 0.3);
  }
  fl.connect(g);
  g.connect(salida!);
  if (conEco) {
    const e = a.createGain();
    e.gain.value = conEco;
    g.connect(e).connect(eco!);
  }
}

/** Un timbal: una nota grave que cae, con un golpe de ruido. */
function timbal(a: AudioContext, t0: number, vol = 0.2, f = 70) {
  const t = ya(a, t0);
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(f * 1.6, t);
  o.frequency.exponentialRampToValueAtTime(f, t + 0.12);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  o.connect(g).connect(salida!);
  const e = a.createGain();
  e.gain.value = 0.4;
  g.connect(e).connect(eco!);
  o.start(t);
  o.stop(t + 1);
  ruido(a, t0, 0.08, vol * 0.25, 900);
}

function ruido(a: AudioContext, t0: number, d: number, vol = 0.05, filtro?: number) {
  const t = ya(a, t0);
  const n = Math.max(1, Math.floor(a.sampleRate * d));
  const b = a.createBuffer(1, n, a.sampleRate);
  const x = b.getChannelData(0);
  for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = a.createBufferSource();
  const g = a.createGain();
  g.gain.value = vol;
  s.buffer = b;
  if (filtro) {
    const fl = a.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = filtro;
    s.connect(fl).connect(g);
  } else s.connect(g);
  g.connect(salida!);
  s.start(t);
}

/** Un platillo: ruido agudo que se apaga despacio. */
function platillo(a: AudioContext, t0: number, vol = 0.05) {
  const t = ya(a, t0);
  const n = Math.floor(a.sampleRate * 1.6);
  const b = a.createBuffer(1, n, a.sampleRate);
  const x = b.getChannelData(0);
  for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
  const s = a.createBufferSource();
  const fl = a.createBiquadFilter();
  fl.type = 'highpass';
  fl.frequency.value = 5000;
  const g = a.createGain();
  g.gain.value = vol;
  s.buffer = b;
  s.connect(fl).connect(g).connect(salida!);
  s.start(t);
}

const NOTA = (n: number) => 440 * Math.pow(2, (n - 69) / 12); // número MIDI a hercios

export function sonar(que: Sonido) {
  const a = audio();
  if (!a) return;
  switch (que) {
    case 'click':
      nota(a, 660, 0, 0.05, 'square', 0.035);
      break;
    case 'paso':
      nota(a, 180, 0, 0.04, 'triangle', 0.08);
      nota(a, 140, 0.09, 0.04, 'triangle', 0.08);
      break;
    case 'bien': // una moneda
      nota(a, 988, 0, 0.07, 'square', 0.045);
      nota(a, 1319, 0.07, 0.18, 'square', 0.045);
      break;
    case 'fallo':
      nota(a, 220, 0, 0.12, 'sawtooth', 0.045);
      nota(a, 165, 0.12, 0.25, 'sawtooth', 0.045);
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
      [523, 659, 784].forEach((f, i) => nota(a, f, i * 0.07, 0.1, 'square', 0.04));
      break;
    case 'jefe':
      timbal(a, 0, 0.22, 55);
      [50, 49, 48, 47].forEach((n, i) => metal(a, NOTA(n), 0.1 + i * 0.22, 0.24, 0.035));
      break;
    case 'inicio': {
      // la llamada de la trompa: empieza la misión
      timbal(a, 0, 0.16, 62);
      timbal(a, 0.18, 0.12, 62);
      const llamada: [number, number, number][] = [
        [50, 0.3, 0.32],
        [57, 0.64, 0.32],
        [62, 0.98, 0.7],
      ];
      llamada.forEach(([n, t, d]) => metal(a, NOTA(n), t, d, 0.045));
      metal(a, NOTA(45), 0.98, 0.7, 0.03);
      break;
    }
    case 'victoria': {
      // fanfarria: subida, acorde mayor sostenido, timbal y platillo
      timbal(a, 0, 0.2, 65);
      const sube: [number, number][] = [
        [60, 0],
        [64, 0.12],
        [67, 0.24],
        [72, 0.36],
      ];
      sube.forEach(([n, t]) => metal(a, NOTA(n), t, 0.13, 0.04));
      metal(a, NOTA(67), 0.52, 0.18, 0.04);
      metal(a, NOTA(72), 0.72, 1.1, 0.045);
      metal(a, NOTA(76), 0.72, 1.1, 0.035);
      metal(a, NOTA(64), 0.72, 1.1, 0.03);
      metal(a, NOTA(48), 0.72, 1.1, 0.04);
      timbal(a, 0.72, 0.24, 52);
      platillo(a, 0.72, 0.05);
      [84, 88, 91, 96].forEach((n, i) => nota(a, NOTA(n), 0.8 + i * 0.07, 0.25, 'triangle', 0.02));
      break;
    }
  }
}

// ------------------------------------------------------------------ la música del prólogo

let musica: { g: GainNode; fin: () => void } | null = null;

/** Para la música del prólogo, con un fundido. */
export function pararMusica(fundido = 2) {
  if (!musica || !ctx) return;
  const { g, fin } = musica;
  musica = null;
  const t = ctx.currentTime;
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(g.gain.value, t);
  g.gain.linearRampToValueAtTime(0.0001, t + fundido);
  setTimeout(fin, fundido * 1000 + 200);
}

/** La música del prólogo: un tema propio en re dórico que se repite mientras dura. */
export function musicaPrologo() {
  const a = audio();
  if (!a || musica) return;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, a.currentTime);
  g.gain.linearRampToValueAtTime(1, a.currentTime + 4);
  g.connect(salida!);
  const r = a.createGain();
  r.gain.value = 0.55;
  g.connect(r).connect(eco!);

  const nodos: AudioScheduledSourceNode[] = [];
  const pulso = 60 / 66; // negra a 66
  // acordes (de cuatro tiempos): Rem, Do, Sol/Re, Rem · Sib, Do, Rem, La
  const acordes = [
    [50, 57, 62, 65],
    [48, 55, 60, 64],
    [50, 55, 59, 62],
    [50, 57, 62, 65],
    [46, 53, 58, 62],
    [48, 55, 60, 64],
    [50, 57, 62, 65],
    [45, 52, 57, 61],
  ];
  // la melodía de la flauta (nota MIDI, tiempos); 0 es silencio
  const melodia: [number, number][] = [
    [0, 2], [69, 1], [74, 1],
    [76, 1.5], [77, 0.5], [76, 1], [74, 1],
    [72, 2], [74, 1], [71, 1],
    [69, 4],
    [0, 1], [65, 1], [67, 1], [69, 1],
    [72, 2], [70, 1], [69, 1],
    [74, 1.5], [76, 0.5], [77, 1], [76, 1],
    [74, 4],
  ];
  const vuelta = acordes.length * 4 * pulso;

  const cuerda = (n: number, t: number, d: number) => {
    // cuerdas: tres dientes de sierra desafinados, filtro suave y entrada lenta
    const fl = a.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = 900;
    const v = a.createGain();
    v.gain.setValueAtTime(0.0001, t);
    v.gain.linearRampToValueAtTime(0.018, t + 1.2);
    v.gain.setValueAtTime(0.018, t + d - 0.6);
    v.gain.linearRampToValueAtTime(0.0001, t + d + 0.4);
    for (const det of [-9, 0, 8]) {
      const o = a.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = NOTA(n);
      o.detune.value = det;
      o.connect(fl);
      o.start(t);
      o.stop(t + d + 0.5);
      nodos.push(o);
    }
    fl.connect(v).connect(g);
  };
  const flauta = (n: number, t: number, d: number) => {
    // una flauta de madera: seno con un poco de triángulo, vibrato que entra tarde
    const v = a.createGain();
    v.gain.setValueAtTime(0.0001, t);
    v.gain.linearRampToValueAtTime(0.05, t + 0.08);
    v.gain.setValueAtTime(0.045, t + d * 0.7);
    v.gain.linearRampToValueAtTime(0.0001, t + d + 0.15);
    const vib = a.createOscillator();
    const vg = a.createGain();
    vib.frequency.value = 5.2;
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(NOTA(n) * 0.006, t + Math.min(0.6, d));
    vib.connect(vg);
    for (const [onda, vol] of [
      ['sine', 1],
      ['triangle', 0.35],
    ] as [OscillatorType, number][]) {
      const o = a.createOscillator();
      const og = a.createGain();
      o.type = onda;
      o.frequency.value = NOTA(n);
      vg.connect(o.frequency);
      og.gain.value = vol;
      o.connect(og).connect(v);
      o.start(t);
      o.stop(t + d + 0.2);
      nodos.push(o);
    }
    vib.start(t);
    vib.stop(t + d + 0.2);
    nodos.push(vib);
    v.connect(g);
  };
  const arpa = (n: number, t: number) => {
    const v = a.createGain();
    v.gain.setValueAtTime(0.022, t);
    v.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    const o = a.createOscillator();
    o.type = 'triangle';
    o.frequency.value = NOTA(n);
    o.connect(v).connect(g);
    o.start(t);
    o.stop(t + 1.7);
    nodos.push(o);
  };
  const bordon = (t: number, d: number) => {
    // el bordón: re y la graves, siempre debajo
    for (const n of [38, 45]) {
      const fl = a.createBiquadFilter();
      fl.type = 'lowpass';
      fl.frequency.value = 380;
      const v = a.createGain();
      v.gain.setValueAtTime(0.0001, t);
      v.gain.linearRampToValueAtTime(0.03, t + 2);
      v.gain.setValueAtTime(0.03, t + d - 1);
      v.gain.linearRampToValueAtTime(0.0001, t + d + 0.5);
      const o = a.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = NOTA(n);
      o.connect(fl).connect(v).connect(g);
      o.start(t);
      o.stop(t + d + 0.6);
      nodos.push(o);
    }
  };

  let vez = 0;
  let siguiente: ReturnType<typeof setTimeout> | undefined;
  const programar = (t0: number) => {
    bordon(t0, vuelta);
    acordes.forEach((ac, k) => {
      const t = t0 + k * 4 * pulso;
      ac.forEach((n) => cuerda(n, t, 4 * pulso));
      // el arpa sube y baja por el acorde, a corcheas
      [0, 1, 2, 3, 2, 1, 2, 3].forEach((i, j) => arpa(ac[i] + 12, t + j * 0.5 * pulso));
    });
    // la primera vuelta solo arpa y cuerdas; la flauta entra en la segunda
    if (vez > 0) {
      let t = t0;
      for (const [n, b] of melodia) {
        if (n) flauta(n, t, b * pulso * 0.96);
        t += b * pulso;
      }
    }
    vez++;
    siguiente = setTimeout(() => programar(t0 + vuelta), (t0 + vuelta - a.currentTime - 1) * 1000);
  };
  programar(a.currentTime + 0.1);

  musica = {
    g,
    fin: () => {
      clearTimeout(siguiente);
      for (const o of nodos) {
        try {
          o.stop();
        } catch {
          /* ya parado */
        }
      }
      g.disconnect();
    },
  };
}
