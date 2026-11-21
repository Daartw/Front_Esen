# Documento de cobertura del testing — Frontend ESEN

## 1. Herramientas

| Herramienta | Uso |
|---|---|
| **Jasmine 4** | Framework de pruebas: `describe`, `it`, `expect`, `beforeEach`/`afterEach`, espías (`jasmine.createSpy`, `spyOn`) y pruebas asíncronas (`expectAsync`). |
| **Karma 6** | Ejecutor: abre Chrome sin interfaz (ChromeHeadless), carga las pruebas y reporta resultados. |
| **webpack + Babel** | Empaquetan los `.spec.js(x)` y transforman JSX para el navegador. |
| **Istanbul (karma-coverage)** | Mide la cobertura e informa en `coverage/html/index.html`, `lcov.info` y en consola. |
| **GitHub Actions** | Ejecuta `npm test` en cada push y publica el informe de cobertura como artefacto. |

Configuración: [`karma.conf.cjs`](../karma.conf.cjs). Utilidades de prueba (montar componentes, escribir en campos, hacer clic): [`src/test/utilidades.js`](../src/test/utilidades.js).

## 2. Cómo ejecutarlas

```bash
npm install
npm test            # una ejecución (Chrome headless) + informe de cobertura
npm run test:watch  # modo observación mientras se programa
```

El informe HTML queda en `coverage/html/index.html`.

## 3. Resultados

Ejecución del 21-11-2026 en GitHub Actions (Chrome Headless 157):

**86 pruebas — 86 exitosas — 0 fallidas.**

| Métrica | Cobertura |
|---|---|
| Sentencias | **87,11 %** |
| Ramas | **78,71 %** |
| Funciones | **89,84 %** |
| Líneas | **87,16 %** |

### Cobertura por archivo

| Archivo | Sentencias | Ramas | Funciones | Líneas |
|---|---:|---:|---:|---:|
| api/cliente.js | 100 % | 93,75 % | 100 % | 100 % |
| api/servicios.js | 100 % | 0 % ¹ | 100 % | 100 % |
| api/sesion.js | 100 % | 100 % | 100 % | 100 % |
| components/Aviso.jsx | 100 % | 100 % | 100 % | 100 % |
| components/Cargando.jsx | 100 % | 25 % | 100 % | 100 % |
| components/ErrorCampo.jsx | 100 % | 100 % | 100 % | 100 % |
| components/ImagenProducto.jsx | 50 % | 50 % | 50 % | 66,66 % |
| components/Modal.jsx | 100 % | 100 % | 100 % | 100 % |
| components/TarjetaProducto.jsx | 100 % | 100 % | 100 % | 100 % |
| context/CarritoContext.jsx | 94,28 % | 76,92 % | 100 % | 96,29 % |
| pages/Nosotros.jsx | 100 % | 100 % | 100 % | 100 % |
| pages/admin/Categorias.jsx ² | 14,63 % | 15,38 % | 15,38 % | 13,51 % |
| utils/formato.js | 100 % | 100 % | 100 % | 100 % |
| utils/roles.js | 100 % | 100 % | 100 % | 100 % |
| utils/useDatos.js | 100 % | 100 % | 100 % | 100 % |
| utils/useFormulario.js | 96,66 % | 83,33 % | 90 % | 100 % |
| utils/validaciones.js | 96,82 % | 89,88 % | 100 % | 100 % |

¹ La única rama es el valor por defecto `filtros = {}`, que las pruebas no omiten.
² Se prueba el componente `FormularioCategoria` exportado desde ese archivo; la pantalla completa (tabla y llamadas al API) se valida con las pruebas de servicios y manualmente.

La cobertura considera los archivos que importan las pruebas, que son la lógica de negocio del frontend (validaciones, sesión, carrito, cliente HTTP) y los componentes reutilizables.

## 4. Casos de prueba

| Archivo de prueba | Qué verifica | Conceptos |
|---|---|---|
| `utils/validaciones.spec.js` (27) | Reglas de cada formulario: obligatorios, largos, email, contraseña segura, coincidencia de contraseñas, precio/stock enteros, URL, contacto. | Casos válidos, inválidos y de borde |
| `utils/formato.spec.js` (7) | Precio en CLP, fecha, mensajes de error del backend (sin conexión, por campo, por defecto). | Pruebas de funciones puras |
| `utils/roles.spec.js` (4) | Página inicial por rol y opciones del menú del panel por rol. | Restricción por roles |
| `api/sesion.spec.js` (5) | Guardar/leer/borrar sesión en localStorage, JSON dañado, expiración del JWT. | Persistencia y seguridad |
| `api/cliente.spec.js` (7) | Interceptores Axios: token Bearer, renovación ante 401, cierre de sesión si falla, sin renovar en login. | Dobles de prueba (adaptador falso), asincronía |
| `api/servicios.spec.js` (4) | Cada servicio usa el método HTTP y la ruta correctos (CRUD completo). | Integración frontend ↔ API simulada |
| `utils/useDatos.spec.jsx` (2) | Estados cargando / datos / error de un hook. | Hooks y promesas |
| `context/CarritoContext.spec.jsx` (6) | Agregar, límite de stock, total, quitar, vaciar, persistencia. | Estado global con Context |
| `components/Aviso.spec.jsx` (5) | Aviso y ErrorCampo: renderizado condicional, roles ARIA, clases Bootstrap. | Props y DOM |
| `components/TarjetaProducto.spec.jsx` (4) | Enlace al detalle, precio, imagen de respaldo, etiquetas de stock. | Props y renderizado condicional |
| `components/Modal.spec.jsx` (5) | Diálogo accesible, cierre con botón, Escape y clic en el fondo; Cargando. | Eventos del DOM |
| `pages/admin/FormularioCategoria.spec.jsx` (5) | Validación al enviar y al salir del campo, corrección del error, contador, envío válido. | Manipulación del DOM y espías |
| `pages/Nosotros.spec.jsx` (5) | Video embebido, HTML5 semántico, enlaces, validación y envío del contacto. | Pruebas de página |

## 5. Conceptos del proceso de testeo aplicados

- **Pruebas unitarias aisladas**: cada `describe` prueba una unidad (función, hook o componente) sin depender del backend real.
- **Patrón AAA** (preparar, actuar, verificar) en cada `it`.
- **Dobles de prueba**: adaptadores falsos de Axios y espías de Jasmine en lugar del servidor.
- **Casos límite**: valores vacíos, máximos, negativos, decimales, tokens vencidos, JSON dañado.
- **Independencia**: `beforeEach`/`afterEach` limpian `localStorage` y desmontan componentes.
- **Integración continua**: las pruebas corren en cada push; si una falla, el build del commit queda en rojo.

## 6. Backend (referencia)

El backend tiene sus propias pruebas con JUnit 5, Mockito y MockMvc (`mvn test`): `BoletaServiceTest` (4 pruebas de la lógica de venta) y `ApiIntegracionTest` (10 pruebas del API completo con H2).
