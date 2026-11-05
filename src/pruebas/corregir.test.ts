// Registros de verdad: salen de compilar el proyecto base con la solución y con
// las versiones de solucion-profesor/fallos, que tienen un fallo típico cada una.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { leerRegistro, ErrorRegistro } from '../practica/registro';
import { corregir } from '../practica/corregir';
import { MISIONES } from '../practica/misiones';
import * as T from '../practica/tablas';

const leer = (v: string, m: string) => corregir(leerRegistro(readFileSync(`${__dirname}/registros/${v}/${m}.txt`, 'utf8'), `${m}.txt`));
const [M1, M2, M3, M4, M5] = MISIONES.map((m) => m.id);
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
});

describe('la solución', () => {
  for (const m of [M1, M2, M3, M4, M5])
    it(m, () => {
      const c = leer('sol', m);
      expect(c.conocida).toBe(true);
      expect(c.total).toBe(MISIONES.find((x) => x.id === m)!.ordenes.length);
      expect(c.bien).toBe(c.total);
      expect(c.estrellas).toBe(3);
    });
});

describe('cada fallo, en su ejercicio y en su evento', () => {
  const casos: [string, string, ReturnType<typeof primero>][] = [
    ['1-empate', M1, [9, 1, 'Array', 'No devuelve lo que toca']],
    ['2-vacios', M2, [1, 2, 'Listas', 'No devuelve lo que toca']],
    ['2-borradacorta', M2, [12, 2, 'Array', 'No devuelve lo que toca']],
    ['3-copia', M3, [6, 3, 'Listas', 'Nodo nuevo al cambiar la clave']],
    ['3-primero', M3, [10, 3, '', 'El programa se cortó aquí']],
    ['3-vacia', M3, [6, 3, 'Array', 'Una clave que no se encontraría']],
    ['4-sinfree', M4, [11, 4, '', '¡6 fantasmas!']],
    ['4-saltaseguidos', M4, [11, 4, 'Listas', 'Las listas no cuadran']],
    ['4-vacia', M4, [11, 4, 'Array', 'Una clave que no se encontraría']],
    ['5-copia', M5, [7, 5, 'Listas', 'Nodos nuevos en la fusión']],
    ['5-nosuma', M5, [23, 5, 'Listas', 'Clave repetida']],
    ['5-origen', M5, [7, 5, 'Botín · Listas', 'El origen no queda vacío']],
  ];
  for (const [v, m, quiero] of casos) it(v, () => expect(primero(v, m)).toEqual(quiero));
  it('la plantilla sin tocar falla en las cinco misiones', () => {
    const ejs = new Set([M1, M2, M3, M4, M5].flatMap((m) => leer('plantilla', m).juicios.flatMap((j) => j.fallos.map((f) => f.ej))));
    expect([...ejs].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('ficheros raros', () => {
  it('un fichero que no es un registro', () => {
    expect(() => leerRegistro('hola', 'notas.txt')).toThrow(ErrorRegistro);
  });
  it('un registro de otra versión', () => {
    expect(() => leerRegistro('COFRES 3\nMISION x', 'viejo.txt')).toThrow(/otra versión/);
  });
  it('eventos cambiados no cuentan', () => {
    const t = readFileSync(`${__dirname}/registros/sol/${M1}.txt`, 'utf8').replace('EV 2 ACTUALIZAR 5 3', 'EV 2 ACTUALIZAR 5 4');
    expect(corregir(leerRegistro(t)).conocida).toBe(false);
  });
  it('finales de línea de Windows', () => {
    const t = readFileSync(`${__dirname}/registros/sol/${M3}.txt`, 'utf8').replace(/\n/g, '\r\n');
    const c = corregir(leerRegistro(t));
    expect(c.bien).toBe(c.total);
  });
});
