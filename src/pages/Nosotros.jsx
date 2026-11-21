import { useState } from 'react';
import { Link } from 'react-router-dom';
import Aviso from '../components/Aviso';
import ErrorCampo from '../components/ErrorCampo';
import useFormulario from '../utils/useFormulario';
import { MOTIVOS_CONTACTO, validarContacto } from '../utils/validaciones';

// Video de muestra con licencia libre (CC0) alojado por MDN; la portada es de Unsplash.
const VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const PORTADA_VIDEO =
  'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=1200&q=70';

const VALORES = [
  { titulo: 'Algodón pesado', texto: 'Telas de 300 g/m² o más que mantienen su forma lavado tras lavado.' },
  { titulo: 'Tonos neutros', texto: 'Una paleta corta que combina entre sí para armar el clóset con pocas prendas.' },
  { titulo: 'Hecho para durar', texto: 'Menos colecciones y más básicos permanentes, sin temporadas.' },
];

const CONTACTO_VACIO = { nombre: '', email: '', motivo: '', mensaje: '' };

export default function Nosotros() {
  const { valores, errores, validarTodo, reiniciar, propsCampo } = useFormulario(CONTACTO_VACIO, validarContacto);
  const [enviado, setEnviado] = useState(false);

  const enviar = (evento) => {
    evento.preventDefault();
    setEnviado(false);
    if (!validarTodo()) return;
    // Sitio de demostracion: el mensaje no se envia a un servidor, solo se confirma en pantalla.
    setEnviado(true);
    reiniciar();
  };

  return (
    <section className="seccion nosotros">
      <article>
        <p className="sobretitulo">Nosotros</p>
        <h1>Básicos esenciales, sin temporadas.</h1>
        <p className="detalle__descripcion">
          ESEN nace de una idea simple: pocas prendas, bien hechas, en colores que siempre combinan. Revisa el{' '}
          <Link to="/">catálogo completo</Link> o escríbenos más abajo.
        </p>
      </article>

      <figure className="m-0">
        <video className="nosotros__video" controls muted playsInline preload="metadata" poster={PORTADA_VIDEO}>
          <source src={VIDEO} type="video/mp4" />
          Tu navegador no puede reproducir este video.
        </video>
        <figcaption className="sugerencia mt-2">Video de muestra (licencia CC0).</figcaption>
      </figure>

      <section aria-labelledby="titulo-valores">
        <h2 id="titulo-valores">Lo que nos importa</h2>
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {VALORES.map((valor) => (
            <div className="col" key={valor.titulo}>
              <article className="valor">
                <h3>{valor.titulo}</h3>
                <p>{valor.texto}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-contacto" className="seccion--angosta w-100">
        <h2 id="titulo-contacto">Contacto</h2>
        <form className="formulario" onSubmit={enviar} noValidate aria-label="Formulario de contacto">
          <div className="row g-3">
            <label className="col-12 col-md-6" htmlFor="campo-nombre">
              Nombre
              <input {...propsCampo('nombre')} autoComplete="name" maxLength={60} />
              <ErrorCampo nombre="nombre" mensaje={errores.nombre} />
            </label>
            <label className="col-12 col-md-6" htmlFor="campo-email">
              Email
              <input {...propsCampo('email')} type="email" autoComplete="email" placeholder="nombre@correo.cl" />
              <ErrorCampo nombre="email" mensaje={errores.email} />
            </label>
          </div>
          <label htmlFor="campo-motivo">
            Motivo
            <select {...propsCampo('motivo', { tipo: 'form-select' })}>
              <option value="">Selecciona…</option>
              {MOTIVOS_CONTACTO.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
            <ErrorCampo nombre="motivo" mensaje={errores.motivo} />
          </label>
          <label htmlFor="campo-mensaje">
            Mensaje
            <textarea {...propsCampo('mensaje')} rows={4} maxLength={500} />
            <small className="form-text sugerencia">{valores.mensaje.length}/500 caracteres</small>
            <ErrorCampo nombre="mensaje" mensaje={errores.mensaje} />
          </label>
          {enviado && <Aviso tipo="exito">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</Aviso>}
          <button type="submit" className="boton">
            Enviar mensaje
          </button>
        </form>
      </section>
    </section>
  );
}
