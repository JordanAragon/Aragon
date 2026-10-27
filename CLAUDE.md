## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Diseño

- Fuente de verdad visual: `DESIGN.md` (raíz), del rediseño del 2026-10-11. Producto: `PRODUCT.md`. Léelos antes de cualquier trabajo de UI.
- Aragon es una agencia de software: cada animación debe explicar algo (ver «Motion» en `DESIGN.md`). Nada de clientes, cifras ni testimonios inventados.
- `ui-ux-pro-max` es solo consulta. No ejecutes `--persist`.
- `PRODUCT.md` solo cambia con hechos confirmados por David.
- Antes de diseñar una sección o página nueva, revisa las plataformas de referencia del brain (`knowledge/diseno/plataformas-de-referencia-web.md` en David-AI).

## Verificación

- Servidor de desarrollo: `npm run dev` → http://localhost:3000
- Todo cambio de UI se verifica en el navegador con el skill `playwright-cli` antes de darlo por terminado: abrir la página, revisar 375, 768 y 1440 px (`resize`), sin errores en consola, y una captura por ancho.
- Para recorrer o verificar la app usa `playwright-cli` (`snapshot` y `find` en vez de leer el DOM completo). Para tareas largas, usa una sesión propia: `-s=<proyecto>`.
- No uses `--persistent` ni guardes estado de sesión (`state-save`) con cuentas reales; las salidas van a `.playwright-cli/` (ignorado por Git).
- Flujos clave: hero (campo de partículas y palabra que rota), «Del desorden al sistema» (cuatro paradas), demos de servicios, paleta ⌘K, formulario de contacto, agenda (Cal.com), página de un servicio (`/servicios/<slug>`) y de un caso (`/trabajo/<slug>`).
- El campo de partículas intenta WebGPU (vgpu) y cae a Canvas 2D si falla: comprueba los dos caminos cuando toques `app/components/field/`.

## Skills

- Antes de cualquier tarea, revisa **todo** el conjunto de skills disponibles: las instaladas en este repo, las del brain David-AI (`JordanAragon/David-AI`, carpeta `skills/`) y las de la cuenta. Usa las más adecuadas para la tarea y di cuáles vas a usar. No te limites a las que menciona este archivo. Regla de David (2026-10-06).

## Commits

- Todo commit se firma como David: `Jordan David Micolta Aragón <jordandavidaragon@outlook.com>` (cuenta autorizada en Vercel).
- Sin `Co-Authored-By`, `Claude-Session` ni ninguna otra línea que nombre a Claude u otra herramienta, en commits ni en PR. Regla de David (2026-10-11).
