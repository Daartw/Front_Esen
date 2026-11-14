import { useState } from 'react';
import { usuariosApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import Cargando from '../../components/Cargando';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { mensajeDeError } from '../../utils/formato';
import { NOMBRE_ROL, ROLES } from '../../utils/roles';
import useDatos from '../../utils/useDatos';

const NUEVO = { nombre: '', apellido: '', email: '', password: '', rol: ROLES.CLIENTE, direccion: '', activo: true };

export default function Usuarios() {
  const { usuario: yo } = useAuth();
  const usuarios = useDatos(() => usuariosApi.listar());
  const [formulario, setFormulario] = useState(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const abrir = (usuario) => {
    setError('');
    setFormulario(usuario ? { ...usuario, password: '', direccion: usuario.direccion ?? '' } : NUEVO);
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
      apellido: formulario.apellido,
      email: formulario.email,
      password: formulario.password || null,
      rol: formulario.rol,
      direccion: formulario.direccion,
      activo: formulario.activo,
    };
    try {
      if (formulario.id) await usuariosApi.actualizar(formulario.id, datos);
      else await usuariosApi.crear(datos);
      setFormulario(null);
      usuarios.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo guardar el usuario'));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellido}? Si tiene compras quedará desactivado.`)) return;
    setError('');
    try {
      await usuariosApi.eliminar(usuario.id);
      usuarios.recargar();
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo eliminar el usuario'));
    }
  };

  return (
    <>
      <div className="titulo-pagina">
        <h1>Usuarios</h1>
        <button type="button" className="boton" onClick={() => abrir(null)}>
          Nuevo usuario
        </button>
      </div>

      {!formulario && <Aviso>{error || usuarios.error}</Aviso>}
      {usuarios.cargando && <Cargando />}

      {usuarios.datos && (
        <div className="tabla__contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {usuarios.datos.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td>{usuario.email}</td>
                  <td>{NOMBRE_ROL[usuario.rol]}</td>
                  <td>
                    <span className={usuario.activo ? 'estado estado--pagada' : 'estado estado--anulada'}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="acciones-fila">
                    <button type="button" className="enlace" onClick={() => abrir(usuario)}>
                      Editar
                    </button>
                    {usuario.id !== yo.id && (
                      <button type="button" className="enlace enlace--peligro" onClick={() => eliminar(usuario)}>
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formulario && (
        <Modal titulo={formulario.id ? 'Editar usuario' : 'Nuevo usuario'} alCerrar={() => setFormulario(null)}>
          <form className="formulario" onSubmit={guardar}>
            <div className="formulario__fila">
              <label>
                Nombre
                <input className="campo" name="nombre" value={formulario.nombre} onChange={cambiar} maxLength={60} required />
              </label>
              <label>
                Apellido
                <input className="campo" name="apellido" value={formulario.apellido} onChange={cambiar} maxLength={60} required />
              </label>
            </div>
            <label>
              Email
              <input className="campo" type="email" name="email" value={formulario.email} onChange={cambiar} required />
            </label>
            <div className="formulario__fila">
              <label>
                {formulario.id ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                <input
                  className="campo"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={formulario.password}
                  onChange={cambiar}
                  minLength={8}
                  required={!formulario.id}
                />
              </label>
              <label>
                Rol
                <select className="campo" name="rol" value={formulario.rol} onChange={cambiar}>
                  {Object.values(ROLES).map((rol) => (
                    <option key={rol} value={rol}>
                      {NOMBRE_ROL[rol]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Dirección
              <input className="campo" name="direccion" value={formulario.direccion} onChange={cambiar} maxLength={200} />
            </label>
            <label className="casilla">
              <input type="checkbox" name="activo" checked={formulario.activo} onChange={cambiar} />
              Cuenta activa
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
