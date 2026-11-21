import { clic, escribir, montar, salirDe } from '../../test/utilidades';
import { FormularioCategoria } from './Categorias';

describe('<FormularioCategoria /> (validación en JS)', () => {
  let vista;
  let alGuardar;
  const $ = (selector) => vista.contenedor.querySelector(selector);

  beforeEach(() => {
    alGuardar = jasmine.createSpy('alGuardar');
    vista = montar(
      <FormularioCategoria
        inicial={{ nombre: '', descripcion: '' }}
        error=""
        guardando={false}
        alGuardar={alGuardar}
        alCancelar={() => {}}
      />,
    );
  });

  afterEach(() => vista.desmontar());

  it('no envía y muestra el error junto al campo si el nombre está vacío', () => {
    clic($('button[type="submit"]'));
    expect(alGuardar).not.toHaveBeenCalled();
    expect($('#error-nombre').textContent).toBe('El nombre es obligatorio.');
    expect($('#campo-nombre').classList).toContain('is-invalid');
    expect($('#campo-nombre').getAttribute('aria-invalid')).toBe('true');
  });

  it('muestra el error al salir del campo, antes de enviar', () => {
    escribir($('#campo-nombre'), 'Po');
    expect($('#error-nombre')).toBeNull();
    salirDe($('#campo-nombre'));
    expect($('#error-nombre').textContent).toContain('al menos 3');
  });

  it('quita el error cuando el usuario corrige el valor', () => {
    clic($('button[type="submit"]'));
    escribir($('#campo-nombre'), 'Poleras');
    expect($('#error-nombre')).toBeNull();
    expect($('#campo-nombre').classList).not.toContain('is-invalid');
  });

  it('cuenta los caracteres de la descripción', () => {
    escribir($('#campo-descripcion'), 'Algodón');
    expect(vista.contenedor.textContent).toContain('7/255');
  });

  it('envía los valores cuando el formulario es válido', () => {
    escribir($('#campo-nombre'), 'Poleras');
    escribir($('#campo-descripcion'), 'Manga corta');
    clic($('button[type="submit"]'));
    expect(alGuardar).toHaveBeenCalledOnceWith({ nombre: 'Poleras', descripcion: 'Manga corta' });
  });
});
