# Aragon

Sitio web de Aragon, un estudio de software y tecnología que diseña y construye experiencias digitales, productos y sistemas alrededor de problemas reales.

## Stack

- Next.js 16.3.5
- React 19.3
- TypeScript
- Motion 13.4
- GSAP 3.15
- CSS propio

## Arquitectura V8

La homepage sigue una narrativa deliberada:

01 — Hero / qué es Aragon
02 — Problem / qué está fallando
03 — System / cómo conecta las piezas
04 — What We Build / qué construye
05 — Selected Work / evidencia real
06 — Process / cómo trabaja
07 — About Aragon / relación con el fundador
08 — Lab / exploraciones
09 — Contact / acción

Aragon es la entidad principal de la experiencia. Jordan David Aragon aparece como fundador, software developer y builder, con un enlace independiente hacia su portfolio personal.

La sección System conserva el Crowd Canvas de Skiper/Open Peeps como recurso narrativo, pero con un presupuesto de scroll reducido para que la interacción apoye la explicación y no compita con el contenido.

Selected Work sólo contiene trabajo que puede describirse como construido u operado. Las exploraciones conceptuales permanecen separadas en Lab y se etiquetan como desarrollo, concepto o dirección propuesta.

Los casos de trabajo viven bajo `/work/[slug]` y documentan contexto, sistema, stack y estado sin inventar métricas comerciales.

## Contacto

La agenda mantiene Cal.com como vía principal y un formulario de correo como alternativa contextual. El formulario prepara un mensaje en el cliente de correo del visitante, sin fingir que existe un backend de envío.

## Configuración pública

La URL canónica usa `NEXT_PUBLIC_SITE_URL` cuando está definida. El fallback actual es `https://aragon-two.vercel.app`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
```

Abrir `http://localhost:3000`.

## QA

Cada cambio relevante debe pasar `npm run build`, que ejecuta ESLint, TypeScript y el build de Next.js. La validación final debe incluir navegación, storytelling de scroll, preloader, reduced motion, teclado, responsive, agenda Cal.com, formulario de contacto y rutas de casos.

La implementación de producción debe verificarse también visualmente en navegador en desktop y mobile.
