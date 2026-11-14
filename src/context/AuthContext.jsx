import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EVENTO_SESION_EXPIRADA, renovarTokens } from '../api/cliente';
import { authApi } from '../api/servicios';
import { borrarSesion, guardarSesion, leerSesion, tokenVencido } from '../api/sesion';

const AuthContext = createContext(null);

/**
 * Estado global de autenticacion.
 * - Al cargar la app recupera la sesion guardada y la valida contra el backend.
 * - "cargando" evita que las rutas protegidas redirijan al login antes de terminar esa validacion.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;

    async function restaurar() {
      const sesion = leerSesion();
      if (!sesion) {
        setCargando(false);
        return;
      }
      try {
        if (tokenVencido(sesion.accessToken)) {
          await renovarTokens();
        }
        // Se pide el perfil al backend: asi se toma el rol real y no el guardado en el navegador.
        const perfil = await authApi.perfil();
        if (vigente) {
          const actual = leerSesion();
          if (actual) guardarSesion({ ...actual, usuario: perfil });
          setUsuario(perfil);
        }
      } catch (error) {
        // Solo se cierra la sesion si el backend la rechazo; si esta caido se conserva.
        if (error?.response || !leerSesion()) {
          borrarSesion();
          if (vigente) setUsuario(null);
        }
      } finally {
        if (vigente) setCargando(false);
      }
    }

    restaurar();
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    // Si se cierra sesion en otra pestaña, esta tambien se actualiza.
    const alCambiarStorage = (evento) => {
      if (evento.key === 'esen.sesion') setUsuario(leerSesion()?.usuario ?? null);
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    window.addEventListener('storage', alCambiarStorage);
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
      window.removeEventListener('storage', alCambiarStorage);
    };
  }, []);

  const iniciarSesion = useCallback(async (email, password) => {
    const sesion = guardarSesion(await authApi.login({ email, password }));
    setUsuario(sesion.usuario);
    return sesion.usuario;
  }, []);

  const registrar = useCallback(async (datos) => {
    const sesion = guardarSesion(await authApi.registro(datos));
    setUsuario(sesion.usuario);
    return sesion.usuario;
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      autenticado: Boolean(usuario),
      tieneRol: (...roles) => Boolean(usuario) && roles.includes(usuario.rol),
      iniciarSesion,
      registrar,
      cerrarSesion,
    }),
    [usuario, cargando, iniciarSesion, registrar, cerrarSesion],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
