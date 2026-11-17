# TiendaInteligente — Requisitos y flujos para wireframes (MVP)

Alcance del MVP sin módulo de crédito. Base: propuesta TiendaInteligente (Hub FinTech), UFPS 2026-2.

## 1. Alcance del MVP

**Dentro del MVP**

- Cuenta: registro con celular, ingreso con PIN y recuperación por SMS
- Ventas de contado, fiadas y rápidas por monto, con historial y anulación
- Inventario: alta de productos, reposición, alertas de vencimiento y de stock bajo
- Fiados con clientes, abonos y recordatorios por WhatsApp
- Panel de control sencillo
- Puntos y recompensas por uso constante
- Sugerencias de marcas al reponer (pauta)
- Onboarding guiado
- Ajustes: tamaño de letra, ayuda y cerrar sesión
- Funcionamiento sin conexión y respaldo en la nube

**Fuera del MVP (fase futura)**

- Score crediticio alternativo y microcréditos
- Pagos con QR, asistente de voz y bot de WhatsApp para pedidos
- Microseguros, compras agrupadas y píldoras de educación financiera
- Vista para marcas o gremio

Cualquier ítem de la lista "fuera" puede subir al MVP si el equipo lo decide.

## 2. Usuario y supuestos de diseño

- **Usuario único:** el tendero (persona: Arturo Mendoza, 54 años, Cúcuta, confianza digital baja-media).
- **Plataforma:** app móvil Android en orientación vertical, que funciona sin conexión y con un solo dispositivo activo por cuenta.
- **Principio rector:** que el tendero no sienta que puede perder información ni perder tiempo con clientes en el mostrador.
- **Meta medible de la hipótesis:** 50 tenderos con uso recurrente (3 o más días activos por semana) durante 4 semanas.

## 3. Requisitos funcionales

Los ID se conservan tal como aparecen en el prototipo, para mantener la trazabilidad. RF-33, RF-34, RF-36 y RF-38 se fusionaron en RF-05, RF-10, RF-11 y RF-12.

| Área | ID | Requisito | Prioridad |
| --- | --- | --- | --- |
| Cuenta | RF-13 | Onboarding con registro guiado de la primera venta | Must |
| Cuenta | RF-14 | Registrar al tendero con su nombre, el nombre de la tienda y su número de celular | Must |
| Cuenta | RF-15 | Ingresar con un PIN de 4 dígitos y mantener la sesión abierta | Must |
| Cuenta | RF-16 | Recuperar el acceso con un código enviado por SMS al celular registrado | Must |
| Cuenta | RF-17 | Aceptar términos y política de tratamiento de datos al registrarse (Ley 1581 de 2012), porque la app guarda datos de clientes del tendero | Must |
| Cuenta | RF-18 | Editar datos de la tienda y cerrar sesión desde Ajustes | Should |
| Ventas | RF-01 | Registrar una venta en máximo 2 toques desde la pantalla principal | Must |
| Ventas | RF-02 | Marcar una venta como fiada asociándola a un cliente | Must |
| Ventas | RF-25 | Cambiar la cantidad o quitar un producto antes de confirmar la venta | Must |
| Ventas | RF-26 | Venta rápida por monto, para productos no registrados | Must |
| Ventas | RF-29 | Venta mixta: parte pagada y el resto fiado | Could |
| Ventas | RF-08 | Deshacer la última operación (venta, abono o ajuste de stock) durante 30 minutos | Must |
| Ventas | RF-27 | Historial de ventas por día, con detalle de cada una | Should |
| Ventas | RF-28 | Anular una venta del historial: devuelve el stock y ajusta el fiado si lo había, con confirmación | Must |
| Inventario | RF-03 | Consultar el inventario con la cantidad disponible por producto | Must |
| Inventario | RF-19 | Crear y editar un producto: nombre, precio de venta, costo de compra, unidad y stock mínimo | Must |
| Inventario | RF-20 | Precargar un catálogo inicial de productos comunes, editable | Should |
| Inventario | RF-21 | Archivar un producto sin borrar su historial | Should |
| Inventario | RF-04 | Ajustar manualmente las existencias de un producto | Must |
| Inventario | RF-22 | Buscar un producto por nombre en Inventario y en Vender | Must |
| Inventario | RF-23 | Reponer mercancía: registrar producto, cantidad, costo y vencimiento; suma al stock y actualiza el costo | Must |
| Inventario | RF-24 | Descontar el stock al vender y avisar cuando llegue al mínimo | Must |
| Inventario | RF-05 | Alertar los productos próximos a vencer; la ventana es configurable y por defecto de 7 días | Must |
| Fiados | RF-06 | Listar los clientes con deuda, monto y antigüedad | Must |
| Fiados | RF-30 | Crear y editar un cliente: nombre y celular opcional | Must |
| Fiados | RF-07 | Registrar abonos y pagos de fiados | Must |
| Fiados | RF-31 | Corregir o anular un abono registrado por error | Should |
| Fiados | RF-32 | Límite de fiado opcional por cliente, con aviso al superarlo | Could |
| Fiados | RF-10 | Recordatorio de fiado prellenado para WhatsApp (SMS como alternativa), que el tendero revisa y envía; sin envío automático | Should |
| Panel y fidelización | RF-09 | Panel con ventas del día, ganancia estimada, productos por vencer y fiados pendientes | Should |
| Panel y fidelización | RF-35 | Notificación matutina con productos por vencer y fiados más antiguos | Should |
| Panel y fidelización | RF-11 | Acumular puntos con las reglas de la sección 4 y mostrar los premios | Should |
| Panel y fidelización | RF-37 | Solicitar el canje de puntos desde la app; el equipo lo gestiona con la marca aliada | Could |
| Panel y fidelización | RF-12 | Mostrar sugerencias de marcas con las reglas de la sección 4 y registrar vistas y toques por marca | Could |
| Datos y medición | RF-39 | Guardar ventas, inventario y fiados en el celular sin conexión y sincronizar al reconectar, con indicador visible de estado | Must |
| Datos y medición | RF-40 | Un solo dispositivo activo por cuenta en el MVP, para evitar conflictos de edición | Must |
| Datos y medición | RF-41 | Respaldo en la nube y recuperación en un celular nuevo con el mismo número y PIN | Must |
| Datos y medición | RF-42 | Registrar eventos de uso (venta, inventario, fiado) para medir el uso recurrente de la hipótesis | Must |
| Datos y medición | RF-43 | Panel interno mínimo: tenderos activos, días activos por semana y tiempo por venta | Should |
| Apoyo | RF-44 | Botón de ayuda que abre el WhatsApp del equipo y tutorial corto que se puede repetir | Should |
| Apoyo | RF-45 | Tamaño de texto ajustable: normal, grande y extra grande | Should |
| Apoyo | RF-46 | Estados vacíos y mensajes de error en lenguaje cotidiano, con una acción clara (por ejemplo, "Aún no tienes fiados") | Must |

