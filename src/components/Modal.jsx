import { useEffect } from 'react';

export default function Modal({ titulo, alCerrar, children, ancho = 560 }) {
  useEffect(() => {
    const alPresionar = (evento) => evento.key === 'Escape' && alCerrar();
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [alCerrar]);

  return (
    <div className="dialogo__fondo" onMouseDown={alCerrar}>
      <div
        className="dialogo"
        style={{ maxWidth: ancho }}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <header className="dialogo__cabecera">
          <h2>{titulo}</h2>
          <button type="button" className="boton-icono" onClick={alCerrar} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="dialogo__cuerpo">{children}</div>
      </div>
    </div>
  );
}
