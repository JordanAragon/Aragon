# Aragon — Premium UX / Motion Audit

## Estado actual

La iteración anterior resolvió problemas de concurrencia visual en el Hero, sustituyó la escena raster estática por un Crowd Canvas y corrigió el resize del bitmap del Canvas.

La revisión actual mantiene esas decisiones y corrige varias inconsistencias adicionales:

### Hero
- La identidad ARAGON funciona como escena inicial dominante.
- El contenido narrativo aparece después, evitando competir con el wordmark desde el primer frame.
- La vista de producto entra como apoyo visual y no como protagonista simultáneo.
- Las fases de contenido siguen siendo mutuamente excluyentes para interacción y lectura.
- Los enlaces de fases no activas se retiran del orden de tabulación.

### Crowd Canvas
- Se conserva el sprite local 15 × 7 utilizado por la adaptación de Skiper 39.
- Cada personaje recibe una dirección aleatoria al iniciar cada ciclo.
- Se mantiene el movimiento horizontal continuo y el bob vertical.
- Los personajes se reutilizan al completar el recorrido.
- La profundidad se ordena mediante anchorY.
- ResizeObserver y DPR limitado a 2 evitan redimensionamientos innecesarios del backing store.
- IntersectionObserver pausa las caminatas cuando el Canvas queda fuera de viewport.
- prefers-reduced-motion reemplaza el movimiento continuo por una composición estática.
- El scroll ya no fuerza una única dirección global. La relación narrativa se construye mediante composición, escala, desplazamiento y opacidad de la escena.

### Storytelling
La escena de multitud se entiende como actividad y flujo: primero aparece como movimiento disperso, luego ocupa más espacio mientras el texto introduce la fricción y finalmente se retira mientras la narrativa pasa de movimiento a dirección. La metáfora permanece visual y no intenta atribuir identidades literales a los personajes.

### Limpieza
Se eliminaron componentes y assets heredados que ya no participan en la homepage, además de los estilos audit.css y polish.css, cuyos pocos estilos todavía necesarios fueron absorbidos por la capa premium.

### Contacto
La agenda conserva Cal.com y añade una segunda vía por correo. El footer ahora actúa como cierre narrativo y centraliza perfiles reales disponibles.

### Restricciones
No se añadieron dependencias nuevas. El stack sigue siendo Next.js + React + Motion + GSAP + CSS propio.