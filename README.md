# Aragon

Sitio web de Aragon, la identidad digital de Jordan Aragon para diseño y desarrollo de experiencias digitales, software y sistemas.

## Dirección actual

La versión V9 es una dirección editorial propia: papel cálido, tinta, un único acento óxido, tipografía de gran escala, reglas como estructura y evidencia visual explícita. La página prioriza problema → sistema → qué construimos → trabajo real → proceso → estudio → exploraciones → contacto.

La dirección queda documentada en DESIGN.md. Los principios se inspiran en la investigación del Brain sobre diseño editorial, storytelling, navegación, microinteracciones y conversión, sin clonar identidades externas.

## Stack

- Next.js 16.3.5
- React 19.3
- TypeScript
- Motion 13.4
- GSAP 3.15
- CSS propio

## Arquitectura

La homepage mantiene Server Components para contenido estático y Client Components pequeños para interacción: navegación, preloader, hero, progreso, narrativa de sistema, trabajo seleccionado, agenda y formulario.

La sección System utiliza Canvas Crowd con una sprite sheet local 15 × 7. El Canvas limita DPR a 2, observa viewport, pausa el ticker de GSAP fuera de pantalla y respeta prefers-reduced-motion.

Selected Work contiene solamente trabajo real documentable: AiDEN y Aragon Server. Sus visuales son reconstrucciones editoriales explícitamente marcadas como abstractas; no se presentan como capturas reales.

Lab contiene conceptos en desarrollo con visuales de muestra. No se presentan como productos lanzados, clientes ni resultados comerciales.

## Contacto

Cal.com sigue siendo la vía principal de agenda. El formulario prepara un correo en el cliente del usuario; no se afirma que exista un backend de envío.

## SEO

La URL canónica utiliza NEXT_PUBLIC_SITE_URL o el fallback de producción. El sitemap incluye la homepage y los case studies.

## Calidad

Scripts disponibles:

npm install
npm run dev
npm run build
npm run typecheck
npm run lint

La verificación final requiere comprobar 375, 768 y 1440 px, consola limpia, reduced motion, navegación por teclado, formulario, agenda y ambos case studies.

## Estado

El despliegue se realiza mediante Git integration de Vercel desde main. Las revisiones de diseño se trabajan en ramas y se integran mediante pull request.

