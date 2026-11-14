/**
 * Almacen de la sesion en localStorage.
 * Guardar los tokens aqui es lo que permite que la sesion sobreviva a recargar
 * la pagina o cerrar la pestaña. Las claves nunca se guardan.
 */
const CLAVE = 'esen.sesion';

export function leerSesion() {
  try {
    const texto = localStorage.getItem(CLAVE);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

export function guardarSesion(respuestaAuth) {
  const sesion = {
    accessToken: respuestaAuth.accessToken,
    refreshToken: respuestaAuth.refreshToken,
    usuario: respuestaAuth.usuario,
  };
  localStorage.setItem(CLAVE, JSON.stringify(sesion));
  return sesion;
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE);
}

/** Lee la fecha de expiracion (claim "exp") del JWT sin verificar la firma. */
export function tokenVencido(token) {
  try {
    const cuerpo = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return cuerpo.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
