/** Roles definidos por el backend. */
export const ROLES = {
  ADMIN: 'ADMIN',
  VENDEDOR: 'VENDEDOR',
  CLIENTE: 'CLIENTE',
};

export const NOMBRE_ROL = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente',
};

/**
 * Menu del panel interno. Cada opcion declara que roles la pueden ver:
 * el vendedor solo ve productos y ordenes; el resto ni siquiera aparece.
 */
export const MENU_PANEL = [
  { ruta: '/panel', etiqueta: 'Resumen', roles: [ROLES.ADMIN], exacta: true },
  { ruta: '/panel/productos', etiqueta: 'Productos', roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
  { ruta: '/panel/ordenes', etiqueta: 'Órdenes', roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
  { ruta: '/panel/categorias', etiqueta: 'Categorías', roles: [ROLES.ADMIN] },
  { ruta: '/panel/usuarios', etiqueta: 'Usuarios', roles: [ROLES.ADMIN] },
];

/** Pagina a la que va cada rol despues de iniciar sesion. */
export function rutaInicial(rol) {
  if (rol === ROLES.ADMIN) return '/panel';
  if (rol === ROLES.VENDEDOR) return '/panel/productos';
  return '/';
}
