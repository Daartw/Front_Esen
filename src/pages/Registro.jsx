import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Aviso from '../components/Aviso';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../utils/formato';
import { rutaInicial } from '../utils/roles';

const VACIO = { nombre: '', apellido: '', email: '', password: '', repetir: '', direccion: '' };

export default function Registro() {
  const { usuario, registrar } = useAuth();
  const navegar = useNavigate();
  const [datos, setDatos] = useState(VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={rutaInicial(usuario.rol)} replace />;

  const cambiar = (evento) => setDatos({ ...datos, [evento.target.name]: evento.target.value });

  const enviar = async (evento) => {
    evento.preventDefault();
    if (datos.password !== datos.repetir) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const { repetir, ...cuenta } = datos;
      await registrar(cuenta);
      navegar('/', { replace: true });
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudo crear la cuenta'));
      setEnviando(false);
    }
  };

  return (
    <section className="seccion seccion--formulario">
      <h1>Crear cuenta</h1>
      <form className="formulario" onSubmit={enviar}>
        <div className="formulario__fila">
          <label>
            Nombre
            <input className="campo" name="nombre" value={datos.nombre} onChange={cambiar} maxLength={60} required />
          </label>
          <label>
            Apellido
            <input className="campo" name="apellido" value={datos.apellido} onChange={cambiar} maxLength={60} required />
          </label>
        </div>
        <label>
          Email
          <input
            className="campo"
            type="email"
            name="email"
            autoComplete="email"
            value={datos.email}
            onChange={cambiar}
            required
          />
        </label>
        <label>
          Dirección (opcional)
          <input className="campo" name="direccion" value={datos.direccion} onChange={cambiar} maxLength={200} />
        </label>
        <div className="formulario__fila">
          <label>
            Contraseña
            <input
              className="campo"
              type="password"
              name="password"
              autoComplete="new-password"
              value={datos.password}
              onChange={cambiar}
              minLength={8}
              required
            />
          </label>
          <label>
            Repetir contraseña
            <input
              className="campo"
              type="password"
              name="repetir"
              autoComplete="new-password"
              value={datos.repetir}
              onChange={cambiar}
              minLength={8}
              required
            />
          </label>
        </div>
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
