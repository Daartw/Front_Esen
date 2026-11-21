import { borrarSesion, guardarSesion, leerSesion, tokenVencido } from './sesion';

/** Crea un JWT de prueba (sin firma valida) con la expiracion indicada en segundos. */
function jwtCon(exp) {
  const cuerpo = btoa(JSON.stringify({ sub: 'cliente@esen.cl', exp })).replace(/=+$/, '');
  return `cabecera.${cuerpo}.firma`;
}

describe('sesión en localStorage', () => {
  afterEach(() => localStorage.clear());

  it('guarda y recupera tokens y usuario', () => {
    guardarSesion({ accessToken: 'a', refreshToken: 'r', usuario: { nombre: 'Ana' }, otroDato: 'x' });
    expect(leerSesion()).toEqual({ accessToken: 'a', refreshToken: 'r', usuario: { nombre: 'Ana' } });
  });

  it('borrarSesion elimina la sesión', () => {
    guardarSesion({ accessToken: 'a', refreshToken: 'r', usuario: {} });
    borrarSesion();
    expect(leerSesion()).toBeNull();
  });

  it('devuelve null si el contenido guardado está dañado', () => {
    localStorage.setItem('esen.sesion', '{no es json');
    expect(leerSesion()).toBeNull();
  });

  it('tokenVencido detecta tokens vencidos y vigentes', () => {
    const ahora = Math.floor(Date.now() / 1000);
    expect(tokenVencido(jwtCon(ahora - 60))).toBeTrue();
    expect(tokenVencido(jwtCon(ahora + 600))).toBeFalse();
  });

  it('tokenVencido trata un token inválido como vencido', () => {
    expect(tokenVencido('basura')).toBeTrue();
  });
});
