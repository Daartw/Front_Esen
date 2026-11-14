import { useState } from 'react';
import { categoriasApi, productosApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import Cargando from '../../components/Cargando';
import ImagenProducto from '../../components/ImagenProducto';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatoPrecio, mensajeDeError } from '../../utils/formato';
import { ROLES } from '../../utils/roles';
import useDatos from '../../utils/useDatos';

const NUEVO = { nombre: '', descripcion: '', precio: '', stock: '', color: '', imagenUrl: '', categoriaId: '', activo: true };

export default function Productos() {
  const { tieneRol } = useAuth();
  // El vendedor comparte esta pantalla pero solo en modo lectura: no se dibujan los botones de edicion.
  const puedeEditar = tieneRol(ROLES.ADMIN);

  const productos = useDatos(() => productosApi.listar({ incluirInactivos: true }));
  const categorias = useDatos(() => categoriasApi.listar());
  const [formulario, setFormulario] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const abrirDetalle = async (id) => {
    setError('');
    try {
      setDetalle(await productosApi.obtener(id));
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  const editar = (producto) => {
    setError('');
    setFormulario({ ...producto, descripcion: producto.descripcion ?? '', color: producto.color ?? '', imagenUrl: producto.imagenUrl ?? '' });
  };

  const cambiar = (evento) => {
    const { name, value, type, checked } = evento.target;
    setFormulario({ ...formulario, [name]: type === 'checkbox' ? checked : value });
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setError('');
    const datos = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      color: formulario.color,
      imagenUrl: formulario.imagenUrl,
      categoriaId: Number(formulario.categoriaId),
      activo: formulario.activo,
    };
    try {
      if (formulario.id) await productosApi.actualizar(formulario.id, datos);
      else await productosApi.crear(datos);
      setFormulario(null);
      productos.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo guardar el producto'));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Si tiene ventas quedará desactivado.`)) return;
    setError('');
    try {
      await productosApi.eliminar(producto.id);
      productos.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo eliminar el producto'));
    }
  };

  return (
    <>
      <div className="titulo-pagina">
        <h1>Productos</h1>
        {puedeEditar && (
          <button type="button" className="boton" onClick={() => { setError(''); setFormulario(NUEVO); }}>
            Nuevo producto
          </button>
        )}
      </div>

      {!formulario && <Aviso>{error || productos.error}</Aviso>}
      {productos.cargando && <Cargando />}

      {productos.datos && (
        <div className="tabla__contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="num">Precio</th>
                <th className="num">Stock</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {productos.datos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="celda-producto">
                      <ImagenProducto src={producto.imagenUrl} alt="" />
                      {producto.nombre}
                    </div>
                  </td>
                  <td>{producto.categoriaNombre}</td>
                  <td className="num">{formatoPrecio(producto.precio)}</td>
                  <td className="num">{producto.stock}</td>
                  <td>
                    <span className={producto.activo ? 'estado estado--pagada' : 'estado estado--anulada'}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="acciones-fila">
                    <button type="button" className="enlace" onClick={() => abrirDetalle(producto.id)}>
                      Ver
                    </button>
                    {puedeEditar && (
                      <>
                        <button type="button" className="enlace" onClick={() => editar(producto)}>
                          Editar
                        </button>
                        <button type="button" className="enlace enlace--peligro" onClick={() => eliminar(producto)}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detalle && (
        <Modal titulo={detalle.nombre} alCerrar={() => setDetalle(null)}>
          <div className="detalle-modal">
            <ImagenProducto src={detalle.imagenUrl} alt={detalle.nombre} />
            <dl className="ficha">
              <dt>Categoría</dt>
              <dd>{detalle.categoriaNombre}</dd>
              <dt>Precio</dt>
              <dd>{formatoPrecio(detalle.precio)}</dd>
              <dt>Stock</dt>
              <dd>{detalle.stock} unidades</dd>
              <dt>Color</dt>
              <dd>{detalle.color || '—'}</dd>
              <dt>Estado</dt>
              <dd>{detalle.activo ? 'Activo' : 'Inactivo'}</dd>
              <dt>Descripción</dt>
              <dd>{detalle.descripcion || '—'}</dd>
            </dl>
          </div>
        </Modal>
      )}

      {formulario && (
        <Modal titulo={formulario.id ? 'Editar producto' : 'Nuevo producto'} alCerrar={() => setFormulario(null)}>
          <form className="formulario" onSubmit={guardar}>
            <label>
              Nombre
              <input className="campo" name="nombre" value={formulario.nombre} onChange={cambiar} maxLength={120} required />
            </label>
            <label>
              Descripción
              <textarea className="campo" name="descripcion" rows={3} value={formulario.descripcion} onChange={cambiar} maxLength={1000} />
            </label>
            <div className="formulario__fila">
              <label>
                Precio (CLP)
                <input className="campo" type="number" name="precio" min={1} value={formulario.precio} onChange={cambiar} required />
              </label>
              <label>
                Stock
                <input className="campo" type="number" name="stock" min={0} value={formulario.stock} onChange={cambiar} required />
              </label>
            </div>
            <div className="formulario__fila">
              <label>
                Categoría
                <select className="campo" name="categoriaId" value={formulario.categoriaId} onChange={cambiar} required>
                  <option value="">Selecciona…</option>
                  {categorias.datos?.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Color
                <input className="campo" name="color" value={formulario.color} onChange={cambiar} maxLength={40} />
              </label>
            </div>
            <label>
              URL de la imagen
              <input className="campo" type="url" name="imagenUrl" value={formulario.imagenUrl} onChange={cambiar} maxLength={500} placeholder="https://…" />
            </label>
            <label className="casilla">
              <input type="checkbox" name="activo" checked={formulario.activo} onChange={cambiar} />
              Visible en la tienda
            </label>
            <Aviso>{error}</Aviso>
            <div className="acciones">
              <button type="submit" className="boton" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
              <button type="button" className="boton boton--borde" onClick={() => setFormulario(null)}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
