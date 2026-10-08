---
name: Aragon V9
version: 1
status: active
approved: 2026-10-08
---

# Aragon — Dirección visual V9

## Idea central

Aragon se presenta como un estudio pequeño de software y tecnología que trabaja desde el problema hasta el sistema.

La interfaz debe sentirse editorial, precisa y tecnológica sin parecer una plantilla SaaS. La calidad proviene de jerarquía, espacio, tipografía, evidencia y movimiento con propósito.

## Referencias de composición

La dirección combina tres principios ya definidos en el Brain:

- Editorial: jerarquía tipográfica fuerte, ritmo y lectura por capítulos.
- Técnico: reglas, índices, mapas y densidad controlada.
- Humanista: papel cálido, contraste con tinta y un único acento óxido.

No se copian logotipos, fuentes propietarias, composiciones ni paletas identificables de terceros.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| paper | #F3F0EA | Fondo principal |
| paper-2 | #EBE7DF | Variación de fondo |
| ink | #0A0A0B | Texto y escenas oscuras |
| ink-2 | #171719 | Superficies oscuras |
| muted | #68676B | Texto secundario |
| line | rgba(10,10,11,.14) | Reglas claras |
| dark-line | rgba(243,240,234,.14) | Reglas oscuras |
| accent | #9C5845 | Único acento |

El acento no se usa para decorar cada elemento. Debe funcionar como señal de énfasis, estado o dirección.

## Tipografía

Display: sans del sistema, pesada, grande, compacta y con tracking negativo moderado.

Énfasis: serif del sistema solo para palabras o frases cortas.

Body: sans legible, normalmente 14–16 px, con interlineado generoso.

No se usan cuerpos inferiores a 13 px para contenido de lectura.

## Composición

- Shell máximo cercano a 1440 px.
- Márgenes generosos en desktop.
- Una columna narrativa fuerte antes de introducir listas.
- Reglas horizontales como estructura, no como decoración.
- Las secciones cambian de fondo para marcar ritmo.
- No usar tarjetas redondeadas como patrón general.
- Los elementos de interfaz deben tener pocos radios y solo cuando ayudan a agrupar.

## Movimiento

La animación debe explicar una transición, crear ritmo o dirigir atención.

- Hero: entrada secuencial y transformación del wordmark.
- Headings: revelado por palabra.
- System: cuatro estados narrativos controlados por scroll.
- Crowd: movimiento independiente del scroll; representa actividad.
- Hover: desplazamientos pequeños, no saltos.
- Reduced motion: contenido completo, sin movimiento continuo.

## Evidencia

Selected Work solo contiene trabajo real.

Los visuales de los casos pueden ser:
- capturas reales;
- mapas o reconstrucciones editoriales basadas en hechos;
- diagramas de arquitectura;
- visualizaciones explícitamente marcadas como abstractas.

Nunca se presenta una maqueta como captura real.

## Exploraciones

Lab contiene conceptos y exploraciones en desarrollo. Los visuales deben usar datos de muestra y mantener una etiqueta clara de concepto.

## Responsive

Breakpoints de trabajo:
- desktop: > 980
- tablet: 781–980
- mobile: <= 780
- small mobile: <= 520

Mobile no es una versión comprimida de desktop. Se redibuja la jerarquía, se reducen columnas, se eliminan elementos auxiliares cuando no aportan y se mantienen tamaños de lectura cómodos.

## Accesibilidad

- Contraste AA como mínimo para texto.
- Focus visible.
- Navegación por teclado.
- Skip link.
- Diálogos con focus trap.
- Canvas decorativo con aria-hidden.
- prefers-reduced-motion debe eliminar movimiento continuo y mantener el contenido accesible.

## Regla de calidad

No añadir un efecto si el mismo objetivo puede conseguirse con composición, tipografía, espacio o evidencia.