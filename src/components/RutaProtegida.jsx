import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import Cargando from './Cargando';

/**
 * Protege un grupo de rutas.
 * - Sin sesion: envia al login y recuerda a donde queria ir el usuario.
 * - Con sesion pero sin el rol requerido: muestra la pagina "sin acceso".
 */
export default function RutaProtegida({ roles }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  // Mientras se valida la sesion guardada no se decide nada (evita el salto al login al recargar).
  if (cargando) return <Cargando pantallaCompleta />;

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles && !roles.includes(usuario.rol)) {
    // El vendedor que entra a /panel va directo a lo unico que puede ver.
    if (usuario.rol === ROLES.VENDEDOR && ubicacion.pathname === '/panel') {
      return <Navigate to="/panel/productos" replace />;
    }
    return <Navigate to="/sin-acceso" replace />;
  }
  return <Outlet />;
}
