import { useState } from 'react';
import { boletasApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import Cargando from '../../components/Cargando';
import DetalleBoleta from '../../components/DetalleBoleta';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatoFecha, formatoPrecio, mensajeDeError } from '../../utils/formato';
import { ROLES } from '../../utils/roles';
import useDatos from '../../utils/useDatos';

const ESTADOS = ['PAGADA', 'ENVIADA', 'ENTREGADA', 'ANULADA'];

export default function Ordenes() {
  const { tieneRol } = useAuth();
  const puedeEditar = tieneRol(ROLES.ADMIN);
  const ordenes = useDatos(() => boletasApi.listar());
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState('');

  const abrir = async (id) => {
    setError('');
    try {
      setDetalle(await boletasApi.obtener(id));
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  const cambiarEstado = async (estado) => {
    setError('');
    try {
      setDetalle(await boletasApi.cambiarEstado(detalle.id, estado));
      ordenes.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo cambiar el estado'));
    }
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar la boleta ${detalle.numero}? Esta acción no se puede deshacer.`)) return;
    setError('');
    try {
      await boletasApi.eliminar(detalle.id);
      setDetalle(null);
      ordenes.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo eliminar la boleta'));
    }
  };

  return (
    <>
      <div className="titulo-pagina">
        <h1>Órdenes</h1>
      </div>

      {!detalle && <Aviso>{error || ordenes.error}</Aviso>}
      {ordenes.cargando && <Cargando />}
      {ordenes.datos?.length === 0 && <p className="vacio vacio--izquierda">Aún no hay órdenes registradas.</p>}

      {ordenes.datos?.length > 0 && (
        <div className="tabla__contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Boleta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th className="num">Total</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {ordenes.datos.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.numero}</td>
                  <td>{formatoFecha(orden.fecha)}</td>
                  <td>{orden.clienteNombre}</td>
                  <td className="num">{formatoPrecio(orden.total)}</td>
                  <td>
                    <span className={`estado estado--${orden.estado.toLowerCase()}`}>{orden.estado}</span>
                  </td>
                  <td className="acciones-fila">
                    <button type="button" className="enlace" onClick={() => abrir(orden.id)}>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detalle && (
        <Modal titulo={`Orden ${detalle.numero}`} alCerrar={() => setDetalle(null)} ancho={640}>
          <DetalleBoleta boleta={detalle} mostrarCliente />
          <Aviso>{error}</Aviso>
          {puedeEditar && (
            <div className="acciones">
              <label className="cantidad">
                Cambiar estado
                <select
                  value={detalle.estado}
                  disabled={detalle.estado === 'ANULADA'}
                  onChange={(evento) => cambiarEstado(evento.target.value)}
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>
              {detalle.estado === 'ANULADA' && (
                <button type="button" className="boton boton--peligro" onClick={eliminar}>
                  Eliminar boleta
                </button>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
