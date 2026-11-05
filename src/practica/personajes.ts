// La compañía: personajes propios de la práctica. Merla narra; cada misión tiene
// un acompañante, que es quien recorre el camino en la animación.

export interface Personaje {
  id: string;
  nombre: string;
  /** Lo que dice al empezar su misión. */
  presentacion: string;
}

export const MERLA: Personaje = {
  id: 'buho',
  nombre: 'MERLA, LA ARCHIVERA',
  presentacion: 'Llevo el inventario del Gremio desde antes de que tú nacieras. Mil huecos, casi todos vacíos: aquí solo se guarda lo que existe.',
};

export const COMPANIA: Record<string, Personaje> = {
  hilda: {
    id: 'hilda',
    nombre: 'HILDA, LA HERRERA',
    presentacion: 'Bajo de las montañas con mi martillo. En el camino recogeremos de todo: cada cosa va a su cofre, y cada cofre a su sitio.',
  },
  bastian: {
    id: 'bastian',
    nombre: 'BASTIÁN, EL CARTÓGRAFO',
    presentacion: 'He dibujado cada rincón de esta cripta. Las trampas siempre están en los bordes: la cripta vacía, el primer hueco, el último.',
  },
  rina: {
    id: 'rina',
    nombre: 'RINA, LA BOTICARIA',
    presentacion: 'En mi puesto todo se cambia por otra cosa. Pero ojo: un trueque mueve el mismo frasco de estante, no fabrica uno nuevo.',
  },
  ulf: {
    id: 'ulf',
    nombre: 'ULF, EL BARQUERO',
    presentacion: 'Cruzo a la cripta a quien sea. Allí dentro, lo que se agota desaparece... y hay que saber qué hueco deja.',
  },
  lis: {
    id: 'lis',
    nombre: 'LIS, LA ARQUERA DEL BOSQUE',
    presentacion: 'El Cofre Glotón se come cualquier inventario mal ordenado. Yo disparo; tú no pierdas ni un cofre.',
  },
};
