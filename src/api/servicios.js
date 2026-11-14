import api from './cliente';

/** Cada funcion corresponde a un endpoint del backend (ver Swagger). */

export const authApi = {
  login: (datos) => api.post('/auth/login', datos).then((r) => r.data),
  registro: (datos) => api.post('/auth/registro', datos).then((r) => r.data),
  perfil: () => api.get('/auth/me').then((r) => r.data),
};

export const productosApi = {
  listar: (filtros = {}) => api.get('/productos', { params: filtros }).then((r) => r.data),
  obtener: (id) => api.get(`/productos/${id}`).then((r) => r.data),
  crear: (datos) => api.post('/productos', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/productos/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/productos/${id}`),
};

export const categoriasApi = {
  listar: () => api.get('/categorias').then((r) => r.data),
  crear: (datos) => api.post('/categorias', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/categorias/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/categorias/${id}`),
};

export const usuariosApi = {
  listar: () => api.get('/usuarios').then((r) => r.data),
  crear: (datos) => api.post('/usuarios', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/usuarios/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

export const boletasApi = {
  crear: (datos) => api.post('/boletas', datos).then((r) => r.data),
  mias: () => api.get('/boletas/mias').then((r) => r.data),
  listar: () => api.get('/boletas').then((r) => r.data),
  obtener: (id) => api.get(`/boletas/${id}`).then((r) => r.data),
  cambiarEstado: (id, estado) => api.put(`/boletas/${id}/estado`, { estado }).then((r) => r.data),
  eliminar: (id) => api.delete(`/boletas/${id}`),
};
