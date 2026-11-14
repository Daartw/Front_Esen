# ESEN Tienda — Frontend

Tienda online de ropa básica en tonos neutros, hecha con React. Consume el API REST de
[Back_Esen](https://github.com/Daartw/Back_Esen). Proyecto académico de DSY1104 Desarrollo
Fullstack II, Evaluación Parcial 3.

> Proyecto con fines educativos. No es una tienda real ni está afiliado a ninguna marca.
> Las fotografías provienen de [Unsplash](https://unsplash.com).

## Tecnologías

React 18, Vite 5, React Router 6 y Axios. Estilos con CSS propio, sin librerías de componentes.

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
├── pages        Tienda, detalle, carrito, checkout, login, registro
│   └── admin    Resumen, productos, órdenes, categorías, usuarios
├── styles       CSS global
└── utils        Formato, roles y hook de carga de datos
```
