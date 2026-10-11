---
name: Aragon
description: Agencia de software a la medida — apps web, automatización, agentes de IA e infraestructura
colors:
  night: "#0a0a0a"
  night-2: "#111111"
  night-3: "#181818"
  night-line: "#242424"
  night-line-2: "#353535"
  on-night: "#ffffff"
  on-night-2: "#b3b3b3"
  on-night-3: "#828282"
  paper: "#f5f5f4"
  sheet: "#ffffff"
  line: "#e1e1df"
  line-2: "#c6c6c3"
  ink: "#0a0a0a"
  ink-2: "#454545"
  ink-3: "#686866"
typography:
  display:
    fontFamily: "Inter Tight (auto-alojada, app/fonts)"
    fontWeight: 600
    letterSpacing: "-0.035em a -0.055em"
  body:
    fontFamily: "Inter (auto-alojada)"
    fontWeight: 400
  mono:
    fontFamily: "JetBrains Mono (auto-alojada)"
    use: "etiquetas de sección, datos, rutas, trazas"
rounded:
  s: "6px"
  base: "10px"
  l: "16px"
  pill: "999px"
---

# Design System: Aragon

Fuente de verdad visual de Aragon. Aprobada por David el 2026-10-11 al pedir que el rediseño se construyera directamente en el repo. Los tokens viven en `app/styles/base.css`; este archivo explica cómo usarlos.

## Overview

Aragon es una agencia de software a la medida (apps web, automatización, agentes de IA e infraestructura). La identidad parte del portafolio de Jordan Aragon (monocromo, Inter y JetBrains Mono, ventanas de terminal, paleta ⌘K) y toma de AiDEN el nivel de ambición, no su forma: una web viva donde cada animación explica algo.

**Idea central: «poner en orden».** Las partículas son las piezas sueltas de un negocio (pedidos, datos, tareas). Desordenadas, flotan; cuando llega el software, encuentran su lugar en una retícula. Todo lo que se mueve en el sitio cuenta esa idea.

## Colors

