import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Aviso from '../components/Aviso';
import ErrorCampo from '../components/ErrorCampo';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../utils/formato';
import { ROLES, rutaInicial } from '../utils/roles';
import useFormulario from '../utils/useFormulario';
import { validarLogin } from '../utils/validaciones';

export default function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { valores, errores, validarTodo, propsCampo } = useFormulario({ email: '', password: '' }, validarLogin);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={rutaInicial(usuario.rol)} replace />;

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');
    if (!validarTodo()) return;
    setEnviando(true);
    try {
      const conectado = await iniciarSesion(valores.email.trim(), valores.password);
      // El cliente vuelve a la pagina que intentaba abrir (por ejemplo, el checkout).
      const desde = ubicacion.state?.desde;
      navegar(conectado.rol === ROLES.CLIENTE && desde ? desde : rutaInicial(conectado.rol), { replace: true });
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo iniciar sesión'));
      setEnviando(false);
    }
  };

  return (
    <section className="seccion seccion--formulario">
      <h1>Ingresar</h1>
      <form className="formulario" onSubmit={enviar} noValidate aria-label="Iniciar sesión">
        <label htmlFor="campo-email">
          Email
          <input {...propsCampo('email')} type="email" autoComplete="email" placeholder="nombre@correo.cl" />
          <ErrorCampo nombre="email" mensaje={errores.email} />
        </label>
        <label htmlFor="campo-password">
          Contraseña
          <input {...propsCampo('password')} type="password" autoComplete="current-password" />
          <ErrorCampo nombre="password" mensaje={errores.password} />
        </label>
        <Aviso>{error}</Aviso>
        <button type="submit" className="boton boton--ancho" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p className="formulario__pie">
        ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
      </p>
    </section>
  );
}
