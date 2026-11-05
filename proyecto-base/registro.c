/* EDA - Practica de listas dispersas: el registro (ver registro.h).
 *
 * Lineas que escribe este fichero:
 *   COFRES 4 / ALUMNO <nombre> / MISION <mision>     cabecera
 *   M <bloque> <bytes> <fich> <linea>                malloc
 *   F <bloque> <fich> <linea>                        free
 *   E <mensaje>                                      error de memoria
 *   V <bloque> <bytes>                               bloque vivo (al final de cada evento)
 *   FIN                                              el programa ha terminado bien
 * Una referencia es 0 (NULL), el numero de un bloque vivo, L<n> (un bloque ya
 * liberado), ? (basura: puntero sin inicializar) o ! (no es de malloc).
 * El resto de lineas (EV, RL, RA, TL, NL, TA, CA...) las escriben
 * main_mision.c y los volcados de las tablas.
 */
#define REGISTRO_INTERNO
#include <stdarg.h>
#include <string.h>
#include "registro.h"

#define BASURA 0xBE
#define MUERTO 0xDD

typedef struct {
    unsigned char *p;
    size_t n;
    int liberado;
} Bloque;

static Bloque *bloques = NULL;
static int nbloques = 0;
static int capacidad = 0;
static FILE *reg = NULL;

static const char *base(const char *ruta) {
    const char *b = ruta;
    for (const char *c = ruta; *c; c++)
        if (*c == '/' || *c == '\\') b = c + 1;
    return b;
}

/* Numero de bloque (desde 1) que empieza justo en p, o 0 si no hay. */
static int bloque_de(const void *p) {
    for (int i = nbloques - 1; i >= 0; i--)
        if (bloques[i].p == p) return i + 1;
    return 0;
}

void *reg_malloc(size_t n, const char *fichero, int linea) {
    if (nbloques == capacidad) {
        int nueva = capacidad ? capacidad * 2 : 64;
        Bloque *b = realloc(bloques, (size_t) nueva * sizeof(Bloque));
        if (b == NULL) return NULL;
        bloques = b;
        capacidad = nueva;
    }
    unsigned char *p = malloc(n ? n : 1);
    if (p == NULL) return NULL;
    memset(p, BASURA, n);
    bloques[nbloques].p = p;
    bloques[nbloques].n = n;
    bloques[nbloques].liberado = 0;
    nbloques++;
    if (reg) {
        fprintf(reg, "M %d %lu %s %d\n", nbloques, (unsigned long) n, base(fichero), linea);
        fflush(reg);
    }
    return p;
}

void reg_free(void *p, const char *fichero, int linea) {
    if (p == NULL) return; /* free(NULL) no hace nada, igual que el de verdad */
    int b = bloque_de(p);
    if (b == 0) {
        if (reg) fprintf(reg, "E free de algo que no salio de malloc (%s, linea %d)\n", base(fichero), linea);
    } else if (bloques[b - 1].liberado) {
        if (reg) fprintf(reg, "E doble free: el bloque %d ya estaba liberado (%s, linea %d)\n", b, base(fichero), linea);
    } else {
        bloques[b - 1].liberado = 1;
        memset(bloques[b - 1].p, MUERTO, bloques[b - 1].n);
        if (reg) fprintf(reg, "F %d %s %d\n", b, base(fichero), linea);
    }
    if (reg) fflush(reg);
}

int reg_vivo(const void *p, size_t minimo) {
    int b = bloque_de(p);
    return b != 0 && !bloques[b - 1].liberado && bloques[b - 1].n >= minimo;
}

static int es_basura(const void *ptr) {
    unsigned char c[sizeof(void *)];
    memcpy(c, &ptr, sizeof c);
    for (size_t i = 0; i < sizeof c; i++)
        if (c[i] != BASURA && c[i] != MUERTO) return 0;
    return 1;
}

void reg_ref(const void *p) {
    if (!reg) return;
    if (p == NULL) {
        fprintf(reg, "0");
        return;
    }
    int b = bloque_de(p);
    if (b == 0) fprintf(reg, es_basura(p) ? "?" : "!");
    else if (bloques[b - 1].liberado) fprintf(reg, "L%d", b);
    else fprintf(reg, "%d", b);
}

void reg_printf(const char *formato, ...) {
    if (!reg) return;
    va_list ap;
    va_start(ap, formato);
    vfprintf(reg, formato, ap);
    va_end(ap);
    fflush(reg);
}

/* Los bloques vivos: la web los usa para encontrar las fugas. */
void reg_vivos(void) {
    if (!reg) return;
    for (int i = 0; i < nbloques; i++)
        if (!bloques[i].liberado) fprintf(reg, "V %d %lu\n", i + 1, (unsigned long) bloques[i].n);
    fflush(reg);
}

int reg_abrir(const char *salida, const char *mision, const char *alumno) {
    reg = fopen(salida, "w");
    if (reg == NULL) return 0;
    fprintf(reg, "COFRES 4\nALUMNO %s\nMISION %s\n", alumno, mision);
    fflush(reg);
    return 1;
}

void reg_cerrar(void) {
    if (reg) {
        fprintf(reg, "FIN\n");
        fclose(reg);
        reg = NULL;
    }
    for (int i = 0; i < nbloques; i++) free(bloques[i].p);
    free(bloques);
    bloques = NULL;
    nbloques = capacidad = 0;
}
