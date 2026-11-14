import { Link } from 'react-router-dom';
import ImagenProducto from '../components/ImagenProducto';
import { useCarrito } from '../context/CarritoContext';
import { formatoPrecio } from '../utils/formato';

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar } = useCarrito();

  if (items.length === 0) {
    return (
      <section className="seccion seccion--angosta centrado">
        <h1>Tu carrito está vacío</h1>
        <p className="vacio">Agrega productos desde la tienda para comenzar tu compra.</p>
        <Link to="/" className="boton">
          Ir a la tienda
        </Link>
      </section>
    );
  }

  return (
    <section className="seccion">
      <h1>Carrito</h1>
      <div className="carrito">
        <ul className="carrito__lista">
          {items.map((item) => (
            <li key={item.id} className="linea">
              <ImagenProducto className="linea__imagen" src={item.imagenUrl} alt={item.nombre} />
              <div className="linea__info">
                <Link to={`/producto/${item.id}`}>{item.nombre}</Link>
                {item.color && <span>{item.color}</span>}
                <span>{formatoPrecio(item.precio)} c/u</span>
              </div>
              <label className="cantidad">
                <span className="solo-lector">Cantidad de {item.nombre}</span>
                <select value={item.cantidad} onChange={(e) => cambiarCantidad(item.id, Number(e.target.value))}>
                  {Array.from({ length: Math.min(item.stock, 20) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <strong className="linea__subtotal">{formatoPrecio(item.precio * item.cantidad)}</strong>
              <button type="button" className="enlace" onClick={() => quitar(item.id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>

        <aside className="resumen">
          <h2>Resumen</h2>
          <div className="resumen__fila">
            <span>Productos</span>
            <span>{formatoPrecio(total)}</span>
          </div>
          <div className="resumen__fila">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="resumen__fila resumen__fila--total">
            <span>Total</span>
            <span>{formatoPrecio(total)}</span>
          </div>
          <Link to="/checkout" className="boton boton--ancho">
            Continuar con la compra
          </Link>
          <p className="resumen__nota">El total final lo confirma el servidor al generar la boleta.</p>
        </aside>
      </div>
    </section>
  );
}
