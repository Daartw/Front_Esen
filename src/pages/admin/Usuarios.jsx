import { useState } from 'react';
import { usuariosApi } from '../../api/servicios';
import Aviso from '../../components/Aviso';
import ErrorCampo from '../../components/ErrorCampo';
import Cargando from '../../components/Cargando';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { mensajeDeError } from '../../utils/formato';
import { NOMBRE_ROL, ROLES } from '../../utils/roles';
import useDatos from '../../utils/useDatos';
import useFormulario from '../../utils/useFormulario';
import { validarUsuario } from '../../utils/validaciones';

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

  const guardar = async (valores) => {
    setGuardando(true);
    setError('');
    const datos = {
      nombre: valores.nombre.trim(),
      apellido: valores.apellido.trim(),
      email: valores.email.trim(),
      password: valores.password || null,
      rol: valores.rol,
      direccion: valores.direccion,
      activo: valores.activo,
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
          <FormularioUsuario
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

/** Formulario de usuario con validacion por campo. Al editar, la contraseña es opcional. */
export function FormularioUsuario({ inicial, error, guardando, alGuardar, alCancelar }) {
  const { valores, errores, cambiar, validarTodo, propsCampo } = useFormulario(inicial, validarUsuario);

  const enviar = (evento) => {
    evento.preventDefault();
    if (validarTodo()) alGuardar(valores);
  };

  return (
    <form className="formulario" onSubmit={enviar} noValidate aria-label="Datos del usuario">
      <div className="row g-3">
        <label className="col-12 col-sm-6" htmlFor="campo-nombre">
          Nombre
          <input {...propsCampo('nombre')} maxLength={60} />
          <ErrorCampo nombre="nombre" mensaje={errores.nombre} />
        </label>
        <label className="col-12 col-sm-6" htmlFor="campo-apellido">
          Apellido
          <input {...propsCampo('apellido')} maxLength={60} />
          <ErrorCampo nombre="apellido" mensaje={errores.apellido} />
        </label>
      </div>
      <label htmlFor="campo-email">
        Email
        <input {...propsCampo('email')} type="email" autoComplete="off" placeholder="nombre@correo.cl" />
        <ErrorCampo nombre="email" mensaje={errores.email} />
      </label>
      <div className="row g-3">
        <label className="col-12 col-sm-6" htmlFor="campo-password">
          {valores.id ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          <input {...propsCampo('password')} type="password" autoComplete="new-password" />
          <ErrorCampo nombre="password" mensaje={errores.password} />
        </label>
        <label className="col-12 col-sm-6" htmlFor="campo-rol">
          Rol
          <select {...propsCampo('rol', { tipo: 'form-select' })}>
            {Object.values(ROLES).map((rol) => (
              <option key={rol} value={rol}>
                {NOMBRE_ROL[rol]}
              </option>
            ))}
          </select>
          <ErrorCampo nombre="rol" mensaje={errores.rol} />
        </label>
      </div>
      <label htmlFor="campo-direccion">
        Dirección
        <input {...propsCampo('direccion')} maxLength={200} />
        <ErrorCampo nombre="direccion" mensaje={errores.direccion} />
      </label>
      <label className="casilla">
        <input type="checkbox" name="activo" checked={valores.activo} onChange={cambiar} />
        Cuenta activa
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
