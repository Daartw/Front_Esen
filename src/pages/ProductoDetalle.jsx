import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productosApi } from '../api/servicios';
import Aviso from '../components/Aviso';
import Cargando from '../components/Cargando';
import ImagenProducto from '../components/ImagenProducto';
import { useCarrito } from '../context/CarritoContext';
import { formatoPrecio } from '../utils/formato';
import useDatos from '../utils/useDatos';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregar, items } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const { datos: producto, cargando, error } = useDatos(() => productosApi.obtener(id), [id]);

  if (cargando) return <Cargando />;
  if (error) {
    return (
      <section className="seccion seccion--angosta">
        <Aviso>{error}</Aviso>
        <Link to="/" className="boton boton--borde">
          Volver a la tienda
        </Link>
      </section>
    );
  }

  const enCarrito = items.find((item) => item.id === producto.id)?.cantidad ?? 0;
  const disponible = producto.activo ? producto.stock - enCarrito : 0;

  const agregarAlCarrito = () => {
    agregar(producto, cantidad);
    setCantidad(1);
    setAgregado(true);
  };

  return (
    <section className="seccion detalle">
      <div className="detalle__imagen">
        <ImagenProducto src={producto.imagenUrl} alt={producto.nombre} />
      </div>

      <div className="detalle__info">
        <Link to="/" className="migas">
          Tienda / {producto.categoriaNombre}
        </Link>
        <h1>{producto.nombre}</h1>
        <p className="detalle__precio">{formatoPrecio(producto.precio)}</p>
        <p className="detalle__descripcion">{producto.descripcion}</p>

        <dl className="ficha">
          {producto.color && (
            <>
              <dt>Color</dt>
              <dd>{producto.color}</dd>
            </>
          )}
          <dt>Disponibilidad</dt>
          <dd>{producto.stock > 0 && producto.activo ? `${producto.stock} unidades` : 'Agotado'}</dd>
        </dl>

        {disponible > 0 ? (
          <div className="detalle__compra">
            <label className="cantidad">
              Cantidad
              <select value={cantidad} onChange={(evento) => setCantidad(Number(evento.target.value))}>
                {Array.from({ length: Math.min(disponible, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="boton" onClick={agregarAlCarrito}>
              Agregar al carrito
            </button>
          </div>
        ) : (
          <p className="vacio vacio--izquierda">
            {enCarrito > 0 ? 'Ya tienes en el carrito todas las unidades disponibles.' : 'Producto agotado.'}
          </p>
        )}

        {agregado && (
          <Aviso tipo="exito">
            Producto agregado. <Link to="/carrito">Ir al carrito</Link>
          </Aviso>
        )}
        <p className="detalle__nota">Precio con IVA incluido. Cambios dentro de 30 días.</p>
      </div>
    </section>
  );
}
