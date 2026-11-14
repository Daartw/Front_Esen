import { formatoFecha, formatoPrecio } from '../utils/formato';

/** Muestra una boleta con sus lineas. Se usa en la tienda y en el panel. */
export default function DetalleBoleta({ boleta, mostrarCliente = false }) {
  return (
    <article className="boleta">
      <header className="boleta__cabecera">
        <div>
          <strong>Boleta {boleta.numero}</strong>
          <span>{formatoFecha(boleta.fecha)}</span>
        </div>
        <span className={`estado estado--${boleta.estado.toLowerCase()}`}>{boleta.estado}</span>
      </header>

      {mostrarCliente && (
        <p className="boleta__dato">
          Cliente: {boleta.clienteNombre} ({boleta.clienteEmail})
        </p>
      )}
      <p className="boleta__dato">Envío a: {boleta.direccionEnvio}</p>

      <table className="tabla tabla--compacta">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="num">Cant.</th>
            <th className="num">Precio</th>
            <th className="num">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {boleta.detalles.map((detalle) => (
            <tr key={detalle.id}>
              <td>{detalle.productoNombre}</td>
              <td className="num">{detalle.cantidad}</td>
              <td className="num">{formatoPrecio(detalle.precioUnitario)}</td>
              <td className="num">{formatoPrecio(detalle.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Neto</td>
            <td className="num">{formatoPrecio(boleta.neto)}</td>
          </tr>
          <tr>
            <td colSpan={3}>IVA (19 %)</td>
            <td className="num">{formatoPrecio(boleta.iva)}</td>
          </tr>
          <tr className="tabla__total">
            <td colSpan={3}>Total</td>
            <td className="num">{formatoPrecio(boleta.total)}</td>
          </tr>
        </tfoot>
      </table>
    </article>
  );
}
