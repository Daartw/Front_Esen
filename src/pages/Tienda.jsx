import { useEffect, useState } from 'react';
import { categoriasApi, productosApi } from '../api/servicios';
import Aviso from '../components/Aviso';
import Cargando from '../components/Cargando';
import TarjetaProducto from '../components/TarjetaProducto';
import useDatos from '../utils/useDatos';

const FOTO_PORTADA =
  'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=1800&q=80';

export default function Tienda() {
  const [categoriaId, setCategoriaId] = useState(null);
  const [texto, setTexto] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Espera a que el usuario deje de escribir antes de consultar al backend.
  useEffect(() => {
    const espera = setTimeout(() => setBusqueda(texto.trim()), 350);
    return () => clearTimeout(espera);
  }, [texto]);

  const categorias = useDatos(() => categoriasApi.listar());
  const productos = useDatos(
    () => productosApi.listar({ categoriaId: categoriaId ?? undefined, q: busqueda || undefined }),
    [categoriaId, busqueda],
  );

  return (
    <>
      <section className="portada" style={{ backgroundImage: `url(${FOTO_PORTADA})` }}>
        <div className="portada__texto">
          <p className="sobretitulo">Colección permanente</p>
          <h1>Lo esencial, bien hecho.</h1>
          <p>Hoodies, polerones y poleras de algodón pesado en tonos neutros.</p>
          <a href="#catalogo" className="boton boton--claro">
            Ver colección
          </a>
        </div>
      </section>

      <section id="catalogo" className="seccion">
        <div className="filtros">
          <div className="filtros__categorias" role="group" aria-label="Categorías">
            <button
              type="button"
              className={categoriaId === null ? 'chip chip--activo' : 'chip'}
              onClick={() => setCategoriaId(null)}
            >
              Todo
            </button>
            {categorias.datos?.map((categoria) => (
              <button
                type="button"
                key={categoria.id}
                className={categoriaId === categoria.id ? 'chip chip--activo' : 'chip'}
                onClick={() => setCategoriaId(categoria.id)}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="campo campo--busqueda"
            placeholder="Buscar producto"
            aria-label="Buscar producto"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
          />
        </div>

        <Aviso>{productos.error}</Aviso>
        {productos.cargando && <Cargando />}
        {!productos.cargando && !productos.error && productos.datos?.length === 0 && (
          <p className="vacio">No encontramos productos con ese filtro.</p>
        )}

        <div className="grilla">
          {!productos.cargando &&
            productos.datos?.map((producto) => <TarjetaProducto key={producto.id} producto={producto} />)}
        </div>
      </section>
    </>
  );
}
