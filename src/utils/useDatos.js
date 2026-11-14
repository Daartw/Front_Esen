import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from './formato';

/**
 * Carga datos desde el API y expone los tres estados de toda llamada:
 * cargando, error y datos. "recargar" repite la consulta (por ejemplo, despues de guardar).
 */
export default function useDatos(consulta, dependencias = []) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setDatos(await consulta());
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudieron cargar los datos'));
    } finally {
      setCargando(false);
    }
  }, dependencias);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { datos, cargando, error, recargar };
}
