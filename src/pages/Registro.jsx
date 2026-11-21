import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Aviso from '../components/Aviso';
import ErrorCampo from '../components/ErrorCampo';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../utils/formato';
import { rutaInicial } from '../utils/roles';
import useFormulario from '../utils/useFormulario';
import { COMUNAS_SUGERIDAS, NIVELES_PASSWORD, fuerzaPassword, validarRegistro } from '../utils/validaciones';

const VACIO = { nombre: '', apellido: '', email: '', password: '', repetir: '', direccion: '' };

export default function Registro() {
  const { usuario, registrar } = useAuth();
  const navegar = useNavigate();
  const { valores, errores, validarTodo, propsCampo } = useFormulario(VACIO, validarRegistro);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={rutaInicial(usuario.rol)} replace />;

  const fuerza = fuerzaPassword(valores.password);

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');
    if (!validarTodo()) return;
    setEnviando(true);
    try {
      const { repetir, ...cuenta } = valores;
      await registrar({ ...cuenta, nombre: cuenta.nombre.trim(), apellido: cuenta.apellido.trim(), email: cuenta.email.trim() });
      navegar('/', { replace: true });
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo crear la cuenta'));
      setEnviando(false);
    }
  };

  return (
    <section className="seccion seccion--formulario">
      <h1>Crear cuenta</h1>
      <form className="formulario" onSubmit={enviar} noValidate aria-label="Crear cuenta">
        <div className="row g-3">
          <label className="col-12 col-sm-6" htmlFor="campo-nombre">
            Nombre
            <input {...propsCampo('nombre')} autoComplete="given-name" maxLength={60} />
            <ErrorCampo nombre="nombre" mensaje={errores.nombre} />
          </label>
          <label className="col-12 col-sm-6" htmlFor="campo-apellido">
            Apellido
            <input {...propsCampo('apellido')} autoComplete="family-name" maxLength={60} />
            <ErrorCampo nombre="apellido" mensaje={errores.apellido} />
          </label>
        </div>
        <label htmlFor="campo-email">
          Email
          <input {...propsCampo('email')} type="email" autoComplete="email" placeholder="nombre@correo.cl" />
          <ErrorCampo nombre="email" mensaje={errores.email} />
        </label>
        <label htmlFor="campo-direccion">
          Dirección (opcional)
          <input
            {...propsCampo('direccion')}
            autoComplete="street-address"
            list="comunas"
            placeholder="Calle, número, comuna"
            maxLength={200}
          />
          <ErrorCampo nombre="direccion" mensaje={errores.direccion} />
        </label>
        <datalist id="comunas">
          {COMUNAS_SUGERIDAS.map((comuna) => (
            <option key={comuna} value={comuna} />
          ))}
        </datalist>
        <div className="row g-3">
          <label className="col-12 col-sm-6" htmlFor="campo-password">
            Contraseña
            <input {...propsCampo('password')} type="password" autoComplete="new-password" />
            {valores.password && !errores.password && (
              <small className="form-text sugerencia">Seguridad: {NIVELES_PASSWORD[fuerza]}</small>
            )}
            <ErrorCampo nombre="password" mensaje={errores.password} />
          </label>
          <label className="col-12 col-sm-6" htmlFor="campo-repetir">
            Repetir contraseña
            <input {...propsCampo('repetir')} type="password" autoComplete="new-password" />
            <ErrorCampo nombre="repetir" mensaje={errores.repetir} />
          </label>
        </div>
        <small className="form-text sugerencia">Mínimo 8 caracteres, combinando letras y números.</small>
        <Aviso>{error}</Aviso>
        <button type="submit" className="boton boton--ancho" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
      <p className="formulario__pie">
        ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
      </p>
    </section>
  );
}
