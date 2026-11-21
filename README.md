# ESEN Tienda — Frontend

Tienda online de ropa básica en tonos neutros, hecha con React. Consume el API REST de
[Back_Esen](https://github.com/Daartw/Back_Esen). Proyecto académico de DSY1104 Desarrollo
Fullstack II, Evaluación Parcial 3.

> Proyecto con fines educativos. No es una tienda real ni está afiliado a ninguna marca.
> Las fotografías provienen de [Unsplash](https://unsplash.com).

## Tecnologías

React 18, Vite 5, React Router 6 y Axios. Diseño responsivo con **Bootstrap 5** (grilla, menú plegable y formularios) más una hoja de estilos propia (`src/styles/global.css`). Pruebas unitarias con **Jasmine** y **Karma**.

## Cómo ejecutarlo en local

Requisitos: Node 18 o superior y el backend corriendo en `http://localhost:8080`.

```bash
git clone https://github.com/Daartw/Front_Esen.git
cd Front_Esen
npm install
npm run dev
```

Abre http://localhost:5173. Si el backend está en otra dirección, copia `.env.example` a `.env`
y cambia `VITE_API_URL`.

### Usuarios de demostración

| Rol | Email | Contraseña | Qué ve |
|---|---|---|---|
| Administrador | admin@esen.cl | `Admin123*` | Tienda y panel completo |
| Vendedor | vendedor@esen.cl | `Vendedor123*` | Solo productos y órdenes, en modo lectura |
| Cliente | cliente@esen.cl | `Cliente123*` | Solo la tienda |

## Pruebas unitarias (Jasmine + Karma)

```bash
npm test            # ejecuta las pruebas en Chrome headless y genera la cobertura
npm run test:watch  # modo observación
```

86 pruebas en archivos `*.spec.js(x)` junto al código que prueban: validaciones, sesión, cliente HTTP con JWT,
servicios del API, carrito, componentes y páginas. La cobertura queda en `coverage/html/index.html`
(87 % de líneas). GitHub Actions las ejecuta en cada push. Detalle en
[docs/Cobertura_Testing.md](docs/Cobertura_Testing.md).

## Validación de formularios

Todos los formularios (ingreso, registro, compra, contacto y mantenedores del panel) se validan en JavaScript
antes de enviarse, con las mismas reglas del backend:

- `src/utils/validaciones.js`: una función por formulario que devuelve los errores por campo.
- `src/utils/useFormulario.js`: hook que guarda valores y errores; valida al salir de cada campo y al enviar.
- `src/components/ErrorCampo.jsx`: muestra el mensaje bajo el campo (`is-invalid` / `invalid-feedback` de Bootstrap)
  enlazado con `aria-describedby`.
- Sugerencias: `autoComplete`, `<datalist>` de comunas y colores, indicador de seguridad de la contraseña y contador de caracteres.

## Documentación

| Documento | Contenido |
|---|---|
| [ERS](docs/ERS.md) | Requerimientos funcionales y no funcionales, modelo de datos y casos de uso |
| [Manual de usuario](docs/Manual_de_Usuario.md) | Uso de la tienda y del panel por rol |
| [Cobertura del testing](docs/Cobertura_Testing.md) | Herramientas, resultados y casos de prueba |
| [Documentación de APIs](https://github.com/Daartw/Back_Esen/blob/main/docs/Documentacion_APIs.md) | Endpoints del backend |
| [APIs e Integración](https://github.com/Daartw/Back_Esen/blob/main/docs/APIs_e_Integracion.md) | Comunicación frontend ↔ backend |

## Integración con el backend

Toda la comunicación pasa por `src/api`:

| Archivo | Responsabilidad |
|---|---|
| `cliente.js` | Instancia de Axios. Un interceptor agrega `Authorization: Bearer <token>` a cada petición; otro, ante un 401, renueva el token con `/auth/refresh` y repite la petición. |
| `servicios.js` | Una función por endpoint (`productosApi.listar()`, `boletasApi.crear()`, etc.). |
| `sesion.js` | Lectura y escritura de la sesión en `localStorage`. |

Flujo de una compra: el carrito vive en el navegador → al confirmar se envía
`POST /boletas` solo con `productoId` y `cantidad` → el backend valida stock, calcula el total y
responde la boleta → el frontend la muestra y vacía el carrito.

## Gestión de sesión

- Al iniciar sesión se guardan en `localStorage` el access token, el refresh token y los datos del usuario.
- Al recargar la página, `AuthContext` recupera la sesión, renueva el token si venció y consulta
  `GET /auth/me` para confirmar el usuario y su rol con el backend.
- Mientras esa validación ocurre, las rutas protegidas muestran "Cargando…" en vez de redirigir al login.
- Si el refresh token también venció, se borra la sesión y se pide iniciar sesión otra vez.
- Cerrar sesión en una pestaña la cierra en las demás.

## Restricciones de acceso por rol

| Ruta | Visitante | Cliente | Vendedor | Administrador |
|---|:-:|:-:|:-:|:-:|
| `/`, `/producto/:id`, `/carrito` | Sí | Sí | No (va al panel) | Sí |
| `/checkout`, `/mis-compras` | Login | Sí | No | Sí |
| `/panel/productos`, `/panel/ordenes` | Login | No | Solo lectura | Sí |
| `/panel`, `/panel/categorias`, `/panel/usuarios` | Login | No | No | Sí |

Se aplican en tres niveles:

1. **Rutas**: `RutaProtegida` (en `App.jsx`) redirige al login o a la página 403 según el rol.
2. **Interfaz**: el menú del panel se arma desde `MENU_PANEL` (`utils/roles.js`) y los botones de
   crear, editar y eliminar solo se dibujan para el administrador.
3. **Backend**: aunque alguien fuerce una petición, Spring Security responde 403.

## Despliegue en Vercel

1. Importar este repositorio en Vercel (detecta Vite automáticamente).
2. Agregar la variable de entorno `VITE_API_URL` con la URL pública del backend, terminada en `/api/v1`.
3. Desplegar. `vercel.json` ya redirige todas las rutas a `index.html` para que React Router funcione al recargar.

## Estructura

```
src
├── api          Cliente Axios, servicios por endpoint y almacén de sesión
├── components   Layouts, ruta protegida, modal, tarjetas
├── context      AuthContext (sesión) y CarritoContext (carrito)
├── pages        Tienda, detalle, carrito, checkout, login, registro, nosotros
│   └── admin    Resumen, productos, órdenes, categorías, usuarios
├── styles       CSS global
├── test         Utilidades para las pruebas con Jasmine
└── utils        Validaciones, formato, roles y hooks (useDatos, useFormulario)
```
