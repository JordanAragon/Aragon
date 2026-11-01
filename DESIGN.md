---
name: Aragon
description: Agencia de automatización e IA — agentes de IA, automatización y software a la medida, con prototipos en 48 horas
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
  signal: "#ff4d17"
  signal-ink: "#c4380c"
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

Aragon es una agencia de automatización e inteligencia artificial para negocios de Colombia y Estados Unidos: desarrollo agéntico (agentes de IA para WhatsApp), automatización de procesos y software a la medida sobre infraestructura web de alta velocidad, con prototipos en 48 horas (desde el 2026-10-26; antes incluía un servicio de servidores e infraestructura, que salió de la oferta). La identidad parte del portafolio de Jordan Aragon (monocromo, Inter y JetBrains Mono, ventanas de terminal, paleta ⌘K) y toma de AiDEN el nivel de ambición, no su forma: una web viva donde cada animación explica algo.

**Idea central: «poner en orden».** Las partículas son las piezas sueltas de un negocio (pedidos, datos, tareas). Desordenadas, flotan; cuando llega el software, encuentran su lugar en una retícula. Todo lo que se mueve en el sitio cuenta esa idea.

## Colors

- **Tinta y papel, más un solo color de señal** (desde el 2026-11-01, pedido de David con la referencia «VANTA//9»; antes, monocromo estricto). La jerarquía sigue saliendo del peso, el tamaño y la luz; la señal marca **lo resuelto y la acción principal**. Por el efecto de aislamiento (Von Restorff), lo único en color es lo que se recuerda: si la señal se usa en todas partes, deja de funcionar.
- Dónde va la señal: la palabra de marca detrás de la A del hero, las piezas que salen resueltas, el «+» de la acción principal, la «h» de 48 h y los pasos cumplidos de la precarga. En ningún otro lugar sin pasar por este archivo.
- `--signal` (#ff4d17) para formas, texto grande y texto sobre noche (5,96:1); `--signal-ink` (#c4380c) para texto pequeño sobre papel (4,91:1).
- **Noche** (`night`) para lo que se mueve y para las demos; **papel** (`paper`) para leer y para el hero, donde la A en tinta se lee como un objeto sobre la página. Las secciones alternan para marcar el ritmo.
- Cada sección declara su tono con `data-tone="night|paper"`; la cabecera lo lee y cambia de tono sola.
- Contraste: `on-night-3` (#828282) sobre noche y `ink-3` (#686866) sobre papel son el mínimo para texto (≥ 4,5:1).

## Typography

- **Inter Tight** para titulares: peso 600, interlineado 0,95–1,05, tracking negativo fuerte. Los titulares son grandes y cortos.
- **Inter** para texto, 16–19 px, líneas de 40–68 caracteres.
- **JetBrains Mono** solo para etiquetas de sección (en minúscula: «servicios», «cómo trabajamos»), datos, rutas y trazas. Nunca para párrafos.
- Escala en `base.css` (`--t-xs` a `--t-4xl`). No se inventan tamaños sueltos.
- Sin palabras resaltadas en otro color o itálica dentro de un titular.
- Excepción del hero: titular en mayúsculas, partido a lado y lado de la A («Del desorden» / «al sistema.»), y la palabra `ARAGON` en Inter Tight 800 a todo el ancho, en señal, detrás de la A.

## Marca

- Logotipo de la cabecera: `aragon` en Inter Tight 650 más un **cuadrado** sólido: la pieza ya ordenada. El cuadrado es la partícula del sitio.
- **Símbolo A** (`marca/logo/simbolo.svg` del sistema de marca, tres piezas: una negra y dos grises; trazos en `app/components/hero/symbol.ts`): es el centro del hero y de la precarga, hecho de cuadrados en retícula.
- El cuadrado también marca listas y señales (`.sign-mark`, viñetas de 5 px). No se usan emojis ni viñetas redondas.
- Favicon y `og:image` siguen la misma idea (`app/icon.svg`, `app/opengraph-image.tsx`).

## Motion

Regla: **nada se mueve por adorno.** Cada movimiento responde a una de estas preguntas: qué problema hay, qué hace el servicio o qué cambió tras una acción.

- **Precarga: el sistema se arma mientras carga** (solo al abrir `/`, sin ancla, sin movimiento reducido y una vez por sesión; `app/components/chrome/preloader.tsx`, idea tomada de saifullah.dev): sobre la noche, cuatro columnas nombran lo que carga de verdad (tipografías, piezas, página, sistema) y se marcan en señal al terminar; una cuenta grande va de 000 a 100 sin pasar nunca de lo que ya cargó. En el centro, la A de la marca —en el mismo lugar y tamaño que en el hero— se llena de cuadrados de abajo hacia arriba al ritmo de la carga. Al completarse, las columnas suben una tras otra y descubren el hero, donde la A ya está armada. Un clic o una tecla la saltan; se retira sola a los 6 s y el script a los 7 s si el JS no llega.
- **Hero: del desorden al sistema, con un punto central** (`app/components/hero/`; referencias del 2026-11-01: VANTA//9, vadimcarazan.com y la plantilla Solara de oxvo). Un solo foco en el centro, no una lectura en F: la A hecha de piezas en retícula, delante de `ARAGON` en señal, con una silueta en papel que la recorta y una mira (anillos, cruz, esquinas de registro y la regla del horizonte) que lleva la mirada a ella. Cada pocos segundos entra por la izquierda una tarea suelta (piezas grises que llegan dando tumbos, con su etiqueta: «mensaje de WhatsApp sin responder · 11:48 p. m.», «pedido anotado en un cuaderno»…); al tocar la A cambian de lugar con otras tantas piezas, que se encienden un instante y salen por la derecha en fila, en señal, con la etiqueta de la tarea resuelta. La leyenda lo dice: «cada pieza es una tarea · entra suelta / sale resuelta», con la cuenta de esta vista. Cada evento empieza de golpe porque el inicio de un movimiento atrae la mirada y un movimiento constante no; entre eventos la A queda quieta. El cursor aparta las piezas y vuelven. Al bajar, la A se abre desde su centro y se apaga. Sin precarga, las piezas llegan sueltas y se arman de izquierda a derecha. En el teléfono la A ocupa un hueco entre el titular y el texto (`.hero-a-slot`) y no salen etiquetas de entrada. Canvas 2D desde el primer cuadro; WebGPU (vgpu) en diferido, con regreso al Canvas 2D si falla.
- **«Del desorden al sistema»** (sticky, 4 paradas): las mismas piezas siguen a un pedido por *hoy* (sueltas), *responder* (conversación, agentes de IA), *conectar* (flujo, automatización) y *ordenar* (tabla, software a la medida). Termina en orden: es la idea central. Cada figura explica un servicio.
- **Demos vivas:** un agente que responde con traza medida de verdad (`performance.now()`), un flujo que se ejecuta con su registro y pedidos que avanzan de estado.
- **Texto que se enciende con la lectura** (el problema) y **línea del proceso** que se llena con el scroll.
- Cinta de herramientas inclinada cuya velocidad sigue al scroll.
- **Trabajo:** una ventana (barra con la dirección del proyecto y `01/03`) sigue al cursor, se inclina con la velocidad y se voltea cerca del borde; al pasar de una fila a otra, las **capturas reales** corren como un carrete y la que llega se asienta. Las demás filas bajan la voz, el título rueda y una regla se traza bajo la fila activa. Capturas en `public/media/trabajo/`: portada de AiDEN, portada del portafolio de Leidy y btop de Aragon-Server (con las IP privadas ocultas). En táctil, la captura va dentro de la fila.
- **Pie:** la palabra `aragon■` hecha de piezas se arma al aparecer (la misma retícula de la precarga); el cursor las aparta y vuelven a su lugar.
- **Revelados** (`interactions.tsx`): titulares que suben y se enfocan, reglas de sección que se trazan y listas que entran escalonadas. Solo se esconde lo que está debajo de la pantalla al cargar; nada sin JS ni con movimiento reducido.
- **Navegación completa desde la barra** (para quien no hace scroll): Servicios y Trabajo abren un solo panel que cambia de tamaño y de contenido entre ambos, los dos en tres columnas (cada servicio con su figura viva, `service-glyph.tsx`; cada proyecto con su captura). Se abre al pasar el cursor con un instante de espera, con clic o con ↓; Esc lo cierra y devuelve el foco. El menú móvil cuenta la historia en capítulos numerados con los servicios y los proyectos dentro.
- **Capítulos** (`chapters` en `app/data/site.ts`): el mismo orden del inicio. Cada página interna termina con el capítulo siguiente (`next-chapter.tsx`) y una regla de piezas que dice en qué parte de la historia vas. `/servicios` lleva el recorrido «Del desorden al sistema» completo.
- **Aperturas vivas** (`intro-field.tsx`): en cada página interna las piezas llegan sueltas y se ordenan, en retícula, en la figura de su tema (las tres figuras de los servicios, las cuatro fases, las ventanas de los proyectos, una sola pieza grande, el signo de pregunta, o la figura de cada servicio).
- **Entre páginas** (`app/template.tsx`): la página nueva sube y se enfoca; la primera carga no.
- **Indicadores que viajan:** la pastilla de la navegación y la de las pestañas de las demos se deslizan a su destino. La cabecera se aparta al bajar leyendo y vuelve al subir.
- Duraciones: `--dur-fast` 140 ms, `--dur` 240 ms, `--dur-slow` 520 ms. Curvas `--ease-out` y `--ease-in-out`.
- Con `prefers-reduced-motion`: sin precarga ni bucles, la A del hero queda armada y quieta, las figuras quedan en su lugar (la marca del pie, ya armada) y el recorrido sticky se vuelve una lista.

## El motor de partículas

`app/components/field/`:

- `sim.ts`: simulación en CPU (resortes hacia destinos, retícula bajo el cursor, «updaters» para figuras que se mueven).
- `shapes.ts`: figuras y medidas compartidas con las etiquetas HTML.
- `render-gpu.ts`: **vgpu** (Vercel Labs, MIT) sobre WebGPU, una llamada instanciada leyendo un buffer de almacenamiento. Se carga en diferido y solo con WebGPU (ni con ahorro de datos ni en 2G/3G).
- `wordmark.ts`: la palabra de marca medida sobre una retícula (el pie). `relay.ts`: queda del relevo anterior entre precarga y campo; el hero nuevo tiene su propio motor.
- El hero usa su propio motor (`app/components/hero/engine.ts`, `render.ts` con paleta de cuatro colores y `symbol.ts`), con el mismo esquema: Canvas 2D primero y vgpu después.
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
- No agregar más colores de acento que la señal, ni degradados de color ni sombras de colores.
- No usar rótulos en mayúsculas encima de los titulares, ni numeraciones que no sean una secuencia real (el proceso sí lo es).
- No copiar código de librerías con licencia restrictiva (Aceternity, Skiper de pago): se reescriben las técnicas.

## Pendiente

- Fotografías editoriales en blanco y negro generadas con ElevenLabs (problema, software, agentes, estudio): están en los flujos de ElevenLabs y no se pudieron descargar desde la sesión. Al tenerlas en `public/media/`, entran en el detalle de servicios y en Nosotros.
