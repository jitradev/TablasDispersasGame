/* EDA - Practica de listas dispersas. El programa que juega una mision.
 *
 * Lee eventos/<MISION>.txt linea a linea, hace cada orden sobre LAS DOS
 * tablas (la de listas y la del array) y, despues de cada evento, deja
 * apuntado en registros/<MISION>.txt como han quedado.
 *
 * Hay dos inventarios: el principal (H) y el botin (B), que se crea la
 * primera vez que se usa. Las ordenes van al principal salvo que lleven B:
 *     ACTUALIZAR 106 3 | ...    actualizar en el principal (ya hecha)
 *     ACTUALIZAR B 106 3 | ...  actualizar en el botin
 *     BUSCAR [B] 106 | ...      buscar
 *     ELIMINAR [B] 106 | ...    eliminarElemento
 *     ABUNDANTE [B] | ...       masAbundante                       (ejercicio 1)
 *     COLISIONES [B] | ...      cuboMasLargo y grupoMasLargo       (ejercicio 2)
 *     CAMBIAR 106 300 | ...     cambiarClave(principal, 106, 300)  (ejercicio 3)
 *     AGOTAR 3 | ...            eliminarSiMenor(principal, 3)      (ejercicio 4)
 *     FUSIONAR | ...            fusionar(principal, botin)         (ejercicio 5)
 *     LIBERAR | ...             eliminar todas las tablas (la ultima orden)
 * Las lineas vacias y las que empiezan por # no cuentan.
 *
 * MISION y PROYECTO_DIR los pone el CMakeLists.txt, uno por target.
 * NO HAY QUE TOCAR ESTE FICHERO.
 */
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include "alumno.h"
#include "registro.h"
#include "TablaDispersaArray.h"
#include "TablaDispersaLista.h"

#ifndef MISION
#error "Falta MISION: compila con el CMakeLists.txt"
#endif
#ifndef PROYECTO_DIR
#define PROYECTO_DIR "."
#endif

static char *recortar(char *s) {
    while (isspace((unsigned char) *s)) s++;
    size_t n = strlen(s);
    while (n > 0 && isspace((unsigned char) s[n - 1])) s[--n] = '\0';
    return s;
}

typedef struct {
    const char *nombre;   /* "H" o "B" */
    HashLista *lista;
    HashArray *array;
} Inventario;

static void volcar(Inventario *h, Inventario *b) {
    if (h->lista) volcarHashLista(h->lista, h->nombre);
    if (h->array) volcarHashArray(h->array, h->nombre);
    if (b->lista) volcarHashLista(b->lista, b->nombre);
    if (b->array) volcarHashArray(b->array, b->nombre);
    reg_vivos();
}

