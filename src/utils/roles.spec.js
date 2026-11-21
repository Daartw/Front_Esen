import { MENU_PANEL, ROLES, rutaInicial } from './roles';

describe('roles', () => {
  it('cada rol inicia sesión en su página', () => {
    expect(rutaInicial(ROLES.ADMIN)).toBe('/panel');
    expect(rutaInicial(ROLES.VENDEDOR)).toBe('/panel/productos');
    expect(rutaInicial(ROLES.CLIENTE)).toBe('/');
  });

  it('el vendedor solo ve productos y órdenes en el menú del panel', () => {
    const rutas = MENU_PANEL.filter((opcion) => opcion.roles.includes(ROLES.VENDEDOR)).map((opcion) => opcion.ruta);
    expect(rutas).toEqual(['/panel/productos', '/panel/ordenes']);
  });

  it('el administrador ve todas las opciones', () => {
    expect(MENU_PANEL.every((opcion) => opcion.roles.includes(ROLES.ADMIN))).toBeTrue();
  });

  it('el cliente no ve ninguna opción del panel', () => {
    expect(MENU_PANEL.some((opcion) => opcion.roles.includes(ROLES.CLIENTE))).toBeFalse();
  });
});
