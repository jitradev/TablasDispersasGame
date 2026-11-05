// La pantalla de una misión antes de subir su registro: quién te acompaña, a qué
// jefe te enfrentas, qué target ejecutar y dónde soltar el registro. Al subirlo,
// la animación empieza sola y la nota no se ve hasta el final.
import { useMemo, useRef, useState } from 'react';
import { Ico } from '../juego/Icono';
import { urlSprite } from '../juego/sprites';
import { sonar } from '../juego/sonido';
import { BotonSonido } from '../juego/BotonSonido';
import { Mision } from './misiones';
import { COMPANIA, JEFES, MERLA } from './personajes';
import { Archivera } from './Visor';
import { EnClaroMision } from './EnClaro';
import { ejercicioDe } from './encargos';

export function Entrada({
  mision,
  num,
  volver,
  subir,
  errores,
}: {
  mision: Mision;
  num: number;
  volver: () => void;
  subir: (fs: FileList | File[]) => void;
  errores: string[];
}) {
  const input = useRef<HTMLInputElement>(null);
  const [encima, setEncima] = useState(false);
  const companero = useMemo(() => urlSprite(mision.quien, 7), [mision.quien]);
  const jefe = mision.jefe ? JEFES[mision.acto] : undefined;
  const jefeImg = useMemo(() => (jefe ? urlSprite(jefe.id, 5) : ''), [jefe]);
  const fichero = `registros/${mision.id}.txt`;
  return (
    <div className="pantalla entrada">
      <header className="barra-sup">
        <button className="mini" onClick={volver}>
          <Ico n="volver" />
          VOLVER
        </button>
        <div className={`titulo-ev ${mision.jefe ? 'jefe' : ''}`}>
          MISIÓN {num} · {mision.titulo}
        </div>
        <div className="pts" />
        <BotonSonido />
      </header>

      <div className={`escena-entrada ${jefe ? 'con-jefe' : ''}`}>
        <img src={companero} alt="" className="escena-companero" />
        {jefe && <span className="escena-vs">VS</span>}
        {jefe && <img src={jefeImg} alt="" className="escena-jefe" />}
      </div>

      <div className="entrada-ej">{mision.ejercicio}</div>

      <div className="entrada-dialogos">
        <Archivera quien={MERLA.id} titulo="LA HISTORIA">
          <p>{mision.resumen}</p>
        </Archivera>
        <Archivera quien={mision.quien} titulo="ANTES DE EMPEZAR">
          <p className="presenta">«{COMPANIA[mision.quien].presentacion}»</p>
        </Archivera>
        {jefe && (
          <Archivera quien={jefe.id} titulo="EL JEFE DEL ACTO">
            <p className="presenta amenaza">{jefe.amenaza}</p>
          </Archivera>
        )}
      </div>

      <EnClaroMision ej={ejercicioDe(mision.target)} jefe={!!mision.jefe} acto={mision.acto} target={mision.target} fichero={fichero} />


      <div
        className={`zona-subir ${encima ? 'encima' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          subir(e.dataTransfer.files);
        }}
      >
        <img src={urlSprite('cofre', 6)} alt="" />
        <div className="zona-texto">SUELTA AQUÍ TU REGISTRO</div>
        <input
          ref={input}
          type="file"
          accept=".txt,text/plain"
          hidden
          onChange={(e) => {
            if (e.target.files) subir(e.target.files);
            e.target.value = '';
          }}
        />
        <button
          className="grande t-subir"
          onClick={() => {
            sonar('click');
            input.current?.click();
          }}
        >
          <Ico n="subir" />
          SUBIR {mision.id}.txt
        </button>
      </div>
      {errores.map((e, k) => (
        <div key={k} className="aviso mal entrada-error">
          {e}
        </div>
      ))}
    </div>
  );
}
