// Registros de verdad: salen de compilar el proyecto base con la solución, con la
// plantilla sin tocar y con versiones de la solución que tienen un fallo cada una
// (el número delante del nombre es el ejercicio).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { leerRegistro, ErrorRegistro } from '../practica/registro';
import { corregir } from '../practica/corregir';
import { MISIONES } from '../practica/misiones';
import * as T from '../practica/tablas';

const leer = (v: string, m: string) => corregir(leerRegistro(readFileSync(`${__dirname}/registros/${v}/${m}.txt`, 'utf8'), `${m}.txt`));
/** [evento, ejercicio, tabla, título] del primer fallo */
const primero = (v: string, m: string) => leer(v, m).juicios.flatMap((j, i) => j.fallos.map((f) => [i, f.ej ?? 0, f.donde, f.f.titulo] as const))[0];

describe('el modelo de referencia', () => {
  it('hash de clase, también con claves negativas', () => {
    expect(T.hash(106, 101)).toBe(5);
    expect(T.hash(-7, 20)).toBe(13);
  });
  it('el más abundante desempata por la clave más pequeña', () => {
    expect(T.masAbundante([[207, 5], [43, 5], [5, 3]])).toEqual([1, 43, 5]);
    expect(T.masAbundante([])).toEqual([0, 0, 0]);
  });
  it('las funciones hash del acto 3, como en C', () => {
    expect(T.plegamiento(12345, 101)).toBe(69);
    expect(T.plegamiento(1234, 101)).toBe(T.plegamiento(3412, 101));
    expect(T.mitadCuadrado(1234, 101)).toBe(27);
    expect(T.mitadCuadrado(300, 101)).toBe(0);
    expect(T.polinomico(1200, 101)).toBe(T.polinomico(12, 101));
  });
  it('las tres formas de buscar sitio en el array', () => {
    const s = (sonda: T.Sonda) => [0, 1, 2, 3, 4, 5].map((i) => T.casillaDe({ tam: 20, hf: 'CLASE', sonda }, 23, i));
    expect(s('LIN')).toEqual([3, 4, 5, 6, 7, 8]);
    expect(s('CUA')).toEqual([3, 4, 7, 12, 19, 8]);
    expect(T.hash2(23)).toBe(5);
    expect(s('DOB')).toEqual([3, 8, 13, 18, 3, 8]);
  });
});

describe('la solución', () => {
  for (const m of MISIONES)
    it(m.id, () => {
      const c = leer('sol', m.id);
      expect(c.conocida).toBe(true);
      expect(c.total).toBe(m.ordenes.length);
      expect(c.bien).toBe(c.total);
      expect(c.estrellas).toBe(3);
    });
});

