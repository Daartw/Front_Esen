import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MENU_PANEL, NOMBRE_ROL, ROLES } from '../utils/roles';

export default function PanelLayout() {
  const { usuario, tieneRol, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  // Solo se dibujan las opciones permitidas para el rol: el vendedor ve dos, el admin todas.
  const opciones = MENU_PANEL.filter((opcion) => opcion.roles.includes(usuario.rol));

  const salir = () => {
    cerrarSesion();
    navegar('/login');
  };

  return (
    <div className="panel">
      <aside className="panel__lateral">
        <span className="logo logo--claro">ESEN</span>
        <span className="panel__rol">{NOMBRE_ROL[usuario.rol]}</span>

        <nav className="panel__menu" aria-label="Panel">
          {opciones.map((opcion) => (
            <NavLink key={opcion.ruta} to={opcion.ruta} end={opcion.exacta}>
              {opcion.etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className="panel__pie">
          <span className="panel__usuario">
            {usuario.nombre} {usuario.apellido}
            <small>{usuario.email}</small>
          </span>
          {tieneRol(ROLES.ADMIN) && <Link to="/">Ver tienda</Link>}
          <button type="button" className="enlace" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="panel__contenido">
        <Outlet />
      </main>
    </div>
  );
}
