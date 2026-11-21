import { act } from 'react';
import { createRoot } from 'react-dom/client';

// Le indica a React que las pruebas envuelven los cambios en act().
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** Monta un componente en el DOM real del navegador de Karma. */
export function montar(elemento) {
  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);
  act(() => raiz.render(elemento));
  return {
    contenedor,
    desmontar() {
      act(() => raiz.unmount());
      contenedor.remove();
    },
  };
}

/** Escribe en un input/textarea/select controlado por React y dispara el evento que React escucha. */
export function escribir(campo, valor) {
  const prototipo = Object.getPrototypeOf(campo);
  const setter = Object.getOwnPropertyDescriptor(prototipo, 'value').set;
  act(() => {
    setter.call(campo, valor);
    campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  });
}

/** Hace clic dentro de act() para que React procese el cambio de estado. */
export function clic(elemento) {
  act(() => elemento.click());
}

/** Quita el foco de un campo (dispara la validacion "al salir del campo"). */
export function salirDe(campo) {
  act(() => {
    campo.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  });
}
