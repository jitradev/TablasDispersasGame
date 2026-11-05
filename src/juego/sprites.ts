// Sprites en pixel art, dibujados a mano como filas de caracteres. Cada carácter es
// un color de la paleta (tonos de tierra, pergamino y oro viejo); el punto es transparente.

export const PAL: Record<string, string> = {
  '0': '#1c1712', // tinta
  '1': '#4a2c2a', // vino
  '2': '#8c2f1f', // brasa
  '3': '#c8702e', // madera
  '4': '#e3b74f', // oro viejo
  '5': '#a9c46c', // musgo claro
  '6': '#4f7a3a', // verde bosque
  '7': '#2f5b4a', // pino
  '8': '#2b3a3f', // pizarra
  '9': '#4b6a78', // acero
  a: '#7fa3a8',
  b: '#b9d3c2', // pálido
  c: '#f2e6c9', // pergamino
  d: '#b8ab8f', // piedra clara
  e: '#7a6f5c', // piedra
  f: '#3d362c', // piedra oscura
  g: '#d9a066', // piel
  h: '#6b3e26', // cuero
};

const S: Record<string, string[]> = {
  heroe1: [
    '....0000....',
    '...099990...',
    '..09999990..',
    '..09444490..',
    '..04044040..',
    '..04444440..',
    '...004400...',
    '..03333330..',
    '.0433333340.',
    '.0433333340.',
    '..03366330..',
    '..03333330..',
    '...088880...',
    '...080080...',
    '...080080...',
    '..000.000...',
  ],
  heroe2: [
    '....0000....',
    '...099990...',
    '..09999990..',
    '..09444490..',
    '..04044040..',
    '..04444440..',
    '...004400...',
    '..03333330..',
    '.0433333340.',
    '.0433333340.',
    '..03366330..',
    '..03333330..',
    '...088880...',
    '..080..080..',
    '..080..080..',
    '.000....000.',
  ],
  cofre: [
    '.000000000000.',
    '03333333333330',
    '03222222222230',
    '03222222222230',
    '00000044000000',
    '03333344333330',
    '03222200222230',
    '03222222222230',
    '03222222222230',
    '03333333333330',
    '.000000000000.',
  ],
  flecha: [
    '....dddd',
    '.....ddd',
    '....3d.d',
    '...3...d',
    '..3.....',
    '.3......',
    'c3......',
    'cc......',
  ],
  vela: [
    '...4....',
    '...3....',
    '..0c0...',
    '..0c0...',
    '..0d0...',
    '..0d0...',
    '.00000..',
    '........',
  ],
  antorcha: [
    '...3....',
    '..343...',
    '..343...',
    '...4....',
    '...0....',
    '...e....',
    '...e....',
    '...e....',
  ],
  manzana: [
    '....6...',
    '...6....',
    '.02220..',
    '0222c20.',
    '0222220.',
    '0222220.',
    '.00000..',
    '........',
  ],
  llave: [
    '.00.....',
    '0440....',
    '0440....',
    '.04000..',
    '..04444.',
    '..0404..',
    '........',
    '........',
  ],
  gema: [
    '........',
    '..0000..',
    '.0bbbb0.',
    '0bcbbaa0',
    '.0baa90.',
    '..0990..',
    '...00...',
    '........',
  ],
  pocion: [
    '...00...',
    '...dd...',
    '..0dd0..',
    '.022220.',
    '.022c20.',
    '.022220.',
    '..0000..',
    '........',
  ],
  hacha: [
    '.0000...',
    '0ddddd0.',
    '0dcdd00.',
    '.0dd03..',
    '....03..',
    '....03..',
    '....03..',
    '....00..',
  ],
  moneda: [
    '..0000..',
    '.044440.',
    '.04c440.',
    '.044340.',
    '.044340.',
    '.043340.',
    '..0000..',
    '........',
  ],
  escudo: [
    '00000000',
    '09999990',
    '099cc990',
    '09cccc90',
    '099cc990',
    '.099990.',
    '..0990..',
    '...00...',
  ],
  mapa: [
    '0000000.',
    '0cccccc0',
    '0c2cdcc0',
    '0cc2ccc0',
    '0cdc22c0',
    '0ccccc20',
    '0000000.',
    '........',
  ],
  fantasma: [
    '...000000...',
    '..0cccccc0..',
    '.0cccccccc0.',
    '.0c00cc00c0.',
    '.0c00cc00c0.',
    '.0cccccccc0.',
    '.0cccc22cc0.',
    '.0cccccccc0.',
    '.0cccccccc0.',
    '.0cc0cc0cc0.',
    '.00.0..0.00.',
    '............',
  ],
  lapida: [
    '..000000..',
    '.0dddddd0.',
    '0dddddddd0',
    '0ddeeeedd0',
    '0dddddddd0',
    '0ddeeeedd0',
    '0dddddddd0',
    '0dddddddd0',
    '0dddddddd0',
    '0000000000',
    '6666666666',
  ],
  corazon: [
    '.00.00.',
    '0220220',
    '0222c20',
    '0222220',
    '.02220.',
    '..020..',
    '...0...',
  ],
  corazonVacio: [
    '.00.00.',
    '0ff0ff0',
    '0fffff0',
    '0fffff0',
    '.0fff0.',
    '..0f0..',
    '...0...',
  ],
  estrella: [
    '...0...',
    '..040..',
    '0004000',
    '0444440',
    '.04440.',
    '.04040.',
    '.00.00.',
  ],
  estrellaVacia: [
    '...0...',
    '..0f0..',
    '000f000',
    '0fffff0',
    '.0fff0.',
    '.0f0f0.',
    '.00.00.',
  ],
  buho: [
    '...00......00...',
    '...030....030...',
    '...0333003330...',
    '..033333333330..',
    '.03cccc33cccc30.',
    '.0cc00c33c00cc0.',
    '.0cc00c33c00cc0.',
    '.03cccc44cccc30.',
    '.03333344333330.',
    '.03dd333333dd30.',
    '.033dd3333dd330.',
    '.0333dd33dd3330.',
    '..033333333330..',
    '...0444004440...',
    '....00....00....',
    '................',
  ],
  gloton: [
    '....0000000000000000....',
    '...033333333333333330...',
    '..03222222222222222230..',
    '..0322bb22222222bb2230..',
    '..0322b022222222b02230..',
    '..03222222222222222230..',
    '..00000000000000000000..',
    '..0c0c0c0c0c0c0c0c0c00..',
    '..01111111111111111110..',
    '..01111111222211111110..',
    '..01111112222221111110..',
    '..0c0c0c0c0c0c0c0c0c00..',
    '..00000000000000000000..',
    '..03333333344333333330..',
    '..03222222244222222230..',
    '..03222222200222222230..',
    '..03222222222222222230..',
    '..03333333333333333330..',
    '...000000000000000000...',
  ],
};


