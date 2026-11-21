import { montar } from '../test/utilidades';
import Aviso from './Aviso';
import ErrorCampo from './ErrorCampo';

describe('<Aviso />', () => {
  let vista;
  afterEach(() => vista.desmontar());

  it('no dibuja nada si no hay mensaje', () => {
    vista = montar(<Aviso>{''}</Aviso>);
    expect(vista.contenedor.innerHTML).toBe('');
  });

  it('muestra un error con role="alert" por defecto', () => {
    vista = montar(<Aviso>Algo falló</Aviso>);
    const parrafo = vista.contenedor.querySelector('p');
    expect(parrafo.textContent).toBe('Algo falló');
    expect(parrafo.getAttribute('role')).toBe('alert');
    expect(parrafo.classList).toContain('aviso--error');
  });

  it('muestra un mensaje de éxito con role="status"', () => {
    vista = montar(<Aviso tipo="exito">Listo</Aviso>);
    const parrafo = vista.contenedor.querySelector('p');
    expect(parrafo.getAttribute('role')).toBe('status');
    expect(parrafo.classList).toContain('aviso--exito');
  });
});

describe('<ErrorCampo />', () => {
  let vista;
  afterEach(() => vista.desmontar());

  it('no dibuja nada sin mensaje', () => {
    vista = montar(<ErrorCampo nombre="email" mensaje={null} />);
    expect(vista.contenedor.innerHTML).toBe('');
  });

  it('muestra el mensaje con el id que referencia aria-describedby', () => {
    vista = montar(<ErrorCampo nombre="email" mensaje="Email inválido" />);
    const error = vista.contenedor.querySelector('#error-email');
    expect(error.textContent).toBe('Email inválido');
    expect(error.classList).toContain('invalid-feedback');
  });
});
