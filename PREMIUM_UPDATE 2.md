# Aragon — Premium Storytelling Pass / 2026-09-18

## Experience pass

- Hero reducido a una entrada centrada en identidad antes de revelar información secundaria.
- Scroll del Hero convertido en transición identidad → mensaje → fricción → construcción.
- Crowd Canvas integrado como escena narrativa, no como adorno aislado.
- Dirección aleatoria de personajes restaurada por ciclo para conservar el comportamiento de Skiper 39.
- El canvas deja de recibir escala/desplazamiento/opacidad narrativos: el movimiento de las personas queda intacto y el storytelling vive en la composición textual.
- Preloader simplificado: solo mantiene el sprite de multitud como asset crítico para la escena inicial.
- Footer ampliado con cierre narrativo, perfiles y portafolio.
- Agenda ampliada con una ruta alternativa de contacto por correo.
- Estilos legacy audit.css y polish.css retirados después de migrar sus reglas aún necesarias.
- Assets antiguos y duplicados de la escena Crowd eliminados.

## Hardening posterior

- La entrada inicial ahora se sincroniza mediante el evento `aragon:entry-start`, compartido entre preloader, Hero y header.
- El Crowd Canvas desconecta realmente el GSAP ticker cuando sale de viewport, además de pausar sus timelines.
- Se corrigió el anclaje de personajes invertidos para que sus recorridos hacia la izquierda respeten el borde del escenario.
- Se eliminó la hoja `app/skiper.css` y se consolidaron las reglas que siguen en uso.
- Se detectó y eliminó CSS accidentalmente incrustado al final de `app/data/projects.ts`, que impedía el parseo TypeScript.
- Se retiraron archivos `.DS_Store` y se añadió un icono específico de globo para el portafolio personal.

## Reference principles

Skiper UI describe Skiper 39 como un Crowd Canvas basado en HTML5 Canvas y GSAP, con personajes construidos desde una sprite sheet, movimiento de caminata y ajuste al tamaño de pantalla. Aragon conserva esos principios y utiliza la misma sprite sheet Open Peeps de la referencia de Skiper/CodePen mediante su URL original, precisamente para mantener la apariencia de los personajes sin una recreación local distinta.

El criterio visual también sigue una premisa importante de los materiales de Awwwards: el concepto debe preceder al efecto y el movimiento debe servir a una intención clara, en lugar de copiar tendencias de interacción por apariencia.

## V6 — Art direction / 2026-09-18

- Hero reducido a una secuencia de identidad → mensaje → acción, eliminando la imagen del portafolio y cualquier escena paralela que compitiera con ARAGON.
- CTA secundario del Hero, CTA del header y CTA de contacto convergen en el formulario in-place.
- Footer reconstruido como un colofón compacto de estudio, sin la matriz de enlaces que provocaba desborde.
- Formulario de contacto convertido en una escena superpuesta breve, con cierre por Escape, foco inicial y focus trap para teclado.
- Crowd Canvas apunta a la sprite sheet Open Peeps original usada por la implementación base de Skiper/CodePen para que los personajes no sean una variación local.
- La página de Skiper 39 documenta el componente como Canvas + GSAP con sprite sheet 15×7 y atribución requerida para la versión gratuita: https://skiper-ui.com/v1/skiper39
- Referencias visuales consultadas en Awwwards: estudios/portfolios que priorizan tipografía, composición limpia, transiciones y contacto integrado antes que grandes matrices de contenido.
