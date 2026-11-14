import { Link } from 'react-router-dom';
import { formatoPrecio } from '../utils/formato';
import ImagenProducto from './ImagenProducto';

export default function TarjetaProducto({ producto }) {
  const agotado = producto.stock === 0;
  return (
    <Link to={`/producto/${producto.id}`} className="tarjeta">
      <div className="tarjeta__imagen">
        <ImagenProducto src={producto.imagenUrl} alt={producto.nombre} />
        {agotado && <span className="etiqueta etiqueta--oscura">Agotado</span>}
        {!agotado && producto.stock <= 3 && <span className="etiqueta">Últimas unidades</span>}
      </div>
      <div className="tarjeta__texto">
        <span className="tarjeta__categoria">{producto.categoriaNombre}</span>
        <h3>{producto.nombre}</h3>
        <span className="tarjeta__precio">{formatoPrecio(producto.precio)}</span>
      </div>
    </Link>
  );
}
