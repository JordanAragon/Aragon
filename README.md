# Aragon

Sitio web de Aragon, agencia de automatización e inteligencia artificial: desarrollo agéntico (agentes de IA para WhatsApp), automatización de procesos y software a la medida sobre infraestructura web de alta velocidad, con prototipos en 48 horas. Cali, Colombia.

## Stack

- Next.js 16 (App Router), React 19, TypeScript.
- CSS propio por capas (`app/styles/`): base, cromo, inicio, páginas y demos.
- Tipografías auto-alojadas (Inter Tight, Inter, JetBrains Mono; SIL OFL) con `next/font/local`.
- Campo de partículas propio (`app/components/field/`): simulación en CPU, render con [vgpu](https://vgpu.sh) (WebGPU, MIT) y respaldo en Canvas 2D.

## Páginas

| Ruta | Qué es |
|---|---|
| `/` | Inicio: precarga «poner en orden», hero, el problema, «Del desorden al sistema», servicios con demos, proceso, trabajo, nosotros, preguntas y contacto |
| `/servicios` y `/servicios/<slug>` | Los tres servicios (agentes de IA, automatización y software a la medida), cada uno con demo, señales, ejemplos, qué incluye y preguntas. `/servicios/infraestructura` redirige a `/servicios` |
| `/como-trabajamos` | Las cuatro fases (con el prototipo en 48 horas) y lo que pones y recibes en cada una |
| `/trabajo` y `/trabajo/<slug>` | Proyectos reales con su estado y su captura (`/work/<slug>` redirige aquí) |
| `/nosotros` | Historia, principios y servicios |
| `/preguntas` | Preguntas frecuentes con búsqueda y temas |
| `/contacto` | Agenda (Cal.com) y formulario que arma el mensaje |
| `/privacidad` | Tratamiento de datos (Ley 1581 de 2012) |

El contenido vive en `app/data/` (servicios, proceso, preguntas, trabajo y datos del sitio). La identidad visual está en `DESIGN.md`; el producto, en `PRODUCT.md`.

## Scripts

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # lint + typecheck + build
```

## Configuración

`NEXT_PUBLIC_SITE_URL` define la URL canónica; sin ella se usa https://aragon-two.vercel.app.