int main(void) {
    char eventos[1024], salida[1024];
    snprintf(eventos, sizeof eventos, "%s/eventos/%s.txt", PROYECTO_DIR, MISION);
    snprintf(salida, sizeof salida, "%s/registros/%s.txt", PROYECTO_DIR, MISION);

    FILE *fe = fopen(eventos, "r");
    if (fe == NULL) {
        printf("No encuentro el fichero de eventos:\n  %s\n", eventos);
        return 1;
    }
    if (!reg_abrir(salida, MISION, ALUMNO)) {
        printf("No puedo escribir el registro:\n  %s\n", salida);
        fclose(fe);
        return 1;
    }
    printf("Mision %s\nRegistro en %s\n\n", MISION, salida);

    Inventario principal = {"H", NULL, NULL}, botin = {"B", NULL, NULL};
    reg_printf("EV 0 CREAR | Se crea el inventario\n");
    principal.lista = crearHashLista();
    principal.array = crearHashArray();
    volcar(&principal, &botin);

    char linea[1024];
    int n = 0;
    while (principal.lista != NULL && fgets(linea, sizeof linea, fe)) {
        char *l = recortar(linea);
        if (*l == '\0' || *l == '#') continue;

        char *texto = strchr(l, '|');
        if (texto) *texto++ = '\0';
        else texto = "";
        texto = recortar(texto);

        char orden[16] = "", quien[4] = "";
        int a = 0, b = 0, leidos;
        Inventario *inv = &principal;
        char limpia[64];
        if (sscanf(l, "%15s %3s", orden, quien) == 2 && strcmp(quien, "B") == 0) {
            inv = &botin;
            leidos = sscanf(l, "%15s %*s %d %d", orden, &a, &b);
        } else {
            leidos = sscanf(l, "%15s %d %d", orden, &a, &b);
        }
        const char *pre = inv == &botin ? "B " : "";
        if (strcmp(orden, "ACTUALIZAR") == 0 && leidos == 3)
            snprintf(limpia, sizeof limpia, "ACTUALIZAR %s%d %d", pre, a, b);
        else if ((strcmp(orden, "BUSCAR") == 0 || strcmp(orden, "ELIMINAR") == 0) && leidos == 2)
            snprintf(limpia, sizeof limpia, "%s %s%d", orden, pre, a);
        else if (strcmp(orden, "ABUNDANTE") == 0 || strcmp(orden, "COLISIONES") == 0)
            snprintf(limpia, sizeof limpia, "%s%s%s", orden, inv == &botin ? " " : "", inv == &botin ? "B" : "");
        else if (strcmp(orden, "CAMBIAR") == 0 && leidos == 3 && inv == &principal)
            snprintf(limpia, sizeof limpia, "CAMBIAR %d %d", a, b);
        else if (strcmp(orden, "AGOTAR") == 0 && leidos == 2 && inv == &principal)
            snprintf(limpia, sizeof limpia, "AGOTAR %d", a);
        else if ((strcmp(orden, "LIBERAR") == 0 || strcmp(orden, "FUSIONAR") == 0) && inv == &principal)
            snprintf(limpia, sizeof limpia, "%s", orden);
        else {
            printf("Linea que no entiendo (se salta): %s\n", l);
            continue;
        }

        n++;
        printf("Evento %d: %s\n", n, limpia);
        reg_printf("EV %d %s | %s\n", n, limpia, texto);
        if ((inv == &botin || strcmp(orden, "FUSIONAR") == 0) && botin.lista == NULL) {
            reg_printf("CREAR B\n");
            botin.lista = crearHashLista();
            botin.array = crearHashArray();
        }
        int el = 0, c = 0, r;
        if (strcmp(orden, "ACTUALIZAR") == 0) {
            reg_printf("RL %d\n", actualizarHashLista(inv->lista, a, b));
            reg_printf("RA %d\n", actualizarHashArray(inv->array, a, b));
        } else if (strcmp(orden, "BUSCAR") == 0) {
            r = buscarHashLista(inv->lista, a, &el);
            reg_printf("RL %d %d\n", r, r ? el : 0);
            r = buscarHashArray(inv->array, a, &el);
            reg_printf("RA %d %d\n", r, r ? el : 0);
        } else if (strcmp(orden, "ELIMINAR") == 0) {
            r = eliminarElementoHashLista(inv->lista, a, &el);
            reg_printf("RL %d %d\n", r, r ? el : 0);
            r = eliminarElementoHashArray(inv->array, a, &el);
            reg_printf("RA %d %d\n", r, r ? el : 0);
        } else if (strcmp(orden, "ABUNDANTE") == 0) {
            r = masAbundanteHashLista(inv->lista, &c, &el);
            reg_printf("RL %d %d %d\n", r, r ? c : 0, r ? el : 0);
            printf("  listas: %d (clave %d, elemento %d)\n", r, c, el);
            r = masAbundanteHashArray(inv->array, &c, &el);
            reg_printf("RA %d %d %d\n", r, r ? c : 0, r ? el : 0);
            printf("  array: %d (clave %d, elemento %d)\n", r, c, el);
        } else if (strcmp(orden, "COLISIONES") == 0) {
            r = cuboMasLargoHashLista(inv->lista, &c);
            reg_printf("RL %d %d\n", r, c);
            printf("  listas: cubo mas largo %d, cubos vacios %d\n", r, c);
            r = grupoMasLargoHashArray(inv->array, &c);
            reg_printf("RA %d %d\n", r, c);
            printf("  array: grupo mas largo %d, BORRADA %d\n", r, c);
        } else if (strcmp(orden, "CAMBIAR") == 0) {
            reg_printf("RL %d\n", cambiarClaveHashLista(inv->lista, a, b));
            reg_printf("RA %d\n", cambiarClaveHashArray(inv->array, a, b));
        } else if (strcmp(orden, "AGOTAR") == 0) {
            reg_printf("RL %d\n", eliminarSiMenorHashLista(inv->lista, a));
            reg_printf("RA %d\n", eliminarSiMenorHashArray(inv->array, a));
        } else if (strcmp(orden, "FUSIONAR") == 0) {
            reg_printf("RL %d\n", fusionarHashLista(principal.lista, botin.lista));
            reg_printf("RA %d\n", fusionarHashArray(principal.array, botin.array));
        } else { /* LIBERAR */
            eliminarHashLista(principal.lista);
            eliminarHashArray(principal.array);
            principal.lista = NULL;
            principal.array = NULL;
            if (botin.lista) {
                eliminarHashLista(botin.lista);
                eliminarHashArray(botin.array);
                botin.lista = NULL;
                botin.array = NULL;
            }
        }
        volcar(&principal, &botin);
    }
    fclose(fe);
    if (principal.lista != NULL) { /* el fichero no terminaba en LIBERAR */
        eliminarHashLista(principal.lista);
        eliminarHashArray(principal.array);
    }
    if (botin.lista != NULL) {
        eliminarHashLista(botin.lista);
        eliminarHashArray(botin.array);
    }
    reg_cerrar();
    printf("\nHecho: %d eventos.\nSube registros/%s.txt en la tarjeta de esta mision de la web.\n", n, MISION);
    return 0;
}