describe('cada fallo, en su ejercicio y en su evento', () => {
  const casos: [string, string, ReturnType<typeof primero>][] = [
    ['1-empate', 'mision1-camino', [9, 1, 'Array', 'No devuelve lo que toca']],
    ['2-vacios', 'mision2-mapa', [1, 2, 'Listas', 'No devuelve lo que toca']],
    ['2-borradacorta', 'mision2-mapa', [12, 2, 'Array', 'No devuelve lo que toca']],
    ['3-copia', 'mision3-mercado', [6, 3, 'Listas', 'Nodo nuevo al cambiar la clave']],
    ['3-primero', 'mision3-mercado', [10, 3, '', 'El programa se cortó aquí']],
    ['3-vacia', 'mision3-mercado', [6, 3, 'Array', 'Una clave que no se encontraría']],
    ['4-sinfree', 'mision4-cripta-encantada', [11, 4, '', '¡6 fantasmas!']],
    ['4-saltaseguidos', 'mision4-cripta-encantada', [11, 4, 'Listas', 'Las listas no cuadran']],
    ['4-vacia', 'mision4-cripta-encantada', [11, 4, 'Array', 'Una clave que no se encontraría']],
    ['5-copia', 'mision5-cofre-gloton', [7, 5, 'Listas', 'Nodos nuevos en la fusión']],
    ['5-nosuma', 'mision5-cofre-gloton', [23, 5, 'Listas', 'Clave repetida']],
    ['5-origen', 'mision5-cofre-gloton', [7, 5, 'Botín · Listas', 'El origen no queda vacío']],
    ['6-comparte', 'mision6-escriba', [6, 6, 'Botín · Listas', 'La copia comparte nodos']],
    ['6-sinliberar', 'mision6-escriba', [13, 6, '', '¡5 fantasmas!']],
    ['7-solon', 'mision7-balanza', [10, 7, 'Array', 'No devuelve lo que toca']],
    ['7-casillas', 'mision7-balanza', [8, 7, 'Array', 'No devuelve lo que toca']],
    ['8-sinfree', 'mision8-pacto', [14, 8, '', '¡4 fantasmas!']],
    ['8-sinmin', 'mision8-pacto', [14, 8, 'Listas', 'Las listas no cuadran']],
    ['8-vacia', 'mision8-pacto', [14, 8, 'Array', 'Una clave que no se encontraría']],
    ['9-igualcero', 'mision9-recaudador', [14, 9, 'Listas', 'Las listas no cuadran']],
    ['10-trozos3', 'mision10-pergamino', [2, 10, 'Listas', 'Un objeto en el cubo equivocado']],
    ['11-centro', 'mision11-cuadrado', [2, 11, 'Array', 'Una clave que no se encontraría']],
    ['12-37', 'mision12-hechicero', [3, 12, 'Listas', 'Un objeto en el cubo equivocado']],
    ['13-cuadmal', 'mision13-escalera', [5, 13, 'Array', 'Una clave que no se encontraría']],
    ['13-h2', 'mision13-escalera', [6, 13, 'Botín · Array', 'Una clave que no se encontraría']],
    ['14-sinfinal', 'mision14-espejos', [20, 14, 'Array', 'No devuelve lo que toca']],
    ['14-lista0', 'mision14-espejos', [21, 14, 'Listas', 'No devuelve lo que toca']],
    ['15-sinvaciar', 'mision16-dragon', [29, 15, 'Botín · Array', 'Quedan BORRADA']],
    ['15-copia', 'mision15-golem', [19, 15, 'Listas', 'Nodo nuevo al ponerla delante']],
  ];
  for (const [v, m, quiero] of casos) it(v, () => expect(primero(v, m)).toEqual(quiero));
  it('la plantilla sin tocar falla en los quince ejercicios', () => {
    const ejs = new Set(MISIONES.flatMap((m) => leer('plantilla', m.id).juicios.flatMap((j) => j.fallos.map((f) => f.ej))));
    expect([...ejs].sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });
});

describe('ficheros raros', () => {
  it('un fichero que no es un registro', () => {
    expect(() => leerRegistro('hola', 'notas.txt')).toThrow(ErrorRegistro);
  });
  it('un registro de la práctica de 2 horas', () => {
    expect(() => leerRegistro('COFRES 4\nMISION x', 'viejo.txt')).toThrow(/2 horas/);
  });
  it('un registro de otra versión', () => {
    expect(() => leerRegistro('COFRES 3\nMISION x', 'viejo.txt')).toThrow(/otra versión/);
  });
  it('eventos cambiados no cuentan', () => {
    const t = readFileSync(`${__dirname}/registros/sol/mision1-camino.txt`, 'utf8').replace('EV 2 ACTUALIZAR 5 3', 'EV 2 ACTUALIZAR 5 4');
    expect(corregir(leerRegistro(t)).conocida).toBe(false);
  });
  it('finales de línea de Windows', () => {
    for (const m of ['mision3-mercado', 'mision12-hechicero', 'mision16-dragon']) {
      const c = corregir(leerRegistro(readFileSync(`${__dirname}/registros/sol/${m}.txt`, 'utf8').replace(/\n/g, '\r\n')));
      expect(c.bien).toBe(c.total);
    }
  });
});
