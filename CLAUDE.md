## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Diseño

- **Rediseño total previsto** (David, 2026-10-04): el sitio actual es un prototipo. Su apariencia no es vinculante; úsala como referencia y antirreferencia, no como identidad que preservar. Producto: `PRODUCT.md` (raíz).
- No hay `DESIGN.md` todavía. El rediseño se hace con el skill `impeccable` (flujo de trabajo nuevo: `shape`/`craft`), y la nueva dirección visual se aprueba con David antes de escribir `DESIGN.md`.
- `ui-ux-pro-max` es solo consulta (guías del stack, paletas y tipografías como punto de partida). No ejecutes `--persist`.
- `PRODUCT.md` solo cambia con hechos confirmados por David.

## Verificación

- Servidor de desarrollo: `npm run dev` → http://localhost:3000
- Todo cambio de UI se verifica en el navegador con el skill `playwright-cli` antes de darlo por terminado: abrir la página, revisar 375, 768 y 1440 px (`resize`), sin errores en consola, y una captura por ancho.
- Para recorrer o verificar la app usa `playwright-cli` (`snapshot` y `find` en vez de leer el DOM completo). Para tareas largas, usa una sesión propia: `-s=<proyecto>`.
- No uses `--persistent` ni guardes estado de sesión (`state-save`) con cuentas reales; las salidas van a `.playwright-cli/` (ignorado por Git).
- Flujos clave: preloader y hero, scroll narrativo, formulario de contacto superpuesto, agenda (Cal.com) y página de un caso (`/work/<slug>`).
- Mientras dure el rediseño, las capturas sirven como referencia del prototipo, no como estado a conservar.

## Skills

- Antes de cualquier tarea, revisa **todo** el conjunto de skills disponibles: las instaladas en este repo, las del brain David-AI (`JordanAragon/David-AI`, carpeta `skills/`) y las de la cuenta. Usa las más adecuadas para la tarea y di cuáles vas a usar. No te limites a las que menciona este archivo. Regla de David (2026-10-06).
