import { act } from 'react';
import { clic, montar } from '../test/utilidades';
import Cargando from './Cargando';
import Modal from './Modal';

describe('<Modal />', () => {
  let vista;
  let alCerrar;

  beforeEach(() => {
    alCerrar = jasmine.createSpy('alCerrar');
    vista = montar(
      <Modal titulo="Editar producto" alCerrar={alCerrar}>
        <p id="contenido">Formulario</p>
      </Modal>,
    );
  });

  afterEach(() => vista.desmontar());

  it('muestra el título y el contenido como diálogo accesible', () => {
    const dialogo = vista.contenedor.querySelector('[role="dialog"]');
    expect(dialogo.getAttribute('aria-modal')).toBe('true');
    expect(dialogo.querySelector('h2').textContent).toBe('Editar producto');
    expect(vista.contenedor.querySelector('#contenido')).not.toBeNull();
  });

  it('se cierra con el botón ×', () => {
    clic(vista.contenedor.querySelector('button[aria-label="Cerrar"]'));
    expect(alCerrar).toHaveBeenCalled();
  });

  it('se cierra con la tecla Escape', () => {
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(alCerrar).toHaveBeenCalled();
  });

  it('se cierra al hacer clic en el fondo, pero no dentro del diálogo', () => {
    const dentro = vista.contenedor.querySelector('.dialogo');
    act(() => dentro.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(alCerrar).not.toHaveBeenCalled();
    const fondo = vista.contenedor.querySelector('.dialogo__fondo');
    act(() => fondo.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(alCerrar).toHaveBeenCalledTimes(1);
  });
});

describe('<Cargando />', () => {
  it('muestra el texto con role="status" y la variante de pantalla completa', () => {
    const vista = montar(<Cargando pantallaCompleta texto="Validando sesión…" />);
    const estado = vista.contenedor.querySelector('[role="status"]');
    expect(estado.textContent).toContain('Validando sesión…');
    expect(estado.classList).toContain('cargando--pantalla');
    vista.desmontar();
  });
});
