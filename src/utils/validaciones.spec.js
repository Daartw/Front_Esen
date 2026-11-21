import {
  fuerzaPassword,
  validarCategoria,
  validarCheckout,
  validarContacto,
  validarEmail,
  validarLogin,
  validarNombre,
  validarPassword,
  validarProducto,
  validarRegistro,
  validarTexto,
  validarUsuario,
} from './validaciones';

describe('validaciones de formularios', () => {
  describe('validarTexto', () => {
    it('exige el campo cuando es obligatorio', () => {
      expect(validarTexto('   ', { etiqueta: 'El nombre' })).toBe('El nombre es obligatorio.');
    });

    it('acepta vacío cuando el campo es opcional', () => {
      expect(validarTexto('', { etiqueta: 'La dirección', obligatorio: false })).toBeNull();
    });

    it('controla el largo mínimo y máximo', () => {
      expect(validarTexto('ab', { etiqueta: 'El nombre', min: 3 })).toContain('al menos 3');
      expect(validarTexto('abcdef', { etiqueta: 'El nombre', max: 5 })).toContain('hasta 5');
      expect(validarTexto('abcd', { etiqueta: 'El nombre', min: 3, max: 5 })).toBeNull();
    });
  });

  describe('validarNombre', () => {
    it('acepta nombres con tildes y espacios', () => {
      expect(validarNombre('José Ñúñez')).toBeNull();
    });

    it('rechaza números y símbolos', () => {
      expect(validarNombre('Ana123')).toContain('solo puede contener letras');
    });

    it('rechaza nombres de una letra', () => {
      expect(validarNombre('A')).toContain('al menos 2');
    });
  });

  describe('validarEmail', () => {
    it('acepta un email válido', () => {
      expect(validarEmail('cliente@esen.cl')).toBeNull();
    });

    it('rechaza emails mal formados', () => {
      expect(validarEmail('cliente@esen')).toContain('email válido');
      expect(validarEmail('cliente esen.cl')).toContain('email válido');
    });

    it('exige el email', () => {
      expect(validarEmail('')).toBe('El email es obligatorio.');
    });
  });

  describe('validarPassword', () => {
    it('exige al menos 8 caracteres', () => {
      expect(validarPassword('abc1')).toContain('al menos 8');
    });

    it('exige letras y números', () => {
      expect(validarPassword('solamenteletras')).toContain('letras y números');
      expect(validarPassword('12345678')).toContain('letras y números');
    });

    it('acepta una contraseña segura', () => {
      expect(validarPassword('Cliente123*')).toBeNull();
    });

    it('permite omitirla cuando es opcional (edición de usuario)', () => {
      expect(validarPassword('', { obligatoria: false })).toBeNull();
    });
  });

  it('fuerzaPassword sube con largo, mayúsculas, números y símbolos', () => {
    expect(fuerzaPassword('')).toBe(0);
    expect(fuerzaPassword('abcdefgh')).toBe(1);
    expect(fuerzaPassword('Abcdefg1')).toBe(3);
    expect(fuerzaPassword('Abcdefg1*')).toBe(4);
  });

  it('validarLogin informa cada campo vacío', () => {
    expect(validarLogin({ email: '', password: '' })).toEqual({
      email: 'El email es obligatorio.',
      password: 'Ingresa tu contraseña.',
    });
    expect(validarLogin({ email: 'admin@esen.cl', password: 'x' })).toEqual({});
  });

  describe('validarRegistro', () => {
    const valido = {
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@correo.cl',
      direccion: '',
      password: 'Clave1234',
      repetir: 'Clave1234',
    };

    it('no devuelve errores con datos correctos', () => {
      expect(validarRegistro(valido)).toEqual({});
    });

    it('detecta contraseñas que no coinciden', () => {
      expect(validarRegistro({ ...valido, repetir: 'Otra1234' }).repetir).toBe('Las contraseñas no coinciden.');
    });

    it('marca todos los campos obligatorios vacíos', () => {
      const errores = validarRegistro({ nombre: '', apellido: '', email: '', direccion: '', password: '', repetir: '' });
      expect(Object.keys(errores)).toEqual(['nombre', 'apellido', 'email', 'password', 'repetir']);
    });
  });

  it('validarCheckout exige una dirección de al menos 5 caracteres', () => {
    expect(validarCheckout({ direccion: '' }).direccion).toContain('obligatorio');
    expect(validarCheckout({ direccion: 'Av' }).direccion).toContain('al menos 5');
    expect(validarCheckout({ direccion: 'Av. Siempre Viva 742, Santiago' })).toEqual({});
  });

  it('validarCategoria controla nombre y descripción', () => {
    expect(validarCategoria({ nombre: 'Po', descripcion: '' }).nombre).toContain('al menos 3');
    expect(validarCategoria({ nombre: 'Poleras', descripcion: 'x'.repeat(256) }).descripcion).toContain('255');
    expect(validarCategoria({ nombre: 'Poleras', descripcion: '' })).toEqual({});
  });

  describe('validarProducto', () => {
    const valido = {
      nombre: 'Hoodie Arena',
      descripcion: '',
      precio: '29990',
      stock: '10',
      categoriaId: '1',
      color: 'Arena',
      imagenUrl: 'https://images.unsplash.com/foto.jpg',
    };

    it('acepta un producto correcto', () => {
      expect(validarProducto(valido)).toEqual({});
    });

    it('rechaza precio cero, decimal o vacío', () => {
      expect(validarProducto({ ...valido, precio: '0' }).precio).toContain('mayor a 0');
      expect(validarProducto({ ...valido, precio: '10.5' }).precio).toContain('entero');
      expect(validarProducto({ ...valido, precio: '' }).precio).toBe('El precio es obligatorio.');
    });

    it('rechaza stock negativo', () => {
      expect(validarProducto({ ...valido, stock: '-1' }).stock).toContain('igual o mayor a 0');
    });

    it('exige categoría y una URL http(s)', () => {
      const errores = validarProducto({ ...valido, categoriaId: '', imagenUrl: 'ftp://imagen' });
      expect(errores.categoriaId).toBe('Selecciona una categoría.');
      expect(errores.imagenUrl).toContain('http');
    });
  });

  describe('validarUsuario', () => {
    const base = { nombre: 'Ana', apellido: 'Rojas', email: 'ana@esen.cl', password: 'Clave1234', rol: 'CLIENTE', direccion: '' };

    it('exige contraseña al crear', () => {
      expect(validarUsuario({ ...base, password: '' }).password).toBe('La contraseña es obligatoria.');
    });

    it('permite dejarla vacía al editar', () => {
      expect(validarUsuario({ ...base, id: 3, password: '' })).toEqual({});
    });
  });

  it('validarContacto exige motivo y un mensaje de al menos 10 caracteres', () => {
    const errores = validarContacto({ nombre: 'Ana', email: 'ana@esen.cl', motivo: '', mensaje: 'Hola' });
    expect(errores.motivo).toContain('motivo');
    expect(errores.mensaje).toContain('al menos 10');
  });
});
