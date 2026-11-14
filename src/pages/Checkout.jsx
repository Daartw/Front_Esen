import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { boletasApi } from '../api/servicios';
import Aviso from '../components/Aviso';
import DetalleBoleta from '../components/DetalleBoleta';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { formatoPrecio, mensajeDeError } from '../utils/formato';

export default function Checkout() {
  const { usuario } = useAuth();
  const { items, total, vaciar } = useCarrito();
  const [direccion, setDireccion] = useState(usuario.direccion ?? '');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [boleta, setBoleta] = useState(null);

  if (boleta) {
    return (
      <section className="seccion seccion--angosta">
        <Aviso tipo="exito">Compra realizada. Tu boleta es la {boleta.numero}.</Aviso>
        <DetalleBoleta boleta={boleta} />
        <div className="acciones">
          <Link to="/mis-compras" className="boton">
            Ver mis compras
          </Link>
          <Link to="/" className="boton boton--borde">
            Seguir comprando
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) return <Navigate to="/carrito" replace />;

  const confirmar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    try {
      // Solo se envian id y cantidad: el precio lo pone el backend.
      const creada = await boletasApi.crear({
        direccionEnvio: direccion,
        items: items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      });
      vaciar();
      setBoleta(creada);
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo completar la compra'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="seccion seccion--angosta">
      <h1>Finalizar compra</h1>
      <form className="formulario" onSubmit={confirmar}>
        <label>
          Dirección de envío
          <input
            className="campo"
            value={direccion}
            onChange={(evento) => setDireccion(evento.target.value)}
            placeholder="Calle, número, comuna"
            maxLength={200}
            required
          />
        </label>

        <ul className="lista-simple">
          {items.map((item) => (
            <li key={item.id}>
              <span>
                {item.cantidad} × {item.nombre}
              </span>
              <span>{formatoPrecio(item.precio * item.cantidad)}</span>
            </li>
          ))}
          <li className="lista-simple__total">
            <span>Total</span>
            <span>{formatoPrecio(total)}</span>
          </li>
        </ul>

        <p className="resumen__nota">Pago simulado: al confirmar se genera la boleta y se descuenta el stock.</p>
        <Aviso>{error}</Aviso>
        <button type="submit" className="boton boton--ancho" disabled={enviando}>
          {enviando ? 'Procesando…' : 'Confirmar compra'}
        </button>
      </form>
    </section>
  );
}