// ------------------------------------------------------------------ la compañía (personajes propios)
const RETRATOS: Record<string, string[]> = {
  hilda: [
    '................',
    '.....000000.....',
    '....02222220....',
    '...0222222220...',
    '...02gggggg20...',
    '...0g0ggg0gg0...',
    '...0gggggggg0...',
    '...02gg11gg20...',
    '..2202gggg2022..',
    '..20.0hhhh0.02..',
    '..2.0hhhhhh0.2..',
    '...0ghh44hhg0...',
    '...0ghhhhhhg0...',
    '...0hhhhhhhh0...',
    '...0000000000...',
    '................',
  ],
  bastian: [
    '................',
    '......0000......',
    '.....0hhhh0.....',
    '..000hhhhhh000..',
    '.0hhhhhhhhhhhh0.',
    '..00gggggggg00..',
    '...0g0ggg0gg0...',
    '...0gggggggg0...',
    '...0ge1111eg0...',
    '....0gggggg0....',
    '...0999999990...',
    '..0ccccc999990..',
    '..0c2c2c999990..',
    '..0ccccc999990..',
    '..000000000000..',
    '................',
  ],
  lis: [
    '................',
    '......0000......',
    '.....066660.....',
    '....06666660....',
    '...0666666660...',
    '...066gggg660...',
    '...06g0gg0g60...',
    '...06gggggg60...',
    '...066g11g660...',
    '....06gggg60....',
    '...0776666770...',
    '..077777777770..',
    '..074777777470..',
    '..077777777770..',
    '..000000000000..',
    '................',
  ],
};
// Rina y Ulf: los retratos de Hilda y Bastian con otros colores
const recolor = (filas: string[], mapa: Record<string, string>) => filas.map((f) => [...f].map((ch) => mapa[ch] ?? ch).join(''));
RETRATOS.rina = recolor(RETRATOS.hilda, { '2': '1', h: '6', '4': 'b' });
RETRATOS.ulf = recolor(RETRATOS.bastian, { h: '8', '9': 'h', c: 'd', '2': '9' });
Object.assign(S, RETRATOS);

/** El caminante de cada personaje: el héroe base con sus colores. */
const COLORES: Record<string, Record<string, string>> = {
  hilda: { '9': '2', '3': 'h', '4': 'g', '6': '4', '8': 'f' },
  bastian: { '9': 'h', '3': '9', '4': 'g', '6': '4', '8': 'f' },
  lis: { '9': '6', '3': '7', '4': 'g', '6': '4', '8': 'h' },
  rina: { '9': '1', '3': '6', '4': 'g', '6': 'b', '8': 'f' },
  ulf: { '9': '8', '3': 'h', '4': 'g', '6': '4', '8': '0' },
};
for (const [quien, mapa] of Object.entries(COLORES))
  for (const f of ['heroe1', 'heroe2']) S[`${quien}-${f}`] = S[f].map((fila) => [...fila].map((ch) => mapa[ch] ?? ch).join(''));

export type NombreSprite = keyof typeof S;
export const SPRITES = S;

const cache = new Map<string, HTMLCanvasElement>();

/** El sprite como un canvas de 1 px por carácter. */
export function sprite(nombre: string): HTMLCanvasElement {
  const hit = cache.get(nombre);
  if (hit) return hit;
  const filas = S[nombre] ?? S.gema;
  const w = Math.max(...filas.map((f) => f.length));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = filas.length;
  const g = c.getContext('2d')!;
  filas.forEach((f, y) =>
    [...f].forEach((ch, x) => {
      const col = PAL[ch];
      if (!col) return;
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }),
  );
  cache.set(nombre, c);
  return c;
}

/** Dibuja un sprite a escala entera, sin suavizado. */
export function pintar(g: CanvasRenderingContext2D, nombre: string, x: number, y: number, escala = 1, alfa = 1) {
  const s = sprite(nombre);
  g.save();
  g.globalAlpha = alfa;
  g.imageSmoothingEnabled = false;
  g.drawImage(s, Math.round(x), Math.round(y), s.width * escala, s.height * escala);
  g.restore();
}

/** Un sprite como data URL, para usarlo en el DOM (retratos, estrellas). */
export function urlSprite(nombre: string, escala = 4): string {
  const s = sprite(nombre);
  const c = document.createElement('canvas');
  c.width = s.width * escala;
  c.height = s.height * escala;
  const g = c.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  g.drawImage(s, 0, 0, c.width, c.height);
  return c.toDataURL();
}
