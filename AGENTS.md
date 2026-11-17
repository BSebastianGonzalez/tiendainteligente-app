# AGENTS.md — TiendaInteligente (prototipo funcional)

Instrucciones para agentes de código (y para humanos) que trabajen en este repositorio.

## 1. Qué es esto

Prototipo **solo frontend** de TiendaInteligente: una app móvil para tenderos de barrio (ventas, inventario, fiados, panel, puntos). Es proyecto académico (UFPS 2026-2, Hub FinTech). **El objetivo es mostrar los diseños funcionando, rápido.** No es un producto en producción.

- **Usuario único:** el tendero (persona: Arturo Mendoza, 54 años, Cúcuta, confianza digital baja-media).
- **Plataforma simulada:** Android, vertical. En escritorio se muestra dentro de un marco de celular (~360 px de ancho).
- **Idioma de la interfaz:** español de Colombia, cotidiano, sin términos financieros ni técnicos.
- **Sin base de datos y sin backend.** Los datos son de ejemplo (mock) y viven en memoria. Se pueden persistir en `localStorage` solo para que la demo no se reinicie al recargar.

### Fuentes de verdad (en `/docs`)

| Archivo | Para qué |
| --- | --- |
| `docs/requisitos-y-flujos.md` | Requisitos RF-xx, reglas de negocio, mapa de pantallas, flujos críticos |
| `docs/wireframes-mvp.html` | Wireframes navegables de baja fidelidad: **referencia visual y de flujo** |
| `docs/propuesta.docx` | Contexto general del proyecto |

**Jerarquía:** para lo **visual** (colores, tipografía, espaciados, componentes) manda **Figma**. Para **flujos y reglas de negocio** manda el documento de requisitos; después, los wireframes. Si Figma y los requisitos se contradicen, avisa y no decidas por tu cuenta. No inventes funcionalidades que no estén en ninguno de los dos.

## 1.1 Diseños en Figma

Los mockups de alta fidelidad están en Figma y la herramienta de Figma está conectada a tu entorno.

Archivo: https://www.figma.com/design/3lExeD1JGCGtmuspmltZcn/TiendaInteligente-%C2%B7-Mockups-MVP?node-id=1-127&p=f&t=GnrkoNHFGZwlcvUl-0

El archivo tiene dos páginas:

1. **Componentes y estilos** (colores, tipografías, botones, tarjetas, etc.): https://www.figma.com/design/3lExeD1JGCGtmuspmltZcn/TiendaInteligente-%C2%B7-Mockups-MVP?node-id=0-1
2. **Vistas** (las pantallas completas, un frame por pantalla): https://www.figma.com/design/3lExeD1JGCGtmuspmltZcn/TiendaInteligente-%C2%B7-Mockups-MVP?node-id=1-126

### Orden de trabajo

1. **Paso 0 (antes de escribir código):** consulta la página de Componentes y verifica que puedes leer Figma de verdad (colores en hex, nombres de estilos, tipografías). Si no puedes acceder, **avisa y detente**; no inventes el diseño.
2. **Tokens:** extrae colores, tipografía, radios y espaciados a `src/styles/variables.css`. Todo lo demás usa esas variables; no pongas valores sueltos en los componentes.
3. **Componentes base:** construye en `src/components/` los componentes que aparecen en la página de Componentes (botones, tarjetas, etiquetas, ítems de lista, barra inferior, etc.), con los mismos nombres y variantes que en Figma.
4. **Pantallas:** lista los frames de la página de Vistas y arma una tabla en `docs/figma-frames.md` con nombre del frame, enlace y requisitos RF-xx relacionados (usa el mapa de pantallas de `docs/requisitos-y-flujos.md`). Después construye cada pantalla consultando su frame y reutilizando los componentes del paso 3.

### Reglas

- Consulta siempre el frame de la pantalla antes de construirla; no te bases en memoria ni en suposiciones.
- Si algo **no está diseñado** en Figma (ver pendientes en la sección 2), usa el wireframe de `docs/` como guía de estructura y los mismos tokens visuales.
- Si Figma muestra algo fuera del alcance del MVP, no lo implementes.
- Si el diseño no es viable en la práctica (por ejemplo, rompe con texto extra grande), haz el ajuste mínimo y déjalo anotado en el commit o PR.

## 2. Alcance

