import api from './cliente';
import { authApi, boletasApi, categoriasApi, productosApi, usuariosApi } from './servicios';

describe('servicios del API (un método por endpoint)', () => {
  let adaptador;
  let peticiones;

  beforeEach(() => {
    peticiones = [];
    adaptador = api.defaults.adapter;
    api.defaults.adapter = async (config) => {
      peticiones.push({
        metodo: config.method.toUpperCase(),
        url: config.url,
        params: config.params,
        cuerpo: config.data ? JSON.parse(config.data) : undefined,
      });
      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
    };
  });

  afterEach(() => {
    api.defaults.adapter = adaptador;
  });

  it('auth: login, registro y perfil', async () => {
    expect(await authApi.login({ email: 'a@b.cl', password: 'x' })).toEqual({ ok: true });
    await authApi.registro({ nombre: 'Ana' });
    await authApi.perfil();
    expect(peticiones.map((p) => `${p.metodo} ${p.url}`)).toEqual(['POST /auth/login', 'POST /auth/registro', 'GET /auth/me']);
    expect(peticiones[0].cuerpo).toEqual({ email: 'a@b.cl', password: 'x' });
  });

  it('productos: CRUD completo y filtros', async () => {
    await productosApi.listar({ categoriaId: 2, q: 'hoodie' });
    await productosApi.obtener(5);
    await productosApi.crear({ nombre: 'Polera' });
    await productosApi.actualizar(5, { nombre: 'Polera 2' });
    await productosApi.eliminar(5);
    expect(peticiones.map((p) => `${p.metodo} ${p.url}`)).toEqual([
      'GET /productos',
      'GET /productos/5',
      'POST /productos',
      'PUT /productos/5',
      'DELETE /productos/5',
    ]);
    expect(peticiones[0].params).toEqual({ categoriaId: 2, q: 'hoodie' });
  });

  it('categorías y usuarios: CRUD', async () => {
    await categoriasApi.listar();
    await categoriasApi.crear({ nombre: 'Gorros' });
    await categoriasApi.actualizar(1, { nombre: 'Gorros' });
    await categoriasApi.eliminar(1);
    await usuariosApi.listar();
    await usuariosApi.crear({ nombre: 'Ana' });
    await usuariosApi.actualizar(3, { nombre: 'Ana' });
    await usuariosApi.eliminar(3);
    expect(peticiones.map((p) => `${p.metodo} ${p.url}`)).toEqual([
      'GET /categorias',
      'POST /categorias',
      'PUT /categorias/1',
      'DELETE /categorias/1',
      'GET /usuarios',
      'POST /usuarios',
      'PUT /usuarios/3',
      'DELETE /usuarios/3',
    ]);
  });

  it('boletas: compra, consultas, cambio de estado y eliminación', async () => {
    await boletasApi.crear({ direccionEnvio: 'Calle 1', items: [{ productoId: 1, cantidad: 2 }] });
    await boletasApi.mias();
    await boletasApi.listar();
    await boletasApi.obtener(9);
    await boletasApi.cambiarEstado(9, 'ENVIADA');
    await boletasApi.eliminar(9);
    expect(peticiones.map((p) => `${p.metodo} ${p.url}`)).toEqual([
      'POST /boletas',
      'GET /boletas/mias',
      'GET /boletas',
      'GET /boletas/9',
      'PUT /boletas/9/estado',
      'DELETE /boletas/9',
    ]);
    expect(peticiones[0].cuerpo.items).toEqual([{ productoId: 1, cantidad: 2 }]);
    expect(peticiones[4].cuerpo).toEqual({ estado: 'ENVIADA' });
  });
});
