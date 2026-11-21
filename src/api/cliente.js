import axios from 'axios';
import { borrarSesion, guardarSesion, leerSesion } from './sesion';

// En Vite la URL viene de VITE_API_URL; en las pruebas (Karma) import.meta.env no existe y se usa la local.
export const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api/v1';

/** Instancia unica de axios para todo el frontend. */
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

/** Evento que escucha AuthContext para cerrar la sesion en pantalla. */
export const EVENTO_SESION_EXPIRADA = 'esen:sesion-expirada';

// Interceptor de salida: agrega el token JWT a cada peticion.
api.interceptors.request.use((config) => {
  const sesion = leerSesion();
  if (sesion?.accessToken) {
    config.headers.Authorization = `Bearer ${sesion.accessToken}`;
  }
  return config;
});

// Si varias peticiones fallan a la vez con 401, todas esperan la misma renovacion.
let renovacionEnCurso = null;

export function renovarTokens() {
  if (!renovacionEnCurso) {
    const sesion = leerSesion();
    if (!sesion?.refreshToken) {
      return Promise.reject(new Error('No hay sesión'));
    }
    // axios "limpio" (sin interceptores) para no entrar en un ciclo infinito.
    renovacionEnCurso = axios
      .post(`${API_URL}/auth/refresh`, { refreshToken: sesion.refreshToken })
      .then((respuesta) => guardarSesion(respuesta.data))
      .finally(() => {
        renovacionEnCurso = null;
      });
  }
  return renovacionEnCurso;
}

// Interceptor de entrada: ante un 401 renueva el token una vez y repite la peticion.
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config;
    const esRutaDeAuth = original?.url?.includes('/auth/login') || original?.url?.includes('/auth/registro');

    if (error.response?.status === 401 && original && !original._reintentada && !esRutaDeAuth) {
      original._reintentada = true;
      try {
        const sesion = await renovarTokens();
        original.headers.Authorization = `Bearer ${sesion.accessToken}`;
        return api(original);
      } catch {
        borrarSesion();
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
      }
    }
    return Promise.reject(error);
  },
);

export default api;
