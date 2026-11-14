import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Aviso from '../components/Aviso';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../utils/formato';
import { ROLES, rutaInicial } from '../utils/roles';

export default function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={rutaInicial(usuario.rol)} replace />;

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const conectado = await iniciarSesion(email, password);
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
      <form className="formulario" onSubmit={enviar}>
        <label>
          Email
          <input
            className="campo"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            className="campo"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            required
          />
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
