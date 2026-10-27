# Product

<!-- impeccable:product-schema 1 -->

Escrito el 2026-10-04 y actualizado el 2026-10-11 y el 2026-10-26 a partir de confirmaciones directas de David registradas en su brain (David-AI, `brain/proyectos/aragon.md`) y de lo que hay en este repo. Lo no confirmado queda como decisión abierta.

## Platform

web

## Users

Negocios que quieren eliminar procesos manuales y escalar su operación: agentes de IA (sobre todo en WhatsApp), automatización de procesos o software a la medida (David, 2026-10-26; antes, 2026-10-11, incluía infraestructura). El público concreto (tamaño, sector) sigue abierto; el sitio habla a negocios que crecieron con WhatsApp, libretas y hojas de cálculo.

## Product Purpose

Aragon es una **agencia de automatización e inteligencia artificial** que se especializa en desarrollo agéntico, creación de software personalizado e infraestructura web de alta velocidad para eliminar procesos manuales y escalar operaciones sin fricción (David, 2026-10-26). Los servicios del sitio son tres, con la IA primero: desarrollo agéntico (agentes de IA, con agentes conversacionales de WhatsApp), automatización de procesos y software a la medida (que incluye la infraestructura web de alta velocidad). El servicio de servidores e infraestructura salió de la oferta el 2026-10-26. Es el sello de Jordan Aragon para productos y servicios; el portafolio personal es otro sitio (decisión de marca del 2026-10-11 en el brain). El sitio busca abrir conversaciones de trabajo: agenda con Cal.com y formulario de contacto.

**Rediseño (2026-10-11):** David pidió una web completa (servicios, cómo trabajamos, nosotros, preguntas, contacto), muy atractiva y «viva» como AiDEN pero con identidad propia, donde cada animación explique algo, con la paleta y la tipografía del portafolio como base. La dirección visual está en `DESIGN.md`.

## Positioning

Confirmado (David, 2026-10-26): la propuesta de valor se centra en **prototipos rápidos en 48 horas**, contadas desde que se aprueba el alcance, integrando agentes conversacionales de WhatsApp, entre otros. El sitio lo dice así: «Aprobado el alcance, ves un prototipo funcionando en 48 horas».

Pendiente de confirmar, el sitio también propone: equipo pequeño donde quien diseña construye y mantiene; diagnóstico antes de construir; código y accesos a nombre del cliente; trabajo real sin cifras inventadas.

## Operating Context

- Contacto: Cal.com para agendar una llamada de 30 minutos y un formulario que arma un resumen y lo envía por WhatsApp o correo (sin servidor propio).
- Perfiles enlazados: GitHub, LinkedIn, Instagram y el portafolio personal.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19 y TypeScript, desplegado en Vercel (URL de respaldo: https://aragon-two.vercel.app). El rediseño mantiene este stack y suma vgpu (WebGPU) para el campo de partículas.
- Sin backend propio para el contacto.
- Componentes de terceros con licencia restrictiva (Aceternity, Skiper UI de pago) no se copian: se reescriben las técnicas.

## Design Inputs

Investigación de plataformas del 2026-10-11 (Awwwards, fala.today y el catálogo del brain, `knowledge/diseno/plataformas-de-referencia-web.md`), el portafolio de Jordan Aragon (paleta y tipografía) y AiDEN (nivel de ambición). Detalle en `references/aragon/` del brain.

## Brand Commitments

Nombre Aragon. Distinto de Aragon-Server (homelab) y de Aragon-Finance (otro proyecto personal), que aparecen como trabajo propio.

## Evidence on Hand

- Trabajo real: AiDEN (en producción), Aragon-Server (operando; David pidió el 2026-10-26 dejarlo como trabajo propio, sin enlazarlo a ningún servicio), portafolio de Leidy (publicado; David pidió mostrar la captura de su portada el 2026-10-11), Aragon-Finance (en desarrollo) y Calendar. Por pedido de David (2026-10-11), Calendar y Aragon-Finance no se muestran en la web.
- No hay testimonios ni métricas de clientes confirmados. No se inventan.
- Textos por confirmar con David: política de precios (precio cerrado tras el diagnóstico), pagos por etapas, horario de atención y acompañamiento posterior a la entrega.

## Accessibility & Inclusion

Contraste AA, navegación por teclado y movimiento reducido.
