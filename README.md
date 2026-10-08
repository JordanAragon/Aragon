# Aragon

Sitio web de Aragon, la identidad digital de Jordan Aragon para diseño y desarrollo de experiencias digitales, software y sistemas.

## Dirección actual

La homepage funciona como una experiencia editorial de estudio: lienzo cálido, tipografía display serif, sans para lectura y mono para metadatos, líneas finas y un único color de señal. La jerarquía prioriza problema → sistema → construcción → evidencia → proceso → contacto.

La dirección visual es propia. Se toman principios de referencias editoriales y de producto —ritmo, contención, tipografía y precisión de sistema— sin clonar una identidad externa. El sitio mantiene una separación clara entre trabajo construido y exploraciones del Lab.

## Stack

- Next.js 16.3.5
- React 19.3
- TypeScript
- Motion 13.4
- GSAP 3.15
- CSS propio

## Arquitectura

La homepage mantiene Server Components para contenido estático y Client Components pequeños para interacción. El scroll del Hero, la narrativa del Sistema y los títulos editoriales usan Motion/GSAP solo donde aportan ritmo.

La sección Sistema conserva la adaptación de Skiper Canvas Crowd, pero usa un sprite SVG local y un ciclo de vida seguro: DPR máximo de 2, ResizeObserver, IntersectionObserver, pausa cuando la pestaña o la escena no están activas y una composición estática con prefers-reduced-motion.

Selected Work muestra dos sistemas reales con paneles de evidencia construidos a partir de datos del proyecto. No se presentan screenshots ficticios, métricas comerciales inventadas ni resultados no demostrados.

## Contacto

Cal.com se carga cuando la agenda entra en proximidad del viewport. Si no puede inicializarse, la interfaz ofrece el enlace directo de reserva. El formulario superpuesto prepara un correo mailto: sin pretender disponer de un backend propio.

## Configuración pública

NEXT_PUBLIC_SITE_URL define la URL canónica. El fallback actual es https://aragons.vercel.app.

## Calidad

Scripts disponibles:

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
```

La validación esperada incluye build, lint, TypeScript, reduced-motion, teclado, responsive en 375/768/1440, preloader, storytelling, contacto, agenda y las rutas de casos.

## Nota de mantenimiento

La hoja visual debe mantener una única fuente de verdad. Cuando una nueva dirección sustituya una iteración anterior, elimina los selectores históricos en lugar de acumular overrides.