import { useState } from 'react';
import { categoriasApi, productosApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import ErrorCampo from '../../components/ErrorCampo';
import Cargando from '../../components/Cargando';
import ImagenProducto from '../../components/ImagenProducto';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatoPrecio, mensajeDeError } from '../../utils/formato';
import { ROLES } from '../../utils/roles';
import useDatos from '../../utils/useDatos';
import useFormulario from '../../utils/useFormulario';
import { validarProducto } from '../../utils/validaciones';

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

  const guardar = async (valores) => {
    setGuardando(true);
    setError('');
    const datos = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion,
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      color: valores.color,
      imagenUrl: valores.imagenUrl.trim(),
      categoriaId: Number(valores.categoriaId),
      activo: valores.activo,
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
          <FormularioProducto
            inicial={formulario}
            categorias={categorias.datos ?? []}
            error={error}
            guardando={guardando}
            alGuardar={guardar}
            alCancelar={() => setFormulario(null)}
          />
        </Modal>
      )}
    </>
  );
}

/** Formulario de producto con validacion por campo. Recibe los datos iniciales y avisa al guardar. */
export function FormularioProducto({ inicial, categorias, error, guardando, alGuardar, alCancelar }) {
  const { valores, errores, cambiar, validarTodo, propsCampo } = useFormulario(inicial, validarProducto);

  const enviar = (evento) => {
    evento.preventDefault();
    if (validarTodo()) alGuardar(valores);
  };

  return (
    <form className="formulario" onSubmit={enviar} noValidate aria-label="Datos del producto">
      <label htmlFor="campo-nombre">
        Nombre
        <input {...propsCampo('nombre')} maxLength={120} />
        <ErrorCampo nombre="nombre" mensaje={errores.nombre} />
      </label>
      <label htmlFor="campo-descripcion">
        Descripción
        <textarea {...propsCampo('descripcion')} rows={3} maxLength={1000} />
        <ErrorCampo nombre="descripcion" mensaje={errores.descripcion} />
      </label>
      <div className="row g-3">
        <label className="col-12 col-sm-6" htmlFor="campo-precio">
          Precio (CLP)
          <input {...propsCampo('precio')} type="number" min={1} step={1} inputMode="numeric" />
          <ErrorCampo nombre="precio" mensaje={errores.precio} />
        </label>
        <label className="col-12 col-sm-6" htmlFor="campo-stock">
          Stock
          <input {...propsCampo('stock')} type="number" min={0} step={1} inputMode="numeric" />
          <ErrorCampo nombre="stock" mensaje={errores.stock} />
        </label>
      </div>
      <div className="row g-3">
        <label className="col-12 col-sm-6" htmlFor="campo-categoriaId">
          Categoría
          <select {...propsCampo('categoriaId', { tipo: 'form-select' })}>
            <option value="">Selecciona…</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <ErrorCampo nombre="categoriaId" mensaje={errores.categoriaId} />
        </label>
        <label className="col-12 col-sm-6" htmlFor="campo-color">
          Color
          <input {...propsCampo('color')} list="colores" maxLength={40} />
          <datalist id="colores">
            {['Negro', 'Blanco', 'Gris', 'Beige', 'Arena', 'Café', 'Verde oliva'].map((color) => (
              <option key={color} value={color} />
            ))}
          </datalist>
          <ErrorCampo nombre="color" mensaje={errores.color} />
        </label>
      </div>
      <label htmlFor="campo-imagenUrl">
        URL de la imagen
        <input {...propsCampo('imagenUrl')} type="url" maxLength={500} placeholder="https://…" />
        <ErrorCampo nombre="imagenUrl" mensaje={errores.imagenUrl} />
      </label>
      <label className="casilla">
        <input type="checkbox" name="activo" checked={valores.activo} onChange={cambiar} />
        Visible en la tienda
      </label>
      <Aviso>{error}</Aviso>
      <div className="acciones">
        <button type="submit" className="boton" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
        <button type="button" className="boton boton--borde" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
