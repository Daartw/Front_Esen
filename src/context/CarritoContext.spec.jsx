import { clic, montar } from '../test/utilidades';
import { CarritoProvider, useCarrito } from './CarritoContext';

const POLERA = { id: 1, nombre: 'Polera', precio: 10000, stock: 3, imagenUrl: '', color: 'Negro' };
const HOODIE = { id: 2, nombre: 'Hoodie', precio: 25000, stock: 5, imagenUrl: '', color: 'Gris' };

/** Componente de prueba que expone el carrito con botones. */
function Prueba() {
  const { items, unidades, total, agregar, cambiarCantidad, quitar, vaciar } = useCarrito();
  return (
    <div>
      <span id="unidades">{unidades}</span>
      <span id="total">{total}</span>
      <span id="items">{items.map((i) => `${i.nombre}:${i.cantidad}`).join(',')}</span>
      <button id="agregar-polera" onClick={() => agregar(POLERA)} />
      <button id="agregar-hoodie" onClick={() => agregar(HOODIE, 2)} />
      <button id="diez-poleras" onClick={() => cambiarCantidad(1, 10)} />
      <button id="quitar-polera" onClick={() => quitar(1)} />
      <button id="vaciar" onClick={vaciar} />
    </div>
  );
}

describe('CarritoContext', () => {
  let vista;
  const $ = (id) => vista.contenedor.querySelector(`#${id}`);

  beforeEach(() => {
    localStorage.clear();
    vista = montar(
      <CarritoProvider>
        <Prueba />
      </CarritoProvider>,
    );
  });

  afterEach(() => {
    vista.desmontar();
    localStorage.clear();
  });

  it('parte vacío', () => {
    expect($('unidades').textContent).toBe('0');
    expect($('total').textContent).toBe('0');
  });

  it('agrega productos y calcula unidades y total', () => {
    clic($('agregar-polera'));
    clic($('agregar-hoodie'));
    expect($('items').textContent).toBe('Polera:1,Hoodie:2');
    expect($('unidades').textContent).toBe('3');
    expect($('total').textContent).toBe('60000');
  });

  it('suma la cantidad si el producto ya está y no supera el stock', () => {
    for (let i = 0; i < 5; i += 1) clic($('agregar-polera'));
    expect($('items').textContent).toBe('Polera:3');
  });

  it('cambiarCantidad respeta el stock disponible', () => {
    clic($('agregar-polera'));
    clic($('diez-poleras'));
    expect($('items').textContent).toBe('Polera:3');
  });

  it('quita un producto y vacía el carrito', () => {
    clic($('agregar-polera'));
    clic($('agregar-hoodie'));
    clic($('quitar-polera'));
    expect($('items').textContent).toBe('Hoodie:2');
    clic($('vaciar'));
    expect($('unidades').textContent).toBe('0');
  });

  it('guarda el carrito en localStorage para no perderlo al recargar', () => {
    clic($('agregar-polera'));
    const guardado = JSON.parse(localStorage.getItem('esen.carrito'));
    expect(guardado.length).toBe(1);
    expect(guardado[0].id).toBe(1);
  });
});
