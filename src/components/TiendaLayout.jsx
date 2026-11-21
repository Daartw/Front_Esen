import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { NOMBRE_ROL, ROLES } from '../utils/roles';

export default function TiendaLayout() {
  const { usuario, cargando, tieneRol, cerrarSesion } = useAuth();
  const { unidades } = useCarrito();
  const navegar = useNavigate();
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Al cambiar de pagina se cierra el menu en celulares.
  useEffect(() => setMenuAbierto(false), [pathname]);

  // El vendedor no usa la tienda: su vista es solo el panel de productos y ordenes.
  if (!cargando && tieneRol(ROLES.VENDEDOR) && pathname !== '/sin-acceso') {
    return <Navigate to="/panel/productos" replace />;
  }

  const salir = () => {
    cerrarSesion();
    navegar('/');
  };

  return (
    <div className="pagina">
      <p className="franja">Envío gratis a todo Chile en compras sobre $60.000</p>
      <header className="cabecera">
        <button
          type="button"
          className="cabecera__menu d-md-none"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? 'Cerrar' : 'Menú'}
        </button>
        <nav
          id="menu-principal"
          className={`cabecera__nav collapse d-md-flex${menuAbierto ? ' show' : ''}`}
          aria-label="Principal"
        >
          <NavLink to="/" end>
            Tienda
          </NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>
          {tieneRol(ROLES.CLIENTE, ROLES.ADMIN) && <NavLink to="/mis-compras">Mis compras</NavLink>}
          {tieneRol(ROLES.ADMIN) && <NavLink to="/panel">Panel</NavLink>}
        </nav>

        <Link to="/" className="logo" aria-label="ESEN, inicio">
          ESEN
        </Link>

        <div className="cabecera__acciones">
          {usuario ? (
            <>
              <span className="cabecera__usuario" title={NOMBRE_ROL[usuario.rol]}>
                Hola, {usuario.nombre}
              </span>
              <button type="button" className="enlace" onClick={salir}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login">Ingresar</NavLink>
          )}
          <NavLink to="/carrito" className="cabecera__carrito">
            Carrito <span className="contador">{unidades}</span>
          </NavLink>
        </div>
      </header>

      <main className="contenido">
        <Outlet />
      </main>

      <footer className="pie">
        <span className="logo logo--chico">ESEN</span>
        <p>Básicos esenciales en tonos neutros.</p>
        <nav aria-label="Pie de página">
          <ul className="pie__enlaces">
            <li>
              <Link to="/">Tienda</Link>
            </li>
            <li>
              <Link to="/nosotros">Nosotros y contacto</Link>
            </li>
            <li>
              <Link to="/carrito">Carrito</Link>
            </li>
            <li>
              <Link to={usuario ? '/mis-compras' : '/login'}>{usuario ? 'Mis compras' : 'Ingresar'}</Link>
            </li>
            <li>
              <a href="https://github.com/Daartw/Front_Esen" target="_blank" rel="noreferrer">
                Código fuente
              </a>
            </li>
          </ul>
        </nav>
        <p className="pie__nota">
          Proyecto académico DSY1104 — sitio de demostración, no realiza ventas reales. Fotografías de Unsplash.
        </p>
      </footer>
    </div>
  );
}
