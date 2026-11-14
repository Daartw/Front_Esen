import { Link } from 'react-router-dom';
import { boletasApi, productosApi, usuariosApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import Cargando from '../../components/Cargando';
import { formatoFecha, formatoPrecio } from '../../utils/formato';
import useDatos from '../../utils/useDatos';

export default function Resumen() {
  const { datos, cargando, error } = useDatos(async () => {
    const [productos, boletas, usuarios] = await Promise.all([
      productosApi.listar({ incluirInactivos: true }),
      boletasApi.listar(),
      usuariosApi.listar(),
    ]);
    return { productos, boletas, usuarios };
  });

  if (cargando) return <Cargando />;
  if (error) return <Aviso>{error}</Aviso>;

  const vigentes = datos.boletas.filter((boleta) => boleta.estado !== 'ANULADA');
  const ventas = vigentes.reduce((suma, boleta) => suma + boleta.total, 0);
  const pocoStock = datos.productos.filter((producto) => producto.activo && producto.stock <= 3);

  return (
    <>
      <h1>Resumen</h1>
      <div className="indicadores">
        <div className="indicador">
          <span>Ventas</span>
          <strong>{formatoPrecio(ventas)}</strong>
        </div>
        <div className="indicador">
          <span>Órdenes</span>
          <strong>{vigentes.length}</strong>
        </div>
        <div className="indicador">
          <span>Productos</span>
          <strong>{datos.productos.length}</strong>
        </div>
        <div className="indicador">
          <span>Usuarios</span>
          <strong>{datos.usuarios.length}</strong>
        </div>
      </div>

      <div className="columnas">
        <section>
          <h2>Últimas órdenes</h2>
          {datos.boletas.length === 0 && <p className="vacio vacio--izquierda">Aún no hay órdenes.</p>}
          <ul className="lista-simple">
            {datos.boletas.slice(0, 5).map((boleta) => (
              <li key={boleta.id}>
                <span>
                  {boleta.numero} · {boleta.clienteNombre}
                  <small>{formatoFecha(boleta.fecha)}</small>
                </span>
                <span>{formatoPrecio(boleta.total)}</span>
              </li>
            ))}
          </ul>
          <Link to="/panel/ordenes">Ver todas las órdenes</Link>
        </section>

        <section>
          <h2>Stock crítico</h2>
          {pocoStock.length === 0 && <p className="vacio vacio--izquierda">Sin productos con poco stock.</p>}
          <ul className="lista-simple">
            {pocoStock.map((producto) => (
              <li key={producto.id}>
                <span>{producto.nombre}</span>
                <span>{producto.stock === 0 ? 'Agotado' : `${producto.stock} unidades`}</span>
              </li>
            ))}
          </ul>
          <Link to="/panel/productos">Ir a productos</Link>
        </section>
      </div>
    </>
  );
}
