import { act } from 'react';
import { montar } from '../test/utilidades';
import useDatos from './useDatos';

function Lista({ consulta }) {
  const { datos, cargando, error } = useDatos(consulta);
  if (cargando) return <p id="estado">cargando</p>;
  if (error) return <p id="estado">{error}</p>;
  return <p id="estado">{datos.join(',')}</p>;
}

/** Deja que se resuelvan las promesas pendientes dentro de act(). */
const esperar = () => act(async () => {
  await new Promise((resolver) => setTimeout(resolver, 0));
});

describe('useDatos (carga desde el API)', () => {
  let vista;
  afterEach(() => vista.desmontar());

  it('muestra "cargando" y luego los datos', async () => {
    vista = montar(<Lista consulta={() => Promise.resolve(['Hoodie', 'Polera'])} />);
    expect(vista.contenedor.textContent).toBe('cargando');
    await esperar();
    expect(vista.contenedor.textContent).toBe('Hoodie,Polera');
  });

  it('muestra un mensaje legible si la consulta falla', async () => {
    vista = montar(<Lista consulta={() => Promise.reject({ response: { data: { mensaje: 'Sin permisos' } } })} />);
    await esperar();
    expect(vista.contenedor.textContent).toBe('Sin permisos');
  });
});
