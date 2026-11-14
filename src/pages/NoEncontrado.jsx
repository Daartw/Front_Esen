import { Link } from 'react-router-dom';

export default function NoEncontrado() {
  return (
    <section className="seccion seccion--angosta centrado">
      <p className="sobretitulo">Error 404</p>
      <h1>Página no encontrada</h1>
      <Link to="/" className="boton">
        Ir a la tienda
      </Link>
    </section>
  );
}
