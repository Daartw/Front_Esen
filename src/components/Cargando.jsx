export default function Cargando({ pantallaCompleta = false, texto = 'Cargando…' }) {
  return (
    <div className={pantallaCompleta ? 'cargando cargando--pantalla' : 'cargando'} role="status">
      <span className="cargando__rueda" aria-hidden="true" />
      {texto}
    </div>
  );
}
