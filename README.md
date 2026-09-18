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

El Hero utiliza una única escena sticky. Primero presenta la identidad de Aragon como elemento dominante y después introduce el mensaje, la vista de producto y las fases narrativas mediante scroll. Las capas ocultas no dejan controles enfocables fuera de su momento de interacción.

La sección de contexto (#contexto) integra una adaptación local de Skiper UI 39 / Crowd Canvas. El renderer usa el sprite local, ciclos de caminata en GSAP, dirección aleatoria por ciclo, movimiento vertical, ordenamiento por profundidad, reutilización de personajes, ResizeObserver, DPR limitado a 2 y pausa cuando la escena no está visible.

La multitud no cambia de dirección de forma global por scroll. El scroll controla la composición narrativa de la escena: entrada, escala, desplazamiento, opacidad y salida del grupo. Esto conserva el comportamiento natural del Crowd Canvas mientras conecta el movimiento con la historia de Aragon.

La sección Lab conserva cuatro conceptos en desarrollo. Las etiquetas de stack indican dirección técnica o de producto propuesta y no deben interpretarse como productos lanzados o clientes reales.

## Contacto y perfiles

La agenda mantiene Cal.com como vía de conversación directa y añade una alternativa ligera por correo electrónico con asunto contextual cuando se ha seleccionado un concepto.

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

El proyecto evita precargar assets que no participan en la experiencia inicial. El Canvas se detiene fuera de viewport y en prefers-reduced-motion usa una composición estática. El resize del bitmap ocurre solo cuando cambian dimensiones o DPR.

No se añaden dependencias nuevas para el pass de experiencia.

## QA

Cada cambio relevante debe pasar npm run build, que ejecuta ESLint, TypeScript y el build de Next.js. La validación final debe incluir navegación, scroll storytelling, preloader, reduced motion, teclado, responsive, agenda Cal.com y la ruta de correo alternativa.

La implementación actual requiere verificación visual real en navegador para revisar composición y microinteracciones en desktop y mobile.