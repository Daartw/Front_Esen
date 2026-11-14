/** Mensaje de error, exito o informacion. */
export default function Aviso({ tipo = 'error', children }) {
  if (!children) return null;
  return (
    <p className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
