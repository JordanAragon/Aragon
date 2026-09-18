# Aragon Premium V4 / Final Evolution

## Hero

Una sola escena sticky presenta primero la identidad ARAGON y después revela el mensaje. El wordmark deja de competir con múltiples bloques desde el primer frame y el scroll lo transforma en el encabezado de la historia.

## Crowd

El Crowd Canvas mantiene el comportamiento esencial de Skiper 39: sprite sheet local, personajes independientes, caminatas horizontales, dirección aleatoria, bob vertical, profundidad por posición y reutilización continua. El scroll controla la escena exterior, no la física interna de la multitud.

## Contacto y cierre

Cal.com continúa como ruta de agenda. Se añadió una ruta ligera por correo con asunto contextual. El footer funciona como cierre editorial y centraliza perfiles disponibles y portafolio.

## Limpieza

Se retiraron estilos legacy audit.css y polish.css, componentes duplicados de Crowd/Context, assets de escena no utilizados y el artefacto tsconfig.tsbuildinfo. No se añadieron dependencias.

## Deployment

La rama de evolución se debe validar en Vercel antes de fusionarla a main. El criterio de aceptación no es solo que compile: debe responder correctamente, no producir errores runtime y mantener navegación, reduced motion, responsive y comportamiento de scroll.