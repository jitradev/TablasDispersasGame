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


// ------------------------------------------------------------------ la compañía (personajes propios, con arquetipos de la fantasía épica)
const RETRATOS: Record<string, string[]> = {
  maga: [
    '.......00.......',
    '......0990......',
    '.....099990.....',
    '....09999990....',
    '...0999999990...',
    '..044444444440..',
    '0999999999999990',
    '..0ccggggggcc0..',
    '..0cg0gggg0gc0..',
    '..0cggggggggc0..',
    '..0ccgg11ggcc0..',
    '.0ccc0gggg0ccc0.',
    '.0cc0aaaaaa0cc0.',
    '.0c0aaaaaaaa0c0.',
    '.00aa4aaaa4aa00.',
    '.00000000000000.',
  ],
  hilda: [
    '.0............0.',
    '0d0..000000..0d0',
    '0d0.09999990.0d0',
    '.0d0999999990d0.',
    '..099999999990..',
    '..0e99999999e0..',
    '..02gggggggg20..',
    '..02g0gggg0g20..',
    '..02gggggggg20..',
    '..02ggghhggg20..',
    '.022gg1111gg220.',
    '.02.0hhhhhh0.20.',
    '.020hhhhhhhh020.',
    '.020hh4hh4hh020.',
    '..0hhhhhhhhhh0..',
    '..000000000000..',
  ],
  bastian: [
    '................',
    '....00000000....',
    '..00hhhhhhhh00..',
    '.0hh3hh33hh3hh0.',
    '.0h3hhhhhhhh3h0.',
    '.0hhgggggggghh0.',
    '.0hg0gggggg0gh0.',
    '.0hggggggggggh0.',
    '..0g2gg11gg2g0..',
    '...0gggggggg0...',
    '..0666cccc6660..',
    '.06666cccc66660.',
    '.066666cc666660.',
    '.066666cc666660.',
    '.06666666666660.',
    '.00000000000000.',
  ],
  rina: [
    '................',
    '.....000000.....',
    '....0cccccc0....',
    '...0cccccccc0...',
    '...0c444444c0...',
    '...0cggggggc0...',
    '.0g0cg0gg0gc0g0.',
    '..00cggggggc00..',
    '...0cgg11ggc0...',
    '..0cc0gggg0cc0..',
    '..0cc077770cc0..',
    '..0c07777770c0..',
    '.0c0777777770c0.',
    '.0c077b77b770c0.',
    '..077777777770..',
    '..000000000000..',
  ],
  ulf: [
    '................',
    '.....000000.....',
    '....0eeeeee0....',
    '...0eeeeeeee0...',
    '..0eeffffffee0..',
    '..0efhhhhhhfe0..',
    '..0efggggggfe0..',
    '..0efg0gg0gfe0..',
    '..0efggggggfe0..',
    '..0eegeeeegee0..',
    '.0eee777777eee0.',
    '0eee77777777eee0',
    '0ee77h7777h77ee0',
    '0e777h7777h777e0',
    '0e777777777777e0',
    '0000000000000000',
  ],
  lis: [
    '.......00.......',
    '......0220......',
    '....00022000....',
    '...0999999990...',
    '..099999999990..',
    '..09aaaaaaaa90..',
    '..049gggggg940..',
    '..04g0gggg0g40..',
    '..04gggggggg40..',
    '..044gg11gg440..',
    '.04409999990440.',
    '.040999aa999040.',
    '.04099444499040.',
    '..099999999990..',
    '..099999999990..',
    '..000000000000..',
  ],
};
Object.assign(S, RETRATOS);
// Los jefes de cada acto
const JEFES_SPR: Record<string, string[]> = {
  espectro: [
    '.......0..0..0..0.......',
    '......040040040040......',
    '......044444444440......',
    '.....04444244244440.....',
    '.....04444444444440.....',
    '....0aaaaaaaaaaaaaa0....',
    '...0a88888888888888a0...',
    '...0a88dddddddddd88a0...',
    '...0a8d050dddd050d8a0...',
    '...0a8ddddd00ddddd8a0...',
    '...0a88d0d0dd0d0d88a0...',
    '...0a88888888888888a0...',
    '..0a8888888888888888a0..',
    '.0a888884444444488888a0.',
    '0a888888880cc088888888a0',
    '0a8a8888880cc0888888a8a0',
    '0a88a888880cc088888a88a0',
    '0a888a88880cc08888a888a0',
    '.0a88a8a880cc088a8a88a0.',
    '..0.0a0.0a0cc0a0.0a0.0..',
    '...........00...........',
  ],
  troll: [
    '........................',
    '........00000000........',
    '......00eeeeeeee00......',
    '.....0eeeeeeeeeeee0.....',
    '....0eedeeeeeeeedee0....',
    '....0eeeffffffffeee0....',
    '....0eee44eeee44eee0....',
    '....0eeeeeddddeeeee0....',
    '....0eeeeeddddeeeee0....',
    '....0ef0000000000fe0....',
    '....0efc0c0cc0c0cfe0....',
    '..000eeeeeeeeeeeeee000..',
    '.0eeeeeeeeeeeeeeeeeeee0.',
    '0eedeeeeeeeeeeeeeeeedee0',
    '0ee0eeeeeeeeeeeeeeee0ee0',
    '0ee0eehhhhhhhhhhhhee0ee0',
    '0ee0eehhhhhhhhhhhhee0ee0',
    '0dd0eeeehhhhhhhheeee0dd0',
    '.00.0eeehhhhhhhheee0.00.',
    '....0eee0......0eee0....',
    '...0ffff0......0ffff0...',
    '...000000......000000...',
  ],
  nigromante: [
    '..........0000..........',
    '........00888800........',
    '.......0888888880.......',
    '......088888888880......',
    '.....08880000008880.....',
    '.....08800000000880.....',
    '.....08805500550880.....',
    '.....08800000000880.....',
    '....0888800000088880....',
    '...088888888888888880...',
    '..08888888888888888880..',
    '.0bb8888888888888888bb0.',
    '.0bb8888885bb5888888bb0.',
    '..08888888555588888880..',
    '..08888888888888888880..',
    '..08818888888888881880..',
    '.0881888888888888881880.',
    '.0818888888888888888180.',
    '088488888888888888884880',
    '000000000000000000000000',
  ],
  dragon: [
    '0..............................0',
    '00.........0........0.........00',
    '020.......0d0......0d0.......020',
    '0220......0d00000000d0......0220',
    '02220.....022222222220.....02220',
    '022220....022222222220....022220',
    '0222220..02224022042220..0222220',
    '02121220.02222222222220.02212120',
    '021212220.022212212220.022212120',
    '0212121220..0c0cc0c0..0221212120',
    '02121212220..022220..02221212120',
    '02121212122200222200222121212120',
    '.021212121222222222222121212120.',
    '..0212121222333333332221212120..',
    '...02121222234444443222212120...',
    '....021222223444444322222120....',
    '.....0222222344444432222220.....',
    '......02222233333333222220......',
    '.......02220.022220.02220.......',
    '......00d0d0..0000..0d0d00......',
  ],
};
Object.assign(S, JEFES_SPR);

