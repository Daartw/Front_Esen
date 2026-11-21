import { MemoryRouter } from 'react-router-dom';
import { clic, escribir, montar } from '../test/utilidades';
import Nosotros from './Nosotros';

describe('<Nosotros /> página con video y formulario de contacto', () => {
  let vista;
  const $ = (selector) => vista.contenedor.querySelector(selector);

  beforeEach(() => {
    vista = montar(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>,
    );
  });

  afterEach(() => vista.desmontar());

  it('incluye un video embebido con controles', () => {
    const video = $('video');
    expect(video).not.toBeNull();
    expect(video.hasAttribute('controls')).toBeTrue();
    expect($('video source').getAttribute('type')).toBe('video/mp4');
  });

  it('usa etiquetas semánticas de HTML5', () => {
    expect($('article')).not.toBeNull();
    expect($('figure figcaption')).not.toBeNull();
    expect(vista.contenedor.querySelectorAll('section').length).toBeGreaterThan(1);
  });

  it('enlaza al catálogo', () => {
    expect($('a[href="/"]')).not.toBeNull();
  });

  it('valida todos los campos al enviar vacío', () => {
    clic($('button[type="submit"]'));
    expect($('#error-nombre')).not.toBeNull();
    expect($('#error-email')).not.toBeNull();
    expect($('#error-motivo').textContent).toContain('motivo');
    expect($('#error-mensaje')).not.toBeNull();
    expect(vista.contenedor.textContent).not.toContain('Gracias');
  });

  it('confirma el envío y limpia el formulario cuando los datos son válidos', () => {
    escribir($('#campo-nombre'), 'Ana Pérez');
    escribir($('#campo-email'), 'ana@correo.cl');
    escribir($('#campo-motivo'), 'Estado de mi compra');
    escribir($('#campo-mensaje'), 'Quiero saber cuándo llega mi pedido.');
    clic($('button[type="submit"]'));
    expect(vista.contenedor.textContent).toContain('Gracias');
    expect($('#campo-nombre').value).toBe('');
    expect(vista.contenedor.querySelectorAll('.invalid-feedback').length).toBe(0);
  });
});
