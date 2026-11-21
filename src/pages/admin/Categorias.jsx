import { useState } from 'react';
import { categoriasApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import ErrorCampo from '../../components/ErrorCampo';
import Cargando from '../../components/Cargando';
import Modal from '../../components/Modal';
import { mensajeDeError } from '../../utils/formato';
import useDatos from '../../utils/useDatos';
import useFormulario from '../../utils/useFormulario';
import { validarCategoria } from '../../utils/validaciones';

export default function Categorias() {
  const categorias = useDatos(() => categoriasApi.listar());
  const [formulario, setFormulario] = useState(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const abrir = (categoria) => {
    setError('');
    setFormulario(categoria ? { ...categoria, descripcion: categoria.descripcion ?? '' } : { nombre: '', descripcion: '' });
  };

  const guardar = async (valores) => {
    setGuardando(true);
    setError('');
    const datos = { nombre: valores.nombre.trim(), descripcion: valores.descripcion };
    try {
      if (formulario.id) await categoriasApi.actualizar(formulario.id, datos);
      else await categoriasApi.crear(datos);
      setFormulario(null);
      categorias.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo guardar la categoría'));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    setError('');
    try {
      await categoriasApi.eliminar(categoria.id);
      categorias.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo eliminar la categoría'));
    }
  };

  return (
    <>
      <div className="titulo-pagina">
        <h1>Categorías</h1>
        <button type="button" className="boton" onClick={() => abrir(null)}>
          Nueva categoría
        </button>
      </div>

      {!formulario && <Aviso>{error || categorias.error}</Aviso>}
      {categorias.cargando && <Cargando />}

      {categorias.datos && (
        <div className="tabla__contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {categorias.datos.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion}</td>
                  <td className="acciones-fila">
                    <button type="button" className="enlace" onClick={() => abrir(categoria)}>
                      Editar
                    </button>
                    <button type="button" className="enlace enlace--peligro" onClick={() => eliminar(categoria)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formulario && (
        <Modal titulo={formulario.id ? 'Editar categoría' : 'Nueva categoría'} alCerrar={() => setFormulario(null)} ancho={460}>
          <FormularioCategoria
            inicial={formulario}
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

/** Formulario de categoria con validacion por campo. */
export function FormularioCategoria({ inicial, error, guardando, alGuardar, alCancelar }) {
  const { valores, errores, validarTodo, propsCampo } = useFormulario(inicial, validarCategoria);

  const enviar = (evento) => {
    evento.preventDefault();
    if (validarTodo()) alGuardar(valores);
  };

  return (
    <form className="formulario" onSubmit={enviar} noValidate aria-label="Datos de la categoría">
      <label htmlFor="campo-nombre">
        Nombre
        <input {...propsCampo('nombre')} maxLength={60} />
        <ErrorCampo nombre="nombre" mensaje={errores.nombre} />
      </label>
      <label htmlFor="campo-descripcion">
        Descripción
        <textarea {...propsCampo('descripcion')} rows={3} maxLength={255} />
        <small className="form-text sugerencia">{(valores.descripcion ?? '').length}/255 caracteres</small>
        <ErrorCampo nombre="descripcion" mensaje={errores.descripcion} />
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
