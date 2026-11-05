// La compañía: personajes propios de la práctica, cada uno con un arquetipo clásico
// de la fantasía épica (la maga, la enana, el mediano, la elfa, el montaraz y la
// escudera). Merla narra; cada misión tiene un acompañante, que es quien recorre el
// camino en la animación. Cada acto termina con un jefe distinto.

export interface Personaje {
  id: string;
  nombre: string;
  /** Qué es, en dos palabras: sale bajo el nombre en la portada. */
  raza: string;
  /** Lo que dice al empezar su misión. */
  presentacion: string;
}

export const MERLA: Personaje = {
  id: 'maga',
  nombre: 'MERLA, LA MAGA ARCHIVERA',
  raza: 'Maga del Gremio',
  presentacion:
    'Guardo el Libro de los Cofres desde hace trescientos inviernos. No tiene mil páginas en orden: tiene huecos, y cada cosa cae en el suyo por su número. Así se encuentra todo a la primera... casi siempre.',
};

export const COMPANIA: Record<string, Personaje> = {
  hilda: {
    id: 'hilda',
    nombre: 'HILDA, LA HERRERA',
    raza: 'Enana de las Forjas de Kaldor',
    presentacion:
      'Mi clan lleva cuentas de cada lingote desde que se encendió la primera fragua. Si vas a cargar con mi inventario, que no se te pierda ni un clavo: los enanos no olvidamos una deuda.',
  },
  bastian: {
    id: 'bastian',
    nombre: 'BASTIÁN, EL CARTÓGRAFO',
    raza: 'Mediano del Valle del Molino',
    presentacion:
      'Yo no soy de aventuras, ¿eh? Prefiero mi sillón y un segundo desayuno. Pero nadie dibuja los caminos como yo, y he visto dónde se amontona todo: siempre en el mismo cubo.',
  },
  rina: {
    id: 'rina',
    nombre: 'RINA, LA SANADORA',
    raza: 'Elfa del Bosque de Lunaverde',
    presentacion:
      'He visto nacer y caer reinos, y en todos se cometía el mismo error: confundir cambiar una cosa de sitio con fabricar otra nueva. Mueve el nodo; no lo copies.',
  },
  ulf: {
    id: 'ulf',
    nombre: 'ULF, EL MONTARAZ',
    raza: 'Montaraz de los Pinares',
    presentacion:
      'Llevo años vigilando los caminos sin que nadie sepa mi nombre. Sé leer las huellas: una casilla BORRADA no es una casilla vacía. Alguien pasó por ahí, y la búsqueda debe seguir.',
  },
  lis: {
    id: 'lis',
    nombre: 'LIS, LA ESCUDERA',
    raza: 'Escudera de la Marca del Este',
    presentacion:
      'Cuando suena el cuerno, a mí me toca ir delante. Yo pongo el escudo y la espada; tú pon el código, y que no se nos escape ni un cofre.',
  },
};

/** El jefe que cierra cada acto. */
export interface Jefe {
  id: string;
  nombre: string;
  /** Lo que dice al aparecer. */
  amenaza: string;
  /** Lo que se dice al vencerlo. */
  derrota: string;
}

export const JEFES: Record<number, Jefe> = {
  1: {
    id: 'espectro',
    nombre: 'ODRIC, EL REY DE LA CRIPTA',
    amenaza: 'La losa del sarcófago se desliza sola. Una corona oxidada, dos ojos verdes en la oscuridad y una voz que hiela: «Lo que entra en mi cripta es mío. Mi aliento consume lo que tienes en poca cantidad... y mi tesoro solo lo guarda quien sabe juntarlo».',
    derrota: 'Odric se deshace en polvo y su corona rueda por el suelo. Todo su tesoro está en tu inventario, cada cosa en su cubo.',
  },
  2: {
    id: 'troll',
    nombre: 'GRUMAK, EL TROLL DEL PUENTE',
    amenaza: 'Bajo el puente de piedra algo enorme se despereza. «Nadie cruza sin pagar. Grumak cuenta despacio, pero Grumak cuenta bien. Si te falta algo, te como».',
    derrota: 'Grumak se rasca la cabeza, no encuentra nada más que cobrar y vuelve a dormirse bajo el puente. La caravana cruza.',
  },
  3: {
    id: 'nigromante',
    nombre: 'VORHAL, EL NIGROMANTE DE LAS CIFRAS',
    amenaza: 'En lo alto de la torre, una figura sin rostro levanta la mano y los números se retuercen. «Yo decido en qué cubo cae cada cosa. Tu función hash no vale nada contra la mía».',
    derrota: 'La capucha cae vacía al suelo. Sin Vorhal, cada clave vuelve al cubo que le da tu función.',
  },
  4: {
    id: 'dragon',
    nombre: 'ASCUAFERRO, EL DRAGÓN DE LAS COLISIONES',
    amenaza: 'La montaña tiembla. Sobre una montaña de oro, dos ojos se abren. «Mil años guardando mi tesoro, y cada moneda en su sitio. ¿Crees que sabrás encontrar la tuya antes de que te alcance mi fuego?».',
    derrota: 'Ascuaferro ruge, despliega las alas y huye por la boca de la montaña. Su tesoro es tuyo, y cada pieza está donde debe.',
  },
};

/** El prólogo de la campaña: lo cuenta Merla en la portada y antes de la primera misión. */
export const PROLOGO: string[] = [
  'Todo empezó con el Libro de los Cofres.',
  'Hace mucho, cuando los reinos aún no tenían nombre, los sabios del Gremio buscaron la forma de guardar todo lo que existía y encontrarlo al instante. No lo pusieron en fila, porque buscar en una fila es lento. Le dieron a cada cosa un número, y a cada número un hueco.',
  'Así nacieron las tablas dispersas: una de listas, con cubos donde caben muchos, y otra de casillas, para quien sabe buscar sitio cuando el suyo está ocupado.',
  'Durante siglos hubo paz, y cada cofre estuvo en su lugar.',
  'Pero el poder de encontrarlo todo despierta la codicia. Un rey muerto quiso llevarse su tesoro a la tumba. Un troll aprendió a cobrar por lo que no era suyo. Un nigromante descubrió que quien elige la función hash decide dónde cae cada cosa. Y en la montaña, un dragón empezó a amontonar lo que nadie podía contar.',
  'El Libro cayó en el olvido. Las colisiones crecieron. Lo que se perdía en la memoria se convertía en fantasma.',
  'Y el destino del Libro no recayó en un rey, ni en un mago, ni en un guerrero, sino en alguien que acababa de llegar al Gremio con un portátil y un proyecto de CLion.',
  'Tú.',
];
