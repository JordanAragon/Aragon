# Product

<!-- impeccable:product-schema 1 -->

Escrito el 2026-10-04 y actualizado el 2026-10-11 a partir de confirmaciones directas de David registradas en su brain (David-AI, `brain/proyectos/aragon.md`) y de lo que hay en este repo. Lo no confirmado queda como decisión abierta.

## Platform

web

## Users

Negocios que necesitan software a la medida: apps web, automatización de procesos, agentes de IA o infraestructura (confirmado por David, 2026-10-11). El público concreto (tamaño, sector) sigue abierto; el sitio habla a negocios que crecieron con WhatsApp, libretas y hojas de cálculo.

## Product Purpose

Aragon es una **agencia de software** que hace diseño y desarrollo de apps web a medida, sistemas de automatización a medida y agentes de IA, entre otros (David, 2026-10-11). Es el sello de Jordan Aragon para productos y servicios; el portafolio personal es otro sitio (decisión de marca del 2026-10-11 en el brain). El sitio busca abrir conversaciones de trabajo: agenda con Cal.com y formulario de contacto.

**Rediseño (2026-10-11):** David pidió una web completa (servicios, cómo trabajamos, nosotros, preguntas, contacto), muy atractiva y «viva» como AiDEN pero con identidad propia, donde cada animación explique algo, con la paleta y la tipografía del portafolio como base. La dirección visual está en `DESIGN.md`.

## Positioning

Abierto: qué hace distinto a Aragon frente a otros estudios. El sitio propone, pendiente de confirmar: equipo pequeño donde quien diseña construye y mantiene; diagnóstico antes de construir; código y accesos a nombre del cliente; trabajo real sin cifras inventadas.

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

- Trabajo real: AiDEN (en producción), Aragon-Server (operando), portafolio de Leidy (publicado; falta su permiso para capturas), Aragon-Finance (en desarrollo) y Calendar. Por pedido de David (2026-10-11), Calendar y Aragon-Finance no se muestran en la web.
- No hay testimonios ni métricas de clientes confirmados. No se inventan.
- Textos por confirmar con David: política de precios (precio cerrado tras el diagnóstico), pagos por etapas, horario de atención y acompañamiento posterior a la entrega.

## Accessibility & Inclusion

Contraste AA, navegación por teclado y movimiento reducido.