## 4. Reglas de negocio y decisiones

Los valores numéricos y las decisiones son propuestas iniciales, para confirmar con el equipo y ajustar con el piloto.

- **Ganancia estimada del día:** suma de (precio de venta menos costo) por la cantidad vendida. Si un producto no tiene costo, no suma y el panel lo indica.
- **Por vencer:** producto con algún lote que vence dentro de la ventana configurada (7 días por defecto).
- **Fiado pendiente:** ventas fiadas menos abonos recibidos.
- **Deshacer:** cubre la última operación durante 30 minutos. Lo anterior se corrige desde el historial.
- **Puntos:** 1 punto por venta registrada, con tope de 30 al día, más 5 puntos si ese día se actualizó el inventario.
- **Día activo:** el tendero registra al menos una venta, un movimiento de inventario o un fiado. Uso recurrente es tener 3 o más días activos por semana durante 4 semanas.
- **Canal del recordatorio de fiado:** WhatsApp como canal principal. La app abre el chat con el mensaje prellenado y el tendero lo revisa y lo envía; el SMS queda como alternativa manual. No hay envío automático, para evitar costos de mensajería y mensajes sin revisar.
- **Pauta de marcas:** una sola sugerencia por pantalla, solo en el detalle de producto y en la reposición, siempre etiquetada "Sugerencia" y descartable. Nunca aparece en el flujo de venta ni en fiados.
- **Catálogo inicial:** arranca con unos 30 productos comunes de tienda de barrio, editables. El tendero puede borrarlos o empezar vacío.

## 5. Requisitos no funcionales

- Botones grandes, alto contraste, íconos acompañados de texto.
- Sin menús ocultos: navegación inferior fija con 4 secciones.
- Confirmaciones claras y opción de deshacer en toda acción destructiva.
- App ligera para celulares de gama baja.
- Registrar ventas, inventario y fiados sin conexión, con sincronización posterior.
- Lenguaje cotidiano, sin términos financieros o técnicos.

## 6. Historias de usuario

