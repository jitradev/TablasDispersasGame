// Constantes del inventario y el objeto que se dibuja en cada hueco.

export const HUECOS = 1000;
export const BYTES_INT = 4;
export const BYTES_NODO = 16; // int + int + puntero de 8 bytes

const ICONOS = ['antorcha', 'pocion', 'moneda', 'flecha', 'hacha', 'mapa', 'gema', 'llave', 'manzana', 'escudo', 'vela'];

/** Los huecos de la historia tienen su objeto; los demás, uno fijo según el número. */
export const OBJETOS: Record<number, string> = {
  3: 'flecha',
  12: 'antorcha',
  415: 'pocion',
  600: 'hacha',
  870: 'moneda',
  951: 'mapa',
};
export const iconoDe = (h: number) => OBJETOS[h] ?? ICONOS[((h % ICONOS.length) + ICONOS.length) % ICONOS.length];
