import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rutaInicial } from '../utils/roles';

export default function SinAcceso() {
  const { usuario } = useAuth();
  return (
    <section className="seccion seccion--angosta centrado">
      <p className="sobretitulo">Error 403</p>
      <h1>No tienes acceso a esta página</h1>
      <p className="vacio">Tu rol no tiene permisos para ver este contenido.</p>
      <Link to={usuario ? rutaInicial(usuario.rol) : '/'} className="boton">
        Volver
      </Link>
    </section>
  );
}
