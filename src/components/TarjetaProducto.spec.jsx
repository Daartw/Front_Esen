import { MemoryRouter } from 'react-router-dom';
import { montar } from '../test/utilidades';
import TarjetaProducto from './TarjetaProducto';

const PRODUCTO = {
  id: 7,
  nombre: 'Hoodie Arena',
  precio: 29990,
  stock: 10,
  categoriaNombre: 'Hoodies',
  imagenUrl: '',
};

function dibujar(producto) {
  return montar(
    <MemoryRouter>
      <TarjetaProducto producto={producto} />
    </MemoryRouter>,
  );
}

describe('<TarjetaProducto />', () => {
  let vista;
  afterEach(() => vista.desmontar());

  it('muestra nombre, categoría, precio y enlace al detalle', () => {
    vista = dibujar(PRODUCTO);
    const enlace = vista.contenedor.querySelector('a');
    expect(enlace.getAttribute('href')).toBe('/producto/7');
    expect(vista.contenedor.querySelector('h3').textContent).toBe('Hoodie Arena');
    expect(vista.contenedor.textContent).toContain('Hoodies');
    expect(vista.contenedor.textContent.replace(/\s/g, '')).toContain('29.990');
  });

  it('usa la imagen de respaldo cuando no hay URL', () => {
    vista = dibujar(PRODUCTO);
    expect(vista.contenedor.querySelector('img').getAttribute('src')).toBe('/sin-imagen.svg');
  });

  it('marca el producto agotado cuando el stock es 0', () => {
    vista = dibujar({ ...PRODUCTO, stock: 0 });
    expect(vista.contenedor.textContent).toContain('Agotado');
  });

  it('avisa las últimas unidades con stock bajo', () => {
    vista = dibujar({ ...PRODUCTO, stock: 2 });
    expect(vista.contenedor.textContent).toContain('Últimas unidades');
    expect(vista.contenedor.textContent).not.toContain('Agotado');
  });
});
