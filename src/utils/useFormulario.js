import { useState } from 'react';

/**
 * Estado y validacion de un formulario controlado.
 * - valores: lo que el usuario escribio.
 * - errores: mensajes por campo, calculados con la funcion `validar`.
 * Los errores aparecen al salir del campo (blur) o al intentar enviar, y se
 * actualizan mientras el usuario corrige, para no mostrar rojo antes de tiempo.
 */
export default function useFormulario(inicial, validar) {
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  const actualizar = (nuevos, nuevosTocados = tocados) => {
    setValores(nuevos);
    const todos = validar(nuevos);
    setErrores(Object.fromEntries(Object.entries(todos).filter(([campo]) => nuevosTocados[campo])));
  };

  const cambiar = (evento) => {
    const { name, value, type, checked } = evento.target;
    actualizar({ ...valores, [name]: type === 'checkbox' ? checked : value });
  };

  const fijar = (campo, valor) => actualizar({ ...valores, [campo]: valor });

  const salir = (evento) => {
    const nuevosTocados = { ...tocados, [evento.target.name]: true };
    setTocados(nuevosTocados);
    actualizar(valores, nuevosTocados);
  };

  /** Valida todo el formulario; devuelve true si se puede enviar. */
  const validarTodo = () => {
    const todos = validar(valores);
    setTocados(Object.fromEntries(Object.keys(valores).map((campo) => [campo, true])));
    setErrores(todos);
    return Object.keys(todos).length === 0;
  };

  const reiniciar = (nuevos = inicial) => {
    setValores(nuevos);
    setErrores({});
    setTocados({});
  };

  /** Props comunes para un input: nombre, valor, eventos y atributos de accesibilidad. */
  const propsCampo = (nombre, { tipo = 'form-control' } = {}) => ({
    name: nombre,
    id: `campo-${nombre}`,
    value: valores[nombre] ?? '',
    onChange: cambiar,
    onBlur: salir,
    className: `campo ${tipo}${errores[nombre] ? ' is-invalid' : ''}`,
    'aria-invalid': Boolean(errores[nombre]),
    'aria-describedby': errores[nombre] ? `error-${nombre}` : undefined,
  });

  return { valores, errores, cambiar, fijar, salir, validarTodo, reiniciar, propsCampo };
}
