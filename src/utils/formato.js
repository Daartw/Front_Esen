const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export const formatoPrecio = (valor) => clp.format(valor ?? 0);

export const formatoFecha = (iso) =>
  iso ? new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }) : '';

/** Convierte un error de axios en un mensaje legible usando el formato de error del backend. */
export function mensajeDeError(error, porDefecto = 'Ocurrió un error inesperado') {
  if (!error?.response) {
    return 'No se pudo conectar con el servidor. Revisa que el backend esté en ejecución.';
  }
  const datos = error.response.data;
  if (datos?.campos) {
    return Object.values(datos.campos).join('. ');
  }
  return datos?.mensaje || porDefecto;
}
