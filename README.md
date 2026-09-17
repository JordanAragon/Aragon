# Aragon

Sitio web de Aragon, la identidad digital de Jordan Aragon para diseño y desarrollo de experiencias digitales, software y sistemas.

## Stack

- Next.js 16.3.5
- React 19.3
- TypeScript
- Motion 13.4
- CSS propio

## Arquitectura

La homepage utiliza Server Components para el contenido estático y Client Components pequeños para las partes que necesitan interacción: navegación, preloader, hero, progreso de scroll, reveals tipográficos, project story y agenda.

La sección Lab conserva un storytelling guiado por scroll: cuatro conceptos atraviesan una escena persistente con transiciones de imagen, dirección de movimiento, progreso continuo y controles manuales accesibles. Los proyectos de `app/data/projects.ts` que aparecen en la sección Lab son conceptos en desarrollo. Las etiquetas de stack indican dirección técnica o de producto propuesta y no deben interpretarse como productos lanzados o clientes reales.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
```

Abrir `http://localhost:3000`.

## Configuración pública

La URL canónica utiliza `NEXT_PUBLIC_SITE_URL` cuando está disponible. Sin esa variable, el fallback actual apunta al alias público del proyecto `aragon-jordanaragons-projects.vercel.app` hasta que el dominio principal de Aragon quede enlazado al proyecto correcto.

## Cal.com

La agenda se carga únicamente cuando la sección se acerca al viewport. Si el embed no puede cargarse, se conserva un enlace directo a Cal.com como fallback.

## Contenido y privacidad

No se utilizan métricas ficticias como resultados reales. Los mockups conceptuales usan estados o datos de muestra. La visual pública de infraestructura no expone datos operacionales del servidor personal.

## QA de producción

Cada cambio relevante debe pasar `npm run build`, que ejecuta ESLint, TypeScript y el build de Next.js antes de considerarse listo para producción. La verificación final debe incluir navegación, storytelling por scroll, preloader, reduced motion, teclado, responsive y agenda Cal.com.