/** El caminante de cada personaje: el héroe base con sus colores. */
const COLORES: Record<string, Record<string, string>> = {
  hilda: { '9': '9', '3': 'h', '4': 'g', '6': '4', '8': 'f' }, // enana: yelmo de acero y cuero
  bastian: { '9': 'h', '3': '6', '4': 'g', '6': 'c', '8': 'g' }, // mediano: rizos, chaleco verde y pies descalzos
  lis: { '9': '4', '3': '9', '4': 'g', '6': '2', '8': 'h' }, // escudera: trenzas rubias y cota de acero
  rina: { '9': 'c', '3': '7', '4': 'g', '6': 'b', '8': 'f' }, // elfa: pelo claro y capa verde
  ulf: { '9': 'e', '3': '7', '4': 'g', '6': 'h', '8': '0' }, // montaraz: capucha parda
};
for (const [quien, mapa] of Object.entries(COLORES))
  for (const f of ['heroe1', 'heroe2']) S[`${quien}-${f}`] = S[f].map((fila) => [...fila].map((ch) => mapa[ch] ?? ch).join(''));

export type NombreSprite = keyof typeof S;

// ------------------------------------------------------------------ iconos de los botones
// El altavoz y los controles de la animación, en píxeles (los emojis no casan
// con la fuente pixelada y cada sistema los pinta a su manera).
{
  const T = ['c...', 'cc..', 'ccc.', 'cccc', 'ccc.', 'cc..', 'c...'];
  const R = (s: string) => s.split('').reverse().join('');
  Object.assign(S, {
    'ic-altavoz': ['.....cc.....', '....ccc...c.', 'ccccccc.c..c', 'ccccccc..c.c', 'ccccccc..c.c', 'ccccccc..c.c', 'ccccccc.c..c', '....ccc...c.', '.....cc.....'],
    'ic-mudo': ['.....cc.....', '....ccc.....', 'ccccccc.....', 'ccccccc.2..2', 'ccccccc..22.', 'ccccccc..22.', 'ccccccc.2..2', '....ccc.....', '.....cc.....'],
    'ic-play': T,
    'ic-pausa': Array(7).fill('cc.cc'),
    'ic-paso': T.map((r) => r + '.c'),
    'ic-paso-atras': T.map((r) => 'c.' + R(r)),
    'ic-evento': T.map((r) => r + r + '.c'),
    'ic-evento-atras': T.map((r) => 'c.' + R(r) + R(r)),
    'ic-volver': ['..c....', '.cc....', 'ccccccc', '.cc....', '..c....'],
    'ic-subir': ['...c...', '..ccc..', '.ccccc.', 'ccccccc', '..ccc..', '..ccc..', '..ccc..'],
    'ic-cerrar': ['cc...cc', 'ccc.ccc', '.ccccc.', '..ccc..', '.ccccc.', 'ccc.ccc', 'cc...cc'],
    'ic-pergamino': ['.cccccccc.', 'c4cccccc4c', '.c000000c.', '.cccccccc.', '.c00000cc.', '.cccccccc.', 'c4cccccc4c', '.cccccccc.'],
  });
}

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
