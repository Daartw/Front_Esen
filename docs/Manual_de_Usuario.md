# Manual de usuario — ESEN Tienda

ESEN es una tienda online de ropa básica en tonos neutros. Este manual explica cómo usarla según el tipo de usuario.

> Sitio de demostración: los pagos son simulados y no se realizan ventas reales.

## 1. Acceso

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@esen.cl | `Admin123*` |
| Vendedor | vendedor@esen.cl | `Vendedor123*` |
| Cliente | cliente@esen.cl | `Cliente123*` |

En el computador local la tienda se abre en `http://localhost:5173`, con el backend corriendo en `http://localhost:8080`.

## 2. Navegación general

- **Cabecera**: enlaces a *Tienda*, *Nosotros*, *Mis compras* (cliente) y *Panel* (administrador); a la derecha, *Ingresar* o tu nombre con *Salir*, y el *Carrito* con la cantidad de unidades.
- **Celular**: el menú se pliega; toca **Menú** para abrirlo y **Cerrar** para ocultarlo.
- **Pie de página**: enlaces a Tienda, Nosotros y contacto, Carrito, Mis compras o Ingresar, y al código fuente.

## 3. Visitante y cliente

### 3.1 Ver el catálogo
1. En **Tienda**, presiona *Ver colección* o baja hasta el catálogo.
2. Filtra con los botones de categoría (*Todo*, *Hoodies*, etc.) o escribe en **Buscar producto**.
3. Las etiquetas *Últimas unidades* y *Agotado* indican el stock.
4. Haz clic en un producto para ver su detalle: descripción, color, stock y precio.

### 3.2 Carrito
1. En el detalle, elige la cantidad y presiona **Agregar al carrito**. No puedes superar el stock disponible.
2. En **Carrito** puedes cambiar cantidades o **Quitar** productos. El resumen muestra el total (envío gratis).
3. El carrito se guarda en el navegador: no se pierde al recargar.

### 3.3 Crear cuenta
1. Entra a **Ingresar › Crear cuenta**.
2. Completa nombre, apellido, email, dirección (opcional, con sugerencias de comunas) y contraseña.
3. Cada campo se revisa al salir de él y al enviar. Si hay un error, aparece en rojo **debajo del campo** con lo que debes corregir:
   - Nombre y apellido: solo letras, mínimo 2 caracteres.
   - Email con formato válido (ej. `nombre@correo.cl`).
   - Contraseña de 8 caracteres o más, con letras y números. Bajo el campo se indica qué tan segura es.
   - *Repetir contraseña* debe coincidir.
4. Al crear la cuenta quedas con la sesión iniciada.

### 3.4 Comprar
1. En el carrito presiona **Continuar con la compra**. Si no has iniciado sesión, se te pedirá ingresar y luego vuelves al pago.
2. Revisa o escribe la **dirección de envío** (mínimo 5 caracteres).
3. Presiona **Confirmar compra**. El sistema revisa el stock y genera la boleta con neto, IVA (19 %) y total.
4. Si un producto se agotó mientras comprabas, verás el aviso y no se cobra nada.

### 3.5 Mis compras
En **Mis compras** ves tus boletas con fecha, estado (*Pagada*, *Enviada*, *Entregada*, *Anulada*) y detalle de productos.

### 3.6 Nosotros y contacto
La página **Nosotros** muestra la historia de la marca, un video y un formulario de contacto (nombre, email, motivo y mensaje de 10 a 500 caracteres). Si falta algo, se indica junto al campo; al enviarlo correctamente aparece un mensaje de confirmación.

### 3.7 Sesión
- La sesión se mantiene aunque recargues la página o cierres la pestaña; se renueva sola mientras uses la tienda.
- **Salir** cierra la sesión en todas las pestañas abiertas.

## 4. Panel interno

Se abre con **Panel** en la cabecera (administrador) o automáticamente al ingresar (vendedor). En celulares el menú lateral pasa arriba.

### 4.1 Administrador

| Sección | Qué puedes hacer |
|---|---|
| **Resumen** | Ver ventas totales, cantidad de órdenes, productos y usuarios; últimas órdenes y productos con stock crítico. |
| **Productos** | *Nuevo producto*, *Ver*, *Editar*, *Eliminar*. Si el producto tiene ventas, al eliminarlo solo se desactiva. |
| **Órdenes** | Ver cada boleta, cambiar su estado y eliminar las anuladas. Al anular, el stock vuelve a la tienda. Una orden entregada no se puede anular. |
| **Categorías** | Crear, editar y eliminar. No se puede eliminar una categoría que tenga productos. |
| **Usuarios** | Crear usuarios con cualquier rol, editarlos (contraseña opcional al editar), activarlos o desactivarlos y eliminarlos. No puedes eliminarte ni quitarte el rol de administrador. |

Todos los formularios validan los datos antes de guardar (precio entero mayor a 0, stock 0 o más, categoría obligatoria, URL de imagen con `http(s)://`, etc.) y muestran el error junto al campo. Si el servidor rechaza algo (por ejemplo, un email repetido), el mensaje aparece en el formulario.

### 4.2 Vendedor
Ve solo **Productos** y **Órdenes**, en modo lectura: puede abrir el detalle pero no aparecen los botones para crear, editar o eliminar. Si intenta entrar a otra sección, ve la página *Sin acceso*.

## 5. Mensajes frecuentes

| Mensaje | Qué hacer |
|---|---|
| "No se pudo conectar con el servidor…" | Verifica que el backend esté en ejecución. |
| "Email o contraseña incorrectos" | Revisa email y contraseña. |
| Página *Sin acceso* | Tu rol no tiene permiso para esa sección. |
| Te envía al login | La sesión venció; vuelve a ingresar. |
