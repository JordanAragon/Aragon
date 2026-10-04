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