**Dentro:** registro e ingreso con PIN, recuperación por SMS (simulada), onboarding con primera venta guiada, ventas (contado, fiadas, rápidas por monto, historial, anulación, deshacer 30 min), inventario (alta, reposición, alertas de vencimiento y stock bajo), fiados (abonos, recordatorio por WhatsApp), panel de inicio, puntos y recompensas, sugerencia de marcas, ajustes (tamaño de letra, ayuda, cerrar sesión), estados vacío / error / sin conexión.

**Fuera (no implementar):** score crediticio y microcréditos, pagos con QR, asistente de voz, bot de WhatsApp, microseguros, compras agrupadas, educación financiera, vista para marcas.

**Pendientes sin diseño** (implementar solo si el equipo lo pide): notificación matutina (RF-35), venta mixta (RF-29), aviso de límite de fiado (RF-32), canje de puntos (RF-37), panel interno (RF-43), error genérico (RF-46), edición de datos de tienda (RF-18).

## 3. Stack

- **React + Vite, JavaScript** (no TypeScript, para ir rápido).
- **Enrutado:** `react-router-dom` con `HashRouter` (se despliega como sitio estático sin configurar el servidor).
- **Estado:** React Context + `useReducer`. Si crece, Zustand. Nada más pesado.
- **Estilos:** CSS plano con variables (`:root`) generadas a partir de los estilos de Figma (ver sección 1.1). Los wireframes solo sirven de guía de estructura. Sin librerías de UI.
- **Sin dependencias nuevas** salvo que sean necesarias. Pregunta antes de agregar una.

## 4. Estructura

```
src/
  app/            # rutas, layout del celular, barra inferior (Inicio, Vender, Inventario, Fiados)
  screens/        # una carpeta por sección: acceso/, inicio/, vender/, inventario/, fiados/, estados/
  components/     # botones, tarjetas, listas, modales, etiquetas reutilizables
  services/       # ÚNICA capa que toca datos: productos, ventas, clientes, sesión
  data/           # datos de ejemplo (seed): ~30 productos, clientes, ventas
  state/          # contexto y reducers
  styles/         # variables y estilos globales
docs/             # requisitos, wireframes, propuesta
```

### Regla clave para el futuro backend

**Las pantallas nunca leen ni escriben datos directamente.** Siempre pasan por `src/services/*`, que hoy trabaja sobre memoria / `localStorage`. Las funciones deben ser `async` y devolver objetos simples (por ejemplo `await ventasService.registrar(venta)`). Así, cuando exista un backend, solo se reescribe `services/` y las pantallas no cambian.

## 5. Reglas de diseño (innegociables)

- Botones grandes (alto mínimo ~56 px), alto contraste, **íconos siempre con texto**.
- **Sin menús ocultos:** navegación inferior fija con 4 pestañas. El historial se abre desde la tarjeta "Ventas de hoy"; Ajustes desde el engranaje del Inicio.
- Registrar una venta de contado en **máximo 2 toques** desde la pantalla principal.
- Toda acción destructiva lleva confirmación clara y opción de **deshacer**.
- Tamaño de texto ajustable (normal / grande / extra grande) usando unidades relativas (`rem`/`em`).
- Estados vacíos y errores en lenguaje cotidiano, con una acción clara (ej. "Aún no tienes fiados").
- Indicador visible de conexión (simular sin conexión con un interruptor de demo).
- Ligero y fluido: pensado para celulares de gama baja.
- Modo oscuro solo si Figma lo define; si no, basta con el modo claro.

## 6. Reglas de negocio a respetar en los datos de ejemplo

- **Ganancia estimada del día:** suma de (precio de venta − costo) × cantidad. Si un producto no tiene costo, no suma y el panel lo indica.
- **Por vencer:** algún lote vence dentro de la ventana configurable (7 días por defecto).
- **Fiado pendiente:** ventas fiadas − abonos recibidos.
- **Deshacer:** cubre solo la última operación durante 30 minutos. Lo anterior se corrige desde el historial.
- **Puntos:** 1 por venta registrada (tope 30 al día) + 5 si ese día se actualizó el inventario.
- **Recordatorio de fiado:** abre WhatsApp (`wa.me`) con mensaje prellenado; el tendero lo revisa y lo envía. SMS como alternativa manual. Nunca envío automático.
- **Pauta de marcas:** una sola sugerencia por pantalla, solo en detalle de producto y en reposición, etiquetada "Sugerencia" y descartable. Nunca en el flujo de venta ni en fiados.
- **Anular venta:** devuelve el stock y ajusta el fiado si lo había.

## 7. Cómo trabajar (para el agente)

