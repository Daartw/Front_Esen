import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CarritoContext = createContext(null);
const CLAVE = 'esen.carrito';

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    return [];
  }
}

/**
 * Carrito de compras. Vive en el navegador hasta que se confirma la compra;
 * en ese momento se envia al backend, que valida stock y calcula el total.
 */
export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items));
  }, [items]);

  const valor = useMemo(() => {
    const agregar = (producto, cantidad = 1) =>
      setItems((actuales) => {
        const existente = actuales.find((i) => i.id === producto.id);
        const nuevaCantidad = Math.min((existente?.cantidad ?? 0) + cantidad, producto.stock);
        const item = {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagenUrl: producto.imagenUrl,
          color: producto.color,
          stock: producto.stock,
          cantidad: nuevaCantidad,
        };
        return existente ? actuales.map((i) => (i.id === producto.id ? item : i)) : [...actuales, item];
      });

    const cambiarCantidad = (id, cantidad) =>
      setItems((actuales) =>
        actuales.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) } : i)),
      );

    const quitar = (id) => setItems((actuales) => actuales.filter((i) => i.id !== id));
    const vaciar = () => setItems([]);

    return {
      items,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      unidades: items.reduce((suma, i) => suma + i.cantidad, 0),
      total: items.reduce((suma, i) => suma + i.precio * i.cantidad, 0),
    };
  }, [items]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return contexto;
}
