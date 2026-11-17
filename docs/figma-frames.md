# Frames de Figma — TiendaInteligente

> **Estado**: Tabla pendiente de completar con los frames reales del archivo Figma.
> Actualizar en la rama `feat/tokens-figma` una vez se tenga acceso al archivo.

## Frames identificados (placeholder)

| Frame | Pantalla | Descripción | URL Figma |
|-------|----------|-------------|-----------|
| `Frame-01` | Bienvenida / Acceso | Pantalla de onboarding y login | _pendiente_ |
| `Frame-02` | Inicio / Dashboard | Resumen del día, alertas de stock | _pendiente_ |
| `Frame-03` | Vender | Carrito de venta rápida | _pendiente_ |
| `Frame-04` | Vender — Detalle | Confirmación y cobro | _pendiente_ |
| `Frame-05` | Inventario | Lista de productos con stock | _pendiente_ |
| `Frame-06` | Inventario — Producto | Editar / crear producto | _pendiente_ |
| `Frame-07` | Fiados | Lista de clientes con saldo | _pendiente_ |
| `Frame-08` | Fiados — Cliente | Historial de pagos y abonos | _pendiente_ |
| `Frame-09` | Estados — Sin conexión | Pantalla offline | _pendiente_ |
| `Frame-10` | Tokens / Design System | Paleta de colores y tipografía | _pendiente_ |

## Tokens visuales a extraer

Una vez se tenga el frame de Design System, extraer:

- **Colores primarios**: verificar que `--color-primary-500` sea `#2d6a4f` o ajustar
- **Tipografía**: confirmar familia `Nunito` y pesos usados
- **Espaciados**: confirmar escala de 4px base
- **Radios de borde**: confirmar valores `sm / md / lg / xl`
- **Sombras**: levantar tokens de sombras si existen en Figma

## Próximos pasos

1. [ ] Compartir acceso al archivo Figma en este ticket
2. [ ] Completar la tabla de frames con URLs reales
3. [ ] Actualizar `src/styles/variables.css` con tokens definitivos
4. [ ] Hacer PR de `feat/tokens-figma` → `main`