| ID | Como tendero quiero… | Para… | Req. |
| --- | --- | --- | --- |
| HU-01 | registrar una venta con pocos toques | no hacer esperar a mi cliente | RF-01 |
| HU-02 | anotar que una venta quedó fiada a un vecino | reemplazar mi cuaderno | RF-02 |
| HU-03 | ver cuánto me debe cada cliente | saber a quién cobrar | RF-06, RF-07 |
| HU-04 | corregir un error al instante | no temer equivocarme | RF-08 |
| HU-05 | ver qué productos se me están por vencer | evitar pérdidas | RF-05 |
| HU-06 | saber cuánto queda de cada producto | decidir qué reponer | RF-03, RF-04 |
| HU-07 | ver un resumen de mi día | conocer mi ganancia real | RF-09 |
| HU-08 | recordar a un cliente su deuda sin incomodarlo | recuperar mi dinero | RF-10 |
| HU-09 | ganar puntos por usar la app | obtener beneficios | RF-11 |
| HU-10 | ser guiado la primera vez | perder el miedo a la app | RF-13 |
| HU-11 | crear mi cuenta con mi celular y un PIN fácil | entrar sin complicarme | RF-14, RF-15, RF-17 |
| HU-12 | recuperar mi acceso si olvido el PIN | no perder mi información | RF-16, RF-41 |
| HU-13 | agregar un producto nuevo con su precio y su costo | conocer mi ganancia real | RF-19, RF-20 |
| HU-14 | anotar la mercancía que acabo de comprar | tener el inventario al día | RF-23, RF-24 |
| HU-15 | vender algo que no tengo registrado | no frenar la venta | RF-26 |
| HU-16 | cambiar o quitar un producto antes de cobrar | corregir sin empezar de nuevo | RF-25 |
| HU-17 | anular una venta que registré mal | dejar las cuentas correctas | RF-28, RF-31 |
| HU-18 | agregar un cliente nuevo al fiar | no salir de la venta | RF-30 |
| HU-19 | usar la app aunque no haya internet | vender sin interrupciones | RF-39, RF-40 |
| HU-20 | agrandar las letras | leer sin esfuerzo | RF-45 |
| HU-21 | pedir ayuda a una persona | no quedarme trabado | RF-44, RF-46 |

## 7. Mapa de pantallas

La barra inferior fija tiene 4 pestañas: Inicio, Vender, Inventario y Fiados. El historial se abre desde la tarjeta "Ventas de hoy" del Inicio y Ajustes desde el engranaje del Inicio.

| Sección | Pantallas | Req. |
| --- | --- | --- |
| Acceso | Bienvenida, registro, términos y datos, PIN (crear e ingresar), recuperar acceso, cómo funciona y primera venta guiada | RF-13 a RF-17 |
| Inicio | Panel, historial de ventas con detalle y anulación, puntos y recompensas, y Ajustes (tienda, tamaño de letra, ayuda y cerrar sesión) | RF-09, RF-11, RF-18, RF-27, RF-28, RF-44, RF-45 |
| Vender | Selección de productos con búsqueda, venta rápida por monto, resumen con edición del carrito, elegir cliente, cliente nuevo y confirmación con deshacer | RF-01, RF-02, RF-08, RF-22, RF-25, RF-26, RF-30 |
| Inventario | Lista con búsqueda y alertas, detalle de producto con sugerencia de marca, crear y editar producto, y reponer mercancía | RF-03, RF-04, RF-05, RF-12, RF-19 a RF-24 |
| Fiados | Lista de clientes con deuda, detalle con historial, abono, recordatorio y cliente nuevo | RF-06, RF-07, RF-10, RF-30, RF-31, RF-32 |
| Estados | Sin conexión, vacío y error | RF-39, RF-46 |

## 8. Flujos críticos a wireframear

Todos están en el [prototipo navegable](https://claude.ai/artifact/9uVu72gmN19QUWH4ucqTFH).

1. Onboarding y primera venta guiada
2. Registrar venta de contado (máximo 2 toques)
3. Registrar venta fiada
4. Ver y cobrar un fiado (abono y recordatorio)
5. Alertas de vencimiento y reposición
6. Panel de inicio
7. Registro, términos e ingreso con PIN
8. Agregar un producto y reponer mercancía
9. Venta rápida por monto y edición del carrito
10. Anular una venta desde el historial
11. Uso sin conexión y sincronización

## 9. Criterios para validar el prototipo (piloto de 5 tenderos)

- Tiempo promedio para registrar una venta.
- Errores cometidos y si pudieron corregirlos solos.
- Cuántos completan la primera venta con ayuda mínima.
- Nivel de satisfacción y dudas frecuentes.

## 10. Pendientes

**Aún sin dibujar, para los mockups en Figma**

- Notificación matutina (RF-35)
- Venta mixta, parte pagada y parte fiada (RF-29)
- Aviso al superar el límite de fiado (RF-32; el campo ya existe en Cliente nuevo)
- Solicitud de canje de puntos (RF-37)
- Panel interno del equipo (RF-43)
- Pantalla de error genérica (RF-46; solo hay estados vacíos y sin conexión)
- Edición de los datos de la tienda (RF-18; hoy solo se muestran)

**Por definir con el equipo**

- Texto legal de los términos y la política de datos
- Marcas aliadas y catálogo de premios
- Valores de las reglas de negocio, tras el piloto
