// Empaqueta proyecto-base/ en public/proyecto-base.zip, que es lo que se descarga
// desde la web. Se ejecuta solo antes de dev y de build.
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { zipSync } from 'fflate';

const raiz = new URL('../proyecto-base/', import.meta.url).pathname;
const fuera = (r) => r.startsWith('registros/') && r !== 'registros/LEEME.txt';
const ficheros = {};
(function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const r = relative(raiz, p).split('\\').join('/');
    if (n.startsWith('.') || n.startsWith('cmake-build') || n === 'build') continue;
    if (statSync(p).isDirectory()) recorrer(p);
    else if (!fuera(r)) ficheros['Listas_Dispersas/' + r] = readFileSync(p);
  }
})(raiz);
mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/proyecto-base.zip', import.meta.url), zipSync(ficheros, { level: 9 }));
console.log('proyecto-base.zip:', Object.keys(ficheros).length, 'ficheros');
