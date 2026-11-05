// La pantalla de una misión antes de subir su registro: quién te acompaña, a qué
// jefe te enfrentas, qué target ejecutar y dónde soltar el registro. Al subirlo,
// la animación empieza sola y la nota no se ve hasta el final.
import { useMemo, useRef, useState } from 'react';
import { urlSprite } from '../juego/sprites';
import { sonar } from '../juego/sonido';
import { BotonSonido } from '../juego/BotonSonido';
import { Mision } from './misiones';
import { COMPANIA, JEFES, MERLA, PROLOGO } from './personajes';
import { Archivera } from './Visor';

/** El prólogo, línea a línea, como el principio de una gran historia. */
export function Prologo({ compacto = false }: { compacto?: boolean }) {
  const maga = useMemo(() => urlSprite(MERLA.id, 5), []);
  return (
    <section className={`prologo ${compacto ? 'compacto' : ''}`}>
      <div className="prologo-tit">PRÓLOGO</div>
      <div className="prologo-cuerpo">
        {!compacto && <img src={maga} alt="" className="prologo-maga" />}
        <div>
          {PROLOGO.map((l, k) => (
            <p key={k} className={k === PROLOGO.length - 1 ? 'tu' : ''} style={{ animationDelay: `${0.4 + k * 1.1}s` }}>
              {l}
            </p>
          ))}
          <div className="prologo-firma" style={{ animationDelay: `${0.4 + PROLOGO.length * 1.1}s` }}>
            Merla, guardiana del Libro de los Cofres
          </div>
        </div>
      </div>
    </section>
  );
}

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
          ← VOLVER
        </button>
        <div className={`titulo-ev ${mision.jefe ? 'jefe' : ''}`}>
          MISIÓN {num} · {mision.titulo}
        </div>
        <div className="pts" />
        <BotonSonido />
      </header>

      {num === 1 && <Prologo compacto />}

      <div className={`escena ${jefe ? 'con-jefe' : ''}`}>
        <img src={companero} alt="" className="escena-companero" />
        {jefe && <span className="escena-vs">VS</span>}
        {jefe && <img src={jefeImg} alt="" className="escena-jefe" />}
      </div>

      <div className="entrada-dialogos">
        <Archivera quien={mision.quien} titulo="ANTES DE EMPEZAR">
          <p className="presenta">«{COMPANIA[mision.quien].presentacion}»</p>
          <p>{mision.resumen}</p>
        </Archivera>
        {jefe && (
          <Archivera quien={jefe.id} titulo="EL JEFE DEL ACTO">
            <p className="presenta amenaza">{jefe.amenaza}</p>
          </Archivera>
        )}
      </div>

      <ol className="pasos-mision">
        <li>
          En CLion, elige el target <code>{mision.target}</code> en el desplegable de arriba a la derecha y ejecútalo.
        </li>
        <li>
          Suelta aquí abajo <code>{fichero}</code>, o pulsa el botón y búscalo.
        </li>
        <li>La misión se juega sola, evento a evento. Cómo te ha ido lo sabrás al final.</li>
      </ol>

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
          ⬆ SUBIR {mision.id}.txt
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
