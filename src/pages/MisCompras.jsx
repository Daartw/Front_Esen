import { Link } from 'react-router-dom';
import { boletasApi } from '../api/servicios';
import Aviso from '../components/Aviso';
import Cargando from '../components/Cargando';
import DetalleBoleta from '../components/DetalleBoleta';
import useDatos from '../utils/useDatos';

export default function MisCompras() {
  const { datos: boletas, cargando, error } = useDatos(() => boletasApi.mias());

  return (
    <section className="seccion seccion--angosta">
      <h1>Mis compras</h1>
      <Aviso>{error}</Aviso>
      {cargando && <Cargando />}
      {boletas?.length === 0 && (
        <p className="vacio">
          Todavía no tienes compras. <Link to="/">Ir a la tienda</Link>
        </p>
      )}
      {boletas?.map((boleta) => (
        <DetalleBoleta key={boleta.id} boleta={boleta} />
      ))}
    </section>
  );
}
