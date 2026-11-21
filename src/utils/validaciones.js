/**
 * Validaciones de formularios en JavaScript.
 * Cada funcion recibe los valores del formulario y devuelve un objeto { campo: 'mensaje' }
 * solo con los campos que tienen error. Un objeto vacio significa que el formulario es valido.
 * Las reglas son las mismas que valida el backend (Bean Validation), para que el usuario
 * vea el problema antes de enviar y en el campo exacto donde ocurre.
 */

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
export const REGEX_URL = /^https?:\/\/\S+$/i;

const texto = (valor) => String(valor ?? '').trim();

/** Regla generica de texto obligatorio con largo maximo. */
export function validarTexto(valor, { etiqueta, obligatorio = true, min = 0, max }) {
  const limpio = texto(valor);
  if (!limpio) return obligatorio ? `${etiqueta} es obligatorio.` : null;
  if (limpio.length < min) return `${etiqueta} debe tener al menos ${min} caracteres.`;
  if (max && limpio.length > max) return `${etiqueta} admite hasta ${max} caracteres.`;
  return null;
}

export function validarNombre(valor, etiqueta = 'El nombre') {
  const error = validarTexto(valor, { etiqueta, min: 2, max: 60 });
  if (error) return error;
  if (!REGEX_NOMBRE.test(texto(valor))) return `${etiqueta} solo puede contener letras y espacios.`;
  return null;
}

export function validarEmail(valor) {
  const limpio = texto(valor);
  if (!limpio) return 'El email es obligatorio.';
  if (limpio.length > 120) return 'El email admite hasta 120 caracteres.';
  if (!REGEX_EMAIL.test(limpio)) return 'Ingresa un email válido, por ejemplo nombre@correo.cl.';
  return null;
}

/** Contraseña segura: 8 a 72 caracteres, con al menos una letra y un número. */
export function validarPassword(valor, { obligatoria = true } = {}) {
  const clave = String(valor ?? '');
  if (!clave) return obligatoria ? 'La contraseña es obligatoria.' : null;
  if (clave.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (clave.length > 72) return 'La contraseña admite hasta 72 caracteres.';
  if (!/[A-Za-z]/.test(clave) || !/\d/.test(clave)) return 'La contraseña debe combinar letras y números.';
  return null;
}

/** Nivel de seguridad de la contraseña (0 a 4) para la sugerencia bajo el campo. */
export function fuerzaPassword(valor) {
  const clave = String(valor ?? '');
  let puntos = 0;
  if (clave.length >= 8) puntos += 1;
  if (/[a-z]/.test(clave) && /[A-Z]/.test(clave)) puntos += 1;
  if (/\d/.test(clave)) puntos += 1;
  if (/[^A-Za-z0-9]/.test(clave)) puntos += 1;
  return puntos;
}

export const NIVELES_PASSWORD = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Segura'];

function soloErrores(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
}

export function validarLogin({ email, password }) {
  return soloErrores({
    email: validarEmail(email),
    password: password ? null : 'Ingresa tu contraseña.',
  });
}

export function validarRegistro(datos) {
  return soloErrores({
    nombre: validarNombre(datos.nombre),
    apellido: validarNombre(datos.apellido, 'El apellido'),
    email: validarEmail(datos.email),
    direccion: validarTexto(datos.direccion, { etiqueta: 'La dirección', obligatorio: false, max: 200 }),
    password: validarPassword(datos.password),
    repetir: !datos.repetir
      ? 'Repite la contraseña.'
      : datos.repetir !== datos.password
        ? 'Las contraseñas no coinciden.'
        : null,
  });
}

export function validarCheckout({ direccion }) {
  return soloErrores({
    direccion: validarTexto(direccion, { etiqueta: 'La dirección de envío', min: 5, max: 200 }),
  });
}

export function validarCategoria({ nombre, descripcion }) {
  return soloErrores({
    nombre: validarTexto(nombre, { etiqueta: 'El nombre', min: 3, max: 60 }),
    descripcion: validarTexto(descripcion, { etiqueta: 'La descripción', obligatorio: false, max: 255 }),
  });
}

export function validarProducto(datos) {
  const precio = Number(datos.precio);
  const stock = Number(datos.stock);
  const url = texto(datos.imagenUrl);
  return soloErrores({
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', min: 3, max: 120 }),
    descripcion: validarTexto(datos.descripcion, { etiqueta: 'La descripción', obligatorio: false, max: 1000 }),
    precio:
      datos.precio === '' || datos.precio === null || datos.precio === undefined
        ? 'El precio es obligatorio.'
        : !Number.isInteger(precio) || precio < 1
          ? 'El precio debe ser un número entero mayor a 0.'
          : null,
    stock:
      datos.stock === '' || datos.stock === null || datos.stock === undefined
        ? 'El stock es obligatorio.'
        : !Number.isInteger(stock) || stock < 0
          ? 'El stock debe ser un número entero igual o mayor a 0.'
          : null,
    categoriaId: datos.categoriaId ? null : 'Selecciona una categoría.',
    color: validarTexto(datos.color, { etiqueta: 'El color', obligatorio: false, max: 40 }),
    imagenUrl: !url
      ? null
      : url.length > 500
        ? 'La URL admite hasta 500 caracteres.'
        : REGEX_URL.test(url)
          ? null
          : 'La URL debe comenzar con http:// o https://.',
  });
}

export function validarUsuario(datos) {
  return soloErrores({
    nombre: validarNombre(datos.nombre),
    apellido: validarNombre(datos.apellido, 'El apellido'),
    email: validarEmail(datos.email),
    password: validarPassword(datos.password, { obligatoria: !datos.id }),
    rol: datos.rol ? null : 'Selecciona un rol.',
    direccion: validarTexto(datos.direccion, { etiqueta: 'La dirección', obligatorio: false, max: 200 }),
  });
}

/** Comunas sugeridas en los campos de direccion (autocompletado con <datalist>). */
export const COMUNAS_SUGERIDAS = [
  'Santiago',
  'Providencia',
  'Las Condes',
  'Ñuñoa',
  'La Florida',
  'Maipú',
  'Puente Alto',
  'San Miguel',
  'Viña del Mar',
  'Valparaíso',
  'Concepción',
  'La Serena',
  'Temuco',
  'Antofagasta',
];

export const MOTIVOS_CONTACTO = ['Consulta sobre un producto', 'Estado de mi compra', 'Cambios y devoluciones', 'Otro'];

export function validarContacto({ nombre, email, motivo, mensaje }) {
  return soloErrores({
    nombre: validarNombre(nombre),
    email: validarEmail(email),
    motivo: motivo ? null : 'Selecciona el motivo de tu mensaje.',
    mensaje: validarTexto(mensaje, { etiqueta: 'El mensaje', min: 10, max: 500 }),
  });
}
