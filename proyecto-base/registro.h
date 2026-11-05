/* EDA - Practica de listas dispersas: el registro.
 *
 * Vigila los malloc y free de las dos tablas y, despues de cada evento,
 * apunta en registros/<mision>.txt como han quedado. Ese fichero es el que se
 * sube a la web para ver la animacion y la correccion.
 *
 * Al incluir este fichero, malloc y free pasan a ser reg_malloc y reg_free:
 * hacen lo mismo, pero dejan apuntado cada bloque. Ademas:
 *   - la memoria nueva se rellena con basura reconocible, para pillar los
 *     punteros sin inicializar;
 *   - un free NO devuelve la memoria de verdad hasta el final del programa,
 *     para que un bloque liberado no se reutilice y se pueda pillar si alguien
 *     lo sigue usando.
 *
 * NO HAY QUE TOCAR ESTE FICHERO NI registro.c.
 */
#ifndef REGISTRO_H
#define REGISTRO_H

#include <stdio.h>
#include <stdlib.h>

void *reg_malloc(size_t n, const char *fichero, int linea);
void  reg_free(void *p, const char *fichero, int linea);

/* Para los volcados de las tablas */
int  reg_vivo(const void *p, size_t minimo);  /* 1 si p es el principio de un bloque vivo de al menos minimo bytes */
void reg_ref(const void *p);                  /* escribe la referencia de p: 0, numero de bloque, L<n>, ? o ! */
void reg_printf(const char *formato, ...);    /* escribe en el registro */

/* Las usa main_mision.c */
int  reg_abrir(const char *salida, const char *mision, const char *alumno);
void reg_vivos(void);                          /* los bloques vivos, para encontrar fugas */
void reg_cerrar(void);

#ifndef REGISTRO_INTERNO
#define malloc(n) reg_malloc((n), __FILE__, __LINE__)
#define free(p)   reg_free((p), __FILE__, __LINE__)
#endif

#endif
