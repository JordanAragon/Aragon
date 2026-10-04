# Aragon — Design System (MASTER)

Fuente de verdad visual del sitio de Aragon. **Extraído del código existente** (commit `8205e1c`, 2026-10-04), no generado: describe la identidad que ya tiene el sitio.

Regla de prioridad para cualquier IA o skill de diseño (incluida `ui-ux-pro-max`):

1. Este archivo y, si existe, `pages/<página>.md` (sobrescribe a este).
2. Preferencias de diseño de David (brain David-AI, `knowledge/diseno/preferencias-de-diseno.md`).
3. Recomendaciones de `ui-ux-pro-max`: solo como checklist de UX y accesibilidad y guía del stack. **No** se aplican sus paletas, tipografías ni estilos sobre esta identidad.

Si una mejora exige cambiar algo de aquí, se propone a David y este archivo se actualiza en el mismo cambio.

## Dirección

Editorial y cinematográfica: monocromo cálido, tipografía de display grande con tracking cerrado, narrativa guiada por scroll (escena sticky en el Hero, secciones narrativas, multitud en canvas). La identidad de Aragon domina antes que el mensaje.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Motion y GSAP para animación, CSS propio en `app/globals.css` y `app/premium.css` (sin Tailwind). Componentes de Skiper UI con atribución en el cierre.

## Tipografía

- Display y cuerpo: `Arial, Helvetica, sans-serif` (tokens `--display` y `--body`). Neutralidad suiza: la personalidad viene de escala, tracking y composición, no de la fuente.
- Display: tracking `--v8-display-track: -.065em`.
- Cuerpo legible: `--v8-readable-body: 15px`, interlineado `--v8-readable-leading: 1.72`.

## Color

Tokens en `:root` de `app/globals.css` (y `--premium-*` en `app/premium.css`).

| Token | Valor | Uso |
|---|---|---|
| `--bg` / `--premium-paper` | `#f4f4f0` | Fondo marfil |
| `--paper` | `#e9e8e3` | Superficie |
| `--paper-2` | `#d9d8d1` | Superficie secundaria |
| `--ink` / `--premium-black` | `#080809` | Texto y secciones oscuras |
| `--ink-2` | `#151518` | Tinta secundaria |
| `--muted` | `#6d6d73` | Texto secundario |
| `--soft` | `#a1a1a6` | Texto terciario |
| `--line` | `#c4c3bd` | Líneas sobre claro |
| `--dark-line` | `#303035` | Líneas sobre oscuro |
| `--accent` | `#b8b7b0` | Acento neutro |

Sin colores saturados: el contraste lo dan marfil y tinta. Selección de texto: fondo tinta, texto blanco.

## Layout y movimiento

- Contenedor: `--shell: min(1440px, calc(100vw - 64px))`.
- Curva de animación: `--ease: cubic-bezier(.16, 1, .3, 1)`.
- Toda animación respeta `prefers-reduced-motion`; las capas no activas no dejan controles enfocables.

## Accesibilidad

- Foco visible: `outline: 2px solid currentColor; outline-offset: 5px`.
- Contraste mínimo 4.5:1 en texto de lectura, también sobre `--muted`.
- El formulario de contacto superpuesto debe ser corto y accesible por teclado.

## Evitar

- Introducir color de marca, gradientes o fuentes decorativas sin aprobación de David.
- Plantillas genéricas de landing SaaS; la estructura sigue la narrativa del sitio.
- Afirmar clientes o productos lanzados que no existen (la sección Lab son conceptos).