1. Lee `docs/requisitos-y-flujos.md`, abre `docs/wireframes-mvp.html` y consulta el frame de Figma (sección 1.1) antes de construir una pantalla.
2. Trabaja **un flujo a la vez**, en este orden sugerido: layout + navegación → acceso/onboarding → vender (contado) → fiados → inventario → panel → puntos → ajustes → estados.
3. Cita el ID del requisito (RF-xx) en el commit o en un comentario breve cuando aplique.
4. Prefiere lo simple y rápido. No sobreingenierices: nada de tests exhaustivos, i18n, TypeScript ni optimizaciones prematuras.
5. Si un requisito es ambiguo, haz una suposición razonable, déjala anotada en el PR/commit y sigue. Pregunta solo si bloquea.
6. No toques archivos de `docs/` salvo que se te pida.

### Comandos

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # compilación de producción
npm run preview   # probar el build
```

### Definición de "terminado" para una pantalla o flujo

- Se ve bien a 360 px de ancho y no se rompe con texto extra grande.
- El flujo completo se puede recorrer con datos de ejemplo, incluidos estado vacío y deshacer.
- `npm run build` pasa sin errores.
- Se probó a mano en el navegador.

## 8. Flujo de trabajo en Git

Flujo simple basado en ramas cortas. Pocas reglas, pero se cumplen.

### Ramas

- `main`: siempre funciona (`npm run build` pasa). **Nadie hace commit directo en `main`.**
- Una rama por tarea, corta (idealmente de 1 a 2 días), creada desde `main` actualizado:
  - `feat/<tema>` nueva pantalla o funcionalidad → `feat/venta-contado`
  - `fix/<tema>` corrección → `fix/total-carrito`
  - `style/<tema>` solo estilos o ajustes visuales
  - `docs/<tema>` documentación
  - `chore/<tema>` configuración, dependencias, limpieza

### Commits

Formato **Conventional Commits**, en español, en minúscula, en presente, máximo ~72 caracteres:

```
<tipo>(<ámbito opcional>): <descripción>
```

Tipos: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`.

Ejemplos:

```
feat(vender): agrega selección de productos con búsqueda (RF-01, RF-22)
feat(fiados): registra abonos y actualiza el saldo del cliente (RF-07)
fix(inventario): corrige alerta de vencimiento con ventana de 7 días
style(inicio): ajusta tarjetas del panel para letra extra grande
chore: configura Vite y estructura inicial
```

Reglas:

- **Commits pequeños y atómicos:** un cambio lógico por commit. Mejor varios commits pequeños que uno gigante de "avances".
- Que el proyecto compile en cada commit.
- Prohibidos mensajes como `cambios`, `fix`, `wip`, `asdf`.
- No subir `node_modules/`, `dist/`, archivos `.env` ni archivos del sistema (revisar `.gitignore`).

### Integración a `main`

1. Antes de abrir el PR: `git fetch` y `git rebase origin/main` (o merge si hay conflictos complicados).
2. Abrir Pull Request hacia `main` con título en el mismo formato de commit y una descripción breve (qué se hizo, qué RF cubre, cómo probarlo, capturas si hay cambio visual).
3. Al menos **una persona del equipo revisa** (si el trabajo lo hizo un agente, la revisión humana es obligatoria).
4. Se integra con **squash merge** para mantener un historial limpio; el título del squash sigue el formato de commit.
5. Se borra la rama tras integrar.

### Reglas de seguridad para el agente

- **No hagas `push` a `main`, `force push`, ni reescribas historia compartida** (`reset --hard`, `rebase` de ramas ya publicadas, etc.).
- **No borres ramas ni hagas merge por tu cuenta.** Eso lo decide un humano.
- Haz commit en tu rama de trabajo; si no tienes claro en qué rama estás, revisa con `git status` y `git branch --show-current` antes de empezar.
- Antes de cada commit, revisa `git diff --staged`: no incluyas archivos ajenos a la tarea.
- Si hay conflictos que no entiendes, detente y avisa en lugar de resolverlos a ciegas.

## 9. Despliegue (opcional)

Sitio estático (GitHub Pages o Vercel) para compartir la demo. Con `HashRouter` no necesita configuración extra de rutas. Si se usa GitHub Pages, definir `base` en `vite.config.js` con el nombre del repositorio.

## 10. Cuando llegue el backend (fuera de este alcance)

No lo construyas ahora. Solo mantén las puertas abiertas: servicios `async` en `src/services/`, objetos de datos simples con `id`, y ninguna lógica de datos dentro de los componentes visuales.
