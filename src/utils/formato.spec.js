import { formatoFecha, formatoPrecio, mensajeDeError } from './formato';

describe('formato', () => {
  it('formatoPrecio usa pesos chilenos sin decimales', () => {
    const texto = formatoPrecio(29990);
    expect(texto).toContain('$');
    expect(texto.replace(/\s/g, '')).toContain('29.990');
  });

  it('formatoPrecio trata null como 0', () => {
    expect(formatoPrecio(null).replace(/\s/g, '')).toContain('0');
  });

  it('formatoFecha devuelve texto vacío sin fecha', () => {
    expect(formatoFecha(null)).toBe('');
    expect(formatoFecha('2026-11-21T10:30:00')).toContain('2026');
  });

  describe('mensajeDeError', () => {
    it('explica cuando no hay conexión con el backend', () => {
      expect(mensajeDeError(new Error('Network Error'))).toContain('No se pudo conectar');
    });

    it('usa el mensaje que envía el backend', () => {
      const error = { response: { data: { mensaje: 'Stock insuficiente' } } };
      expect(mensajeDeError(error)).toBe('Stock insuficiente');
    });

    it('une los errores por campo del backend', () => {
      const error = { response: { data: { campos: { email: 'Email inválido', nombre: 'Nombre obligatorio' } } } };
      expect(mensajeDeError(error)).toBe('Email inválido. Nombre obligatorio');
    });

    it('usa el texto por defecto si la respuesta no trae mensaje', () => {
      expect(mensajeDeError({ response: { data: {} } }, 'Falló')).toBe('Falló');
    });
  });
});
