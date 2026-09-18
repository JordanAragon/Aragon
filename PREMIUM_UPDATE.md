# Aragon — Premium Storytelling Pass / 2026-09-18

## Experience pass

- Hero reducido a una entrada centrada en identidad antes de revelar información secundaria.
- Scroll del Hero convertido en transición identidad → mensaje → fricción → construcción.
- Crowd Canvas integrado como escena narrativa, no como adorno aislado.
- Dirección aleatoria de personajes restaurada por ciclo para conservar el comportamiento esencial de Skiper 39.
- Movimiento del usuario aplicado sobre la escena completa mediante escala, desplazamiento y opacidad.
- Preloader limitado a los dos assets críticos para la entrada: visual principal y sprite de multitud.
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

Skiper UI describe Skiper 39 como un Crowd Canvas basado en HTML5 Canvas y GSAP, con personajes construidos desde una sprite sheet, movimiento de caminata y ajuste al tamaño de pantalla. La implementación local conserva esos principios y evita depender de un asset remoto en runtime.

El criterio visual también sigue una premisa importante de los materiales de Awwwards: el concepto debe preceder al efecto y el movimiento debe servir a una intención clara, en lugar de copiar tendencias de interacción por apariencia.