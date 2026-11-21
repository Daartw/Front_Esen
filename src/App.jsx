import { Route, Routes } from 'react-router-dom';
import PanelLayout from './components/PanelLayout';
import RutaProtegida from './components/RutaProtegida';
import TiendaLayout from './components/TiendaLayout';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import MisCompras from './pages/MisCompras';
import NoEncontrado from './pages/NoEncontrado';
import Nosotros from './pages/Nosotros';
import ProductoDetalle from './pages/ProductoDetalle';
import Registro from './pages/Registro';
import SinAcceso from './pages/SinAcceso';
import Tienda from './pages/Tienda';
import Categorias from './pages/admin/Categorias';
import Ordenes from './pages/admin/Ordenes';
import Productos from './pages/admin/Productos';
import Resumen from './pages/admin/Resumen';
import Usuarios from './pages/admin/Usuarios';
import { ROLES } from './utils/roles';

const { ADMIN, VENDEDOR, CLIENTE } = ROLES;

/**
 * Mapa de rutas. Las restricciones por rol se declaran aqui con <RutaProtegida>;
 * el backend vuelve a validar cada peticion, por lo que saltarse el frontend no da acceso a datos.
 */
export default function App() {
  return (
    <Routes>
      {/* Tienda: publica para visitantes, clientes y administrador */}
      <Route element={<TiendaLayout />}>
        <Route path="/" element={<Tienda />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/sin-acceso" element={<SinAcceso />} />

        <Route element={<RutaProtegida roles={[CLIENTE, ADMIN]} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mis-compras" element={<MisCompras />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Route>

      {/* Panel interno */}
      <Route element={<RutaProtegida roles={[ADMIN, VENDEDOR]} />}>
        <Route path="/panel" element={<PanelLayout />}>
          <Route path="productos" element={<Productos />} />
          <Route path="ordenes" element={<Ordenes />} />

          <Route element={<RutaProtegida roles={[ADMIN]} />}>
            <Route index element={<Resumen />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
