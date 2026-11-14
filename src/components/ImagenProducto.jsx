const SIN_IMAGEN = '/sin-imagen.svg';

/** Imagen de producto con respaldo si la URL no existe o no carga. */
export default function ImagenProducto({ src, alt, className }) {
  return (
    <img
      className={className}
      src={src || SIN_IMAGEN}
      alt={alt}
      loading="lazy"
      onError={(evento) => {
        if (!evento.currentTarget.src.endsWith(SIN_IMAGEN)) evento.currentTarget.src = SIN_IMAGEN;
      }}
    />
  );
}
