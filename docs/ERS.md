# Especificación de Requerimientos de Software (ERS) — ESEN Tienda

| | |
|---|---|
| Proyecto | ESEN Tienda — tienda online de ropa básica |
| Asignatura | DSY1104 Desarrollo Fullstack II |
| Repositorios | [Front_Esen](https://github.com/Daartw/Front_Esen) · [Back_Esen](https://github.com/Daartw/Back_Esen) |
| Versión | 2.0 (Evaluación Final Transversal) |

## 1. Introducción

### 1.1 Propósito
Definir los requerimientos funcionales y no funcionales de ESEN, una tienda online de prendas básicas en tonos neutros, para guiar su desarrollo, pruebas y evaluación.

### 1.2 Alcance
ESEN permite a los clientes revisar el catálogo, armar un carrito y comprar (pago simulado). El personal interno administra productos, categorías, usuarios y órdenes desde un panel. El sistema se compone de:

- **Frontend**: aplicación web en React 18 + Vite, con Bootstrap 5 para el diseño responsivo.
- **Backend**: API REST en Spring Boot 3.3 (Java 17) con MySQL, Spring Security y JWT.

Fuera de alcance: pagos reales, despacho real, facturación electrónica.

### 1.3 Definiciones

| Término | Significado |
|---|---|
| Boleta | Registro de una compra con su detalle, neto, IVA y total. |
| JWT | JSON Web Token; credencial firmada que identifica al usuario en cada petición. |
| Access token / refresh token | Token de corta duración (30 min) / token para renovarlo (7 días). |
| CRUD | Crear, leer, actualizar y eliminar registros. |
| Panel | Sección interna para administrador y vendedor. |

## 2. Descripción general

### 2.1 Perspectiva del producto
Aplicación de una sola página (SPA) que consume un API REST versionado (`/api/v1`). Ambos repositorios se despliegan por separado (frontend en Vercel; backend con Docker en Render o Railway).

### 2.2 Usuarios

| Rol | Descripción | Puede |
|---|---|---|
| Visitante | Sin sesión | Ver catálogo, detalle, carrito, Nosotros y contacto; registrarse |
| Cliente | Comprador registrado | Lo anterior + comprar y ver sus compras |
| Vendedor | Personal de tienda | Panel: productos y órdenes en solo lectura |
| Administrador | Dueño / encargado | Todo: tienda y panel completo (CRUD) |

### 2.3 Restricciones
- Frontend en React con componentes funcionales y hooks; estilos con Bootstrap 5 y CSS propio.
- Backend en Spring Boot con JPA y base de datos MySQL.
- Comunicación únicamente por REST/JSON; autenticación por JWT.
- Pruebas unitarias del frontend con Jasmine y Karma; del backend con JUnit 5 y Mockito.

## 3. Requerimientos funcionales

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-01 | Listar productos activos con imagen, nombre, categoría y precio. | Todos | Alta |
| RF-02 | Filtrar el catálogo por categoría y buscar por nombre. | Todos | Alta |
| RF-03 | Ver el detalle de un producto (descripción, color, stock). | Todos | Alta |
| RF-04 | Agregar productos al carrito sin superar el stock; cambiar cantidades y quitar productos. | Visitante, Cliente, Admin | Alta |
| RF-05 | Mantener el carrito al recargar la página. | Visitante, Cliente, Admin | Media |
| RF-06 | Registrarse como cliente validando cada campo del formulario. | Visitante | Alta |
| RF-07 | Iniciar y cerrar sesión; redirigir según el rol. | Todos | Alta |
| RF-08 | Mantener la sesión activa al recargar y renovar el token automáticamente. | Autenticados | Alta |
| RF-09 | Confirmar una compra con dirección de envío; el backend valida stock y calcula neto, IVA (19 %) y total. | Cliente, Admin | Alta |
| RF-10 | Consultar el historial de compras propio con su detalle. | Cliente, Admin | Media |
| RF-11 | CRUD de productos (eliminar desactiva si tiene ventas). | Admin | Alta |
| RF-12 | Ver productos en solo lectura. | Vendedor | Media |
| RF-13 | CRUD de categorías (no se elimina una categoría con productos). | Admin | Alta |
| RF-14 | CRUD de usuarios con rol (un admin no puede eliminarse ni quitarse su rol). | Admin | Alta |
| RF-15 | Ver órdenes; cambiar su estado (pagada, enviada, entregada, anulada) y eliminar anuladas. Anular repone stock. | Admin (Vendedor: ver) | Alta |
| RF-16 | Resumen del panel con indicadores de ventas, productos y usuarios. | Admin | Media |
| RF-17 | Página Nosotros con video embebido y formulario de contacto validado. | Todos | Baja |
| RF-18 | Mostrar mensajes de error claros junto al campo y los errores que envía el backend. | Todos | Alta |
| RF-19 | Documentar el API en Swagger. | Desarrolladores | Alta |

## 4. Requerimientos no funcionales

| ID | Tipo | Requerimiento |
|---|---|---|
| RNF-01 | Seguridad | Contraseñas cifradas con BCrypt; nunca se guardan en el navegador. |
| RNF-02 | Seguridad | Tokens JWT firmados (HS256), access token de 30 min y refresh token de 7 días. |
| RNF-03 | Seguridad | Restricción por rol en tres niveles: rutas del frontend, interfaz y backend (401/403). |
| RNF-04 | Integridad | La compra es transaccional y bloquea la fila del producto para evitar sobreventa. |
| RNF-05 | Usabilidad | Diseño responsivo (Bootstrap 5): 2, 3 o 4 columnas de catálogo según el ancho; menú plegable en celulares. |
| RNF-06 | Usabilidad | Validación en JS antes de enviar, con mensajes específicos y sugerencias (autocompletado, datalist). |
| RNF-07 | Accesibilidad | Etiquetas `<label>` asociadas, `aria-invalid`, `aria-describedby`, roles `alert`/`status`, HTML5 semántico. |
| RNF-08 | Calidad | Pruebas unitarias automáticas en cada push (GitHub Actions); cobertura del frontend ≥ 80 % de líneas. |
| RNF-09 | Mantenibilidad | Código organizado por capas (frontend: api, context, components, pages, utils; backend: controller, service, repository, dto). |
| RNF-10 | Portabilidad | Configuración por variables de entorno (`VITE_API_URL`, `DB_URL`, `JWT_SECRET`, `CORS_ORIGINS`). |

## 5. Modelo de datos

```
USUARIO 1 ──── N BOLETA 1 ──── N DETALLE_BOLETA N ──── 1 PRODUCTO N ──── 1 CATEGORIA
```

| Entidad | Atributos principales |
|---|---|
| Usuario | id, nombre, apellido, email (único), password (BCrypt), rol, dirección, activo, fechaCreacion |
| Categoría | id, nombre (único), descripción |
| Producto | id, nombre, descripción, precio, stock, color, imagenUrl, activo, categoría |
| Boleta | id, número, fecha, estado, usuario, dirección de envío, neto, IVA, total |
| DetalleBoleta | id, boleta, producto, cantidad, precio unitario, subtotal |

## 6. Casos de uso principales

| Caso de uso | Actor | Flujo básico |
|---|---|---|
| CU-01 Comprar | Cliente | Agrega productos al carrito → Checkout → ingresa dirección (validada) → confirma → recibe la boleta. |
| CU-02 Registrarse | Visitante | Completa el formulario → validación por campo → cuenta creada con sesión iniciada. |
| CU-03 Administrar productos | Admin | Panel › Productos → Nuevo/Editar → formulario validado → guardar → la lista se actualiza. |
| CU-04 Gestionar órdenes | Admin | Panel › Órdenes → ver detalle → cambiar estado o anular (repone stock). |
| CU-05 Consultar órdenes | Vendedor | Ingresa → va directo al panel → ve productos y órdenes sin botones de edición. |

## 7. Trazabilidad con la evaluación

| Indicador | Dónde se cumple |
|---|---|
| HTML5 y CSS | Estructura semántica (`header`, `nav`, `main`, `section`, `article`, `footer`, `figure`), video embebido en Nosotros, hoja de estilos externa `global.css` |
| Validación de formularios en JS | `src/utils/validaciones.js`, `useFormulario.js`, `ErrorCampo.jsx` |
| Repositorio colaborativo | Commits descriptivos (feat/test/docs/ci), rama `desarrollo` integrada a `main`, CI en GitHub Actions |
| React + responsividad con Bootstrap | Componentes con props y estado; grilla `row-cols`, menú plegable, formularios Bootstrap |
| Pruebas Jasmine + Karma | `karma.conf.cjs`, archivos `*.spec.js(x)`, [Cobertura_Testing.md](Cobertura_Testing.md) |
| Backend con base de datos | Spring Boot + JPA + MySQL (Back_Esen) |
| CRUD REST + Swagger | `/api/v1/*`, Swagger UI ([Documentación de APIs](https://github.com/Daartw/Back_Esen/blob/main/docs/Documentacion_APIs.md)) |
| Autenticación y roles | JWT con refresh, `RutaProtegida`, `SecurityConfig` |
