# Aragon

Sitio web de Aragon, la identidad digital de Jordan Aragon para diseño y desarrollo de experiencias digitales, software y sistemas.

## Stack

- Next.js 16.3.5
- React 19.3
- TypeScript
- Motion 13.4
- GSAP 3.15
- CSS propio

## Arquitectura

La homepage mantiene Server Components para el contenido estático y Client Components pequeños para las partes que necesitan interacción: navegación, preloader, hero, progreso de scroll, escenas narrativas, project story y agenda.

El Hero utiliza una única escena sticky. El preloader dispara el evento de entrada de forma explícita y, a partir de ahí, la identidad de Aragon aparece como elemento dominante antes de revelar el mensaje y la vista de producto. El scroll transforma esa presencia en contenido sin competir con múltiples bloques simultáneos. Las capas no activas no dejan controles enfocables durante la entrada.

La sección de contexto (#contexto) integra el comportamiento de Skiper UI 39 / Crowd Canvas con la misma sprite sheet Open Peeps de la implementación original (15 filas × 7 columnas), ciclos de caminata en GSAP, dirección aleatoria por ciclo, movimiento vertical, ordenamiento por profundidad, reutilización de personajes y resize responsive. El canvas se mantiene visualmente independiente de los transforms del storytelling para conservar el movimiento original; el scroll controla únicamente la secuencia de los textos.

La referencia de implementación de Skiper indica que el componente utiliza HTML5 Canvas + GSAP y una sprite sheet de personajes; además, la versión gratuita requiere atribución a Skiper UI. La página de Aragon deja esa atribución en el cierre.

La sección Lab conserva cuatro conceptos en desarrollo. Las etiquetas de stack indican dirección técnica o de producto propuesta y no deben interpretarse como productos lanzados o clientes reales.

## Contacto y perfiles

La agenda mantiene Cal.com como vía de conversación directa y añade una alternativa de contacto en contexto: los CTA del header, Hero, agenda y footer pueden abrir el mismo formulario superpuesto, corto y accesible. Al enviarlo se prepara un correo con el contexto del proyecto, sin inventar un backend ni un servicio de envío adicional.

El footer centraliza GitHub, LinkedIn, Instagram y el portafolio personal. No se añade un enlace de Facebook sin una URL pública verificada para evitar apuntar a un perfil incorrecto.

## Configuración pública

La URL canónica utiliza NEXT_PUBLIC_SITE_URL cuando está disponible. Sin esa variable, el fallback actual apunta a https://aragon-two.vercel.app.

## Scripts

npm install
npm run dev
npm run build
npm run typecheck
npm run lint

Abrir http://localhost:3000.

## Calidad y rendimiento

El proyecto evita precargar assets que no participan en la experiencia inicial. El Canvas detiene el GSAP ticker fuera de viewport y en prefers-reduced-motion usa una composición estática. El resize del bitmap ocurre solo cuando cambian dimensiones o DPR, con DPR máximo de 2.

No se añaden dependencias nuevas para el pass de experiencia.

## QA

Cada cambio relevante debe pasar npm run build, que ejecuta ESLint, TypeScript y el build de Next.js. La validación final debe incluir navegación, scroll storytelling, preloader, reduced motion, teclado, responsive, agenda Cal.com y la ruta de correo alternativa.

La implementación actual requiere verificación visual real en navegador para revisar composición y microinteracciones en desktop y mobile.

## V7 — Stable baseline

This commit preserves the V7 cinematic hierarchy pass as the deployment baseline. Future visual changes should be incremental and should not replace the established homepage architecture without explicit review.

V8 rebuild validated through a dedicated preview before production promotion.
