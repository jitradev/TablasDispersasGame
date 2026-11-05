# EDA - Practica de listas dispersas (tablas de dispersion).
#
# Es el proyecto Listas_Dispersas de clase con dos cosas mas: la lectura de
# los ficheros de eventos y la escritura de los registros, ya hechas.
#
#   pruebas  -> main.c de clase, para probar las tablas a mano
#   mision1  -> eventos/mision1-camino.txt            (ejercicio 1)
#   mision2  -> eventos/mision2-mapa.txt              (ejercicio 2)
#   mision3  -> eventos/mision3-mercado.txt           (ejercicio 3)
#   mision4  -> eventos/mision4-cripta-encantada.txt  (ejercicio 4)
#   mision5  -> eventos/mision5-cofre-gloton.txt      (ejercicio 5, el jefe)
#
# Cada mision escribe su registro en registros/ con el mismo nombre. Despues
# de cada mision se sube ese registro a la web de la practica. Para la
# entrega se sube a la PDU el proyecto entero, comprimido en un zip.
#
# En CLion:  File > Open, elegir ESTA carpeta y aceptar cuando pregunte por el
# CMakeLists.txt. Si la carpeta ya estaba abierta como proyecto normal, boton
# derecho sobre este fichero > Load CMake Project.
# El desplegable de arriba a la derecha elige que se lanza.

cmake_minimum_required(VERSION 3.20)
project(Listas_Dispersas C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(TABLAS TablaDispersaArray.c TablaDispersaLista.c registro.c)

add_executable(pruebas main.c ${TABLAS})
target_compile_options(pruebas PRIVATE -Wall -Wextra -pedantic)

function(mision destino fichero)
    add_executable(${destino} main_mision.c ${TABLAS})
    target_compile_options(${destino} PRIVATE -Wall -Wextra -pedantic)
    target_compile_definitions(${destino} PRIVATE
            MISION="${fichero}"
            PROYECTO_DIR="${CMAKE_CURRENT_SOURCE_DIR}")
endfunction()

mision(mision1 mision1-camino)
mision(mision2 mision2-mapa)
mision(mision3 mision3-mercado)
mision(mision4 mision4-cripta-encantada)
mision(mision5 mision5-cofre-gloton)
