# EDA - Practica de listas dispersas (tablas de dispersion). Version de 8 horas:
# cuatro actos, uno por sesion, sobre este mismo proyecto.
#
# Es el proyecto Listas_Dispersas de clase, con sus dos tablas, para los cuatro
# actos, y la lectura de los ficheros de eventos y la escritura de los
# registros, ya hechas.
#
#   pruebas   -> main.c de clase, para probar las tablas a mano
#
#   Todo se programa en TablaDispersaLista.c y TablaDispersaArray.c.
#
#   ACTO 1, EL GREMIO
#   mision1   -> eventos/mision1-camino.txt             (ejercicio 1)
#   mision2   -> eventos/mision2-mapa.txt               (ejercicio 2)
#   mision3   -> eventos/mision3-mercado.txt            (ejercicio 3)
#   mision4   -> eventos/mision4-cripta-encantada.txt   (ejercicio 4)
#   mision5   -> eventos/mision5-rey-cripta.txt       (ejercicio 5, jefe)
#
#   ACTO 2, LAS CARAVANAS
#   mision6   -> eventos/mision6-escriba.txt            (ejercicio 6)
#   mision7   -> eventos/mision7-balanza.txt            (ejercicio 7)
#   mision8   -> eventos/mision8-pacto.txt              (ejercicio 8)
#   mision9   -> eventos/mision9-recaudador.txt         (ejercicio 9, jefe)
#
#   ACTO 3, LA SOMBRA DE LA TORRE (funciones hash) (las mismas dos tablas)
#   mision10  -> eventos/mision10-pergamino.txt         (ejercicio 10)
#   mision11  -> eventos/mision11-cuadrado.txt          (ejercicio 11)
#   mision12  -> eventos/mision12-hechicero.txt         (ejercicio 12, jefe)
#
#   ACTO 4, EL TESORO DEL DRAGON (colisiones) (las mismas dos tablas)
#   mision13  -> eventos/mision13-escalera.txt          (ejercicio 13)
#   mision14  -> eventos/mision14-espejos.txt           (ejercicio 14)
#   mision15  -> eventos/mision15-golem.txt             (ejercicio 15)
#   mision16  -> eventos/mision16-dragon.txt            (jefe final)
#
# Cada mision escribe su registro en registros/ con el mismo nombre. Despues
# de cada mision se sube ese registro a la web de la practica. Al acabar cada
# sesion se sube a la PDU el proyecto entero, comprimido en un zip.
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

function(mision destino programa fichero)
    add_executable(${destino} ${programa} ${TABLAS})
    target_compile_options(${destino} PRIVATE -Wall -Wextra -pedantic)
    target_compile_definitions(${destino} PRIVATE
            MISION="${fichero}"
            PROYECTO_DIR="${CMAKE_CURRENT_SOURCE_DIR}")
endfunction()

mision(mision1 main_mision.c mision1-camino)
mision(mision2 main_mision.c mision2-mapa)
mision(mision3 main_mision.c mision3-mercado)
mision(mision4 main_mision.c mision4-cripta-encantada)
mision(mision5 main_mision.c mision5-rey-cripta)

mision(mision6 main_mision.c mision6-escriba)
mision(mision7 main_mision.c mision7-balanza)
mision(mision8 main_mision.c mision8-pacto)
mision(mision9 main_mision.c mision9-recaudador)

mision(mision10 main_mision.c mision10-pergamino)
mision(mision11 main_mision.c mision11-cuadrado)
mision(mision12 main_mision.c mision12-hechicero)

mision(mision13 main_mision.c mision13-escalera)
mision(mision14 main_mision.c mision14-espejos)
mision(mision15 main_mision.c mision15-golem)
mision(mision16 main_mision.c mision16-dragon)
