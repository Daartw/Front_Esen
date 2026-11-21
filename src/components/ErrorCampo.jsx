/** Mensaje de error bajo un campo del formulario (estilo de validacion de Bootstrap). */
export default function ErrorCampo({ nombre, mensaje }) {
  if (!mensaje) return null;
  return (
    <span id={`error-${nombre}`} className="invalid-feedback d-block" role="alert">
      {mensaje}
    </span>
  );
}