- Monocromo estricto. **Sin color de acento.** La jerarquía sale del peso, el tamaño y la luz (blanco sobre noche).
- **Noche** (`night`) para lo que se mueve y para las demos; **papel** (`paper`) para leer: proceso, nosotros, preguntas, bandas finales. Las secciones alternan para marcar el ritmo.
- Cada sección declara su tono con `data-tone="night|paper"`; la cabecera lo lee y cambia de tono sola.
- Contraste: `on-night-3` (#828282) sobre noche y `ink-3` (#686866) sobre papel son el mínimo para texto (≥ 4,5:1).

## Typography

- **Inter Tight** para titulares: peso 600, interlineado 0,95–1,05, tracking negativo fuerte. Los titulares son grandes y cortos.
- **Inter** para texto, 16–19 px, líneas de 40–68 caracteres.
- **JetBrains Mono** solo para etiquetas de sección (en minúscula: «servicios», «cómo trabajamos»), datos, rutas y trazas. Nunca para párrafos.
- Escala en `base.css` (`--t-xs` a `--t-4xl`). No se inventan tamaños sueltos.
- Sin palabras resaltadas en otro color o itálica dentro de un titular. La única excepción es la **palabra que rota** del hero, que es un bloque invertido (papel sobre noche) porque es la pieza que cambia.

## Marca

- Logotipo: `aragon` en Inter Tight 650 más un **cuadrado** sólido: la pieza ya ordenada. El cuadrado es la partícula del sitio.
- El cuadrado también marca listas y señales (`.sign-mark`, viñetas de 5 px). No se usan emojis ni viñetas redondas.
- Favicon y `og:image` siguen la misma idea (`app/icon.svg`, `app/opengraph-image.tsx`).

## Motion

Regla: **nada se mueve por adorno.** Cada movimiento responde a una de estas preguntas: qué problema hay, qué hace el servicio o qué cambió tras una acción.

- **Hero:** el campo de partículas barre de derecha a izquierda; a la derecha las piezas ya forman una interfaz (barra lateral, cabecera, tarjetas, filas). El cursor ordena lo que toca.
- **«Del desorden al sistema»** (sticky, 5 paradas): las mismas piezas pasan por *hoy* (sueltas), *ordenar* (tabla, apps web), *conectar* (flujo, automatización), *responder* (conversación, agentes) y *vigilar* (latidos, infraestructura). Cada figura explica un servicio.
- **Demos vivas:** pedidos que avanzan de estado, un flujo que se ejecuta con su registro, un agente que responde con traza medida de verdad (`performance.now()`), servidores con latido.
- **Texto que se enciende con la lectura** (el problema) y **línea del proceso** que se llena con el scroll.
- Cinta de herramientas inclinada cuya velocidad sigue al scroll; vista del proyecto que sigue al cursor en Trabajo.
- Duraciones: `--dur-fast` 140 ms, `--dur` 240 ms, `--dur-slow` 520 ms. Curvas `--ease-out` y `--ease-in-out`.
- Con `prefers-reduced-motion`: sin bucles, las figuras quedan quietas en su lugar y el recorrido sticky se vuelve una lista.

## El motor de partículas

`app/components/field/`:

- `sim.ts`: simulación en CPU (resortes hacia destinos, retícula bajo el cursor, «updaters» para figuras que se mueven).
- `shapes.ts`: figuras y medidas compartidas con las etiquetas HTML.
- `render-gpu.ts`: **vgpu** (Vercel Labs, MIT) sobre WebGPU, una llamada instanciada leyendo un buffer de almacenamiento. Se carga en diferido y solo con WebGPU (ni con ahorro de datos ni en 2G/3G).
- `render-canvas.ts`: respaldo en Canvas 2D. Se usa desde el primer cuadro y cuando WebGPU falla en cualquier momento.
- Los lienzos se pausan fuera de pantalla (IntersectionObserver) y usan menos de la mitad de las piezas en teléfonos.

## Layout

- Contenedor `.shell` (1320 px + márgenes `--gutter`). Secciones con `padding-block` en `clamp`.
- Etiqueta de sección (`.section-label`): nombre en mono minúscula con una regla que llega al borde.
- Retícula visible en las aperturas de páginas internas (`.page-intro-grid`): el plano sobre el que se mide.
- Cabecera en cápsula flotante con progreso de lectura; menú a pantalla completa bajo 1080 px.

## Components

- Botones (`.btn`, `.btn-primary`, `.btn-ghost`, tamaños `-sm` y `-lg`) en píldora, con luz bajo el cursor.
- `.text-link` para acciones secundarias, siempre con flecha.
- Ventanas (`.window`) para demos: barra con puntos y título en mono.
- Acordeón con `<details>` (funciona sin JavaScript).
- Paleta ⌘K con páginas, servicios, trabajo, preguntas y acciones.
- Formulario de contacto sin servidor: arma un resumen y lo envía por WhatsApp o correo, o lo copia.

## Do's and Don'ts

**Do:**

- Escribir en español claro, con «tú», sin frases de relleno.
- Usar solo trabajo real; lo que está en desarrollo se dice así. Las demos llevan «datos de ejemplo».
- Explicar con la animación: si no explica nada, no va.

**Don't:**

- No inventar clientes, cifras, testimonios ni años.
- No agregar colores de acento, degradados de color ni sombras de colores.
- No usar rótulos en mayúsculas encima de los titulares, ni numeraciones que no sean una secuencia real (el proceso sí lo es).
- No copiar código de librerías con licencia restrictiva (Aceternity, Skiper de pago): se reescriben las técnicas.

## Pendiente

- Fotografías editoriales en blanco y negro generadas con ElevenLabs (problema, apps web, agentes, servidor, estudio): están en los flujos de ElevenLabs y no se pudieron descargar desde la sesión. Al tenerlas en `public/media/`, entran en el detalle de servicios y en Nosotros.
- Capturas reales de los proyectos (hoy son ilustraciones en código).
