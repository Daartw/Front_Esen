import { useState } from 'react';
import { categoriasApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import Cargando from '../../components/Cargando';
import Modal from '../../components/Modal';
import { mensajeDeError } from '../../utils/formato';
import useDatos from '../../utils/useDatos';

export default function Categorias() {
  const categorias = useDatos(() => categoriasApi.listar());
  const [formulario, setFormulario] = useState(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const abrir = (categoria) => {
    setError('');
    setFormulario(categoria ? { ...categoria, descripcion: categoria.descripcion ?? '' } : { nombre: '', descripcion: '' });
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setError('');
    const datos = { nombre: formulario.nombre, descripcion: formulario.descripcion };
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
          <form className="formulario" onSubmit={guardar}>
            <label>
              Nombre
              <input
                className="campo"
                value={formulario.nombre}
                onChange={(evento) => setFormulario({ ...formulario, nombre: evento.target.value })}
                maxLength={60}
                required
              />
            </label>
            <label>
              Descripción
              <textarea
                className="campo"
                rows={3}
                value={formulario.descripcion}
                onChange={(evento) => setFormulario({ ...formulario, descripcion: evento.target.value })}
                maxLength={255}
              />
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
