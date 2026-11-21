import axios from 'axios';
import api, { API_URL, EVENTO_SESION_EXPIRADA, renovarTokens } from './cliente';
import { guardarSesion, leerSesion } from './sesion';

const respuesta = (config, data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config });
const error401 = (config) =>
  Promise.reject(Object.assign(new Error('401'), { config, response: { status: 401, data: {} } }));

describe('cliente HTTP (Axios con interceptores JWT)', () => {
  let adaptadorApi;
  let adaptadorGlobal;

  beforeEach(() => {
    localStorage.clear();
    adaptadorApi = api.defaults.adapter;
    adaptadorGlobal = axios.defaults.adapter;
  });

  afterEach(() => {
    api.defaults.adapter = adaptadorApi;
    axios.defaults.adapter = adaptadorGlobal;
    localStorage.clear();
  });

  it('apunta al backend local cuando no hay VITE_API_URL', () => {
    expect(API_URL).toBe('http://localhost:8080/api/v1');
    expect(api.defaults.baseURL).toBe(API_URL);
  });

  it('agrega "Authorization: Bearer <token>" si hay sesión', async () => {
    guardarSesion({ accessToken: 'tok-1', refreshToken: 'ref-1', usuario: {} });
    let cabecera;
    api.defaults.adapter = async (config) => {
      cabecera = config.headers.Authorization;
      return respuesta(config, []);
    };
    await api.get('/productos');
    expect(cabecera).toBe('Bearer tok-1');
  });

  it('no envía token si no hay sesión', async () => {
    let cabecera = 'sin revisar';
    api.defaults.adapter = async (config) => {
      cabecera = config.headers.Authorization;
      return respuesta(config, []);
    };
    await api.get('/productos');
    expect(cabecera).toBeUndefined();
  });

  it('ante un 401 renueva los tokens y repite la petición', async () => {
    guardarSesion({ accessToken: 'viejo', refreshToken: 'ref-1', usuario: { nombre: 'Ana' } });
    const enviados = [];
    api.defaults.adapter = (config) => {
      enviados.push(config.headers.Authorization);
      return config.headers.Authorization === 'Bearer nuevo' ? Promise.resolve(respuesta(config, ['ok'])) : error401(config);
    };
    axios.defaults.adapter = async (config) =>
      respuesta(config, { accessToken: 'nuevo', refreshToken: 'ref-2', usuario: { nombre: 'Ana' } });

    const resultado = await api.get('/boletas/mias');

    expect(resultado.data).toEqual(['ok']);
    expect(enviados).toEqual(['Bearer viejo', 'Bearer nuevo']);
    expect(leerSesion().refreshToken).toBe('ref-2');
  });

  it('si la renovación falla borra la sesión y avisa que expiró', async () => {
    guardarSesion({ accessToken: 'viejo', refreshToken: 'vencido', usuario: {} });
    api.defaults.adapter = (config) => error401(config);
    axios.defaults.adapter = (config) => error401(config);
    const aviso = jasmine.createSpy('sesionExpirada');
    window.addEventListener(EVENTO_SESION_EXPIRADA, aviso);

    await expectAsync(api.get('/auth/me')).toBeRejected();

    window.removeEventListener(EVENTO_SESION_EXPIRADA, aviso);
    expect(leerSesion()).toBeNull();
    expect(aviso).toHaveBeenCalled();
  });

  it('no intenta renovar cuando falla el login (credenciales incorrectas)', async () => {
    guardarSesion({ accessToken: 'a', refreshToken: 'r', usuario: {} });
    api.defaults.adapter = (config) => error401(config);
    const renovacion = jasmine.createSpy('refresh');
    axios.defaults.adapter = (config) => {
      renovacion();
      return Promise.resolve(respuesta(config, {}));
    };

    await expectAsync(api.post('/auth/login', {})).toBeRejected();
    expect(renovacion).not.toHaveBeenCalled();
  });

  it('renovarTokens rechaza si no hay sesión guardada', async () => {
    await expectAsync(renovarTokens()).toBeRejectedWithError('No hay sesión');
  });
});
