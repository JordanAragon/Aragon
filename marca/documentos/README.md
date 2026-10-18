# Documentos PDF de Aragon

Sistema para producir informes y propuestas con la identidad de Aragon: portada de noche con la rendija de luz, la conclusión y las cifras clave; páginas interiores blancas con cabecera, secciones numeradas en la pieza negra, tarjetas, avisos, tablas, fases y estados monocromos; contraportada con el siguiente paso y el contacto. El concepto viene de las propuestas de Ocean Industries y de los informes de AiDEN; la identidad, del tablero de marca del 2026-10-11 (`../referencias/tablero-de-marca.png`).

Cuando David pida un informe, una propuesta o cualquier documento de Aragon, sale de aquí (skill `david-aragon-documentos` en David-AI).

## Cómo se genera

```bash
pip install playwright pyyaml pypdf && playwright install chromium
python marca/documentos/generar_documento.py docs/documentos/<fecha>-<tema>/documento.yaml
```

1. Crear `docs/documentos/AAAA-MM-DD-<tema>/documento.yaml`. Para una propuesta, copiar [`plantillas/propuesta.yaml`](plantillas/propuesta.yaml).
2. Escribirlo con [`GUIA-DE-REDACCION.md`](GUIA-DE-REDACCION.md).
3. Generar el PDF (queda junto al YAML) y revisarlo página por página.

Ejemplo real: [`docs/documentos/2026-10-11-estado-del-sitio/documento.yaml`](../../docs/documentos/2026-10-11-estado-del-sitio/documento.yaml).

## Identidad

| Elemento | Regla |
| --- | --- |
| Portada | Tarjeta de noche `#0A0A0A` con esquinas redondeadas (7 mm) sobre papel, muro con retícula y grano, rendija de luz vertical al 74 % del ancho. Logo horizontal blanco, tipo y código en mono, pastilla con la pieza, titular en Sora 600 (líneas anteriores en `#B3B3B3`, la última en blanco), resumen y 3–4 cifras separadas por líneas finas. Pie con «Preparado para» (propuestas) y «Preparado por». |
| Interior | Fondo blanco. Cabecera con el logo monocromo y la sección en mono. Número de sección en la pieza negra. |
| Contraportada | La misma escena, símbolo grande, lema «Software a medida para negocios reales», siguiente paso y contacto. Se quita con `contraportada: false`. |
| Tipografía | Sora (títulos y cifras), Inter (texto), JetBrains Mono (rótulos, códigos, encabezados de tabla y pie). |
| Color | Solo la escala del tablero: noche, grafito `#454545`, gris `#9A9A9A`, línea `#E1E1DF`, papel `#F5F5F4`, blanco. La única calidez es la luz de la rendija. |
| Estados | La pieza: llena, a medias, vacía, rombo o punteada, siempre con su palabra. |
| Formas | Todo va redondeado, como las piezas del símbolo: 7 mm en la portada, 5 mm en la banda, 3,6 mm en tarjetas, tablas, avisos y cifras, 2,4 mm en los cuadros de sección, y pastilla completa en chips y barras. Nada de esquinas en ángulo recto. |
| Pie | `ARAGON · <tipo> · <código>` y `página / total` (sin contar portada ni contraportada). |

## Esquema del YAML

```yaml
tipo: informe                        # informe | propuesta | documento
codigo: AR-INF-2026-001              # obligatorio
version: Borrador 1
fecha: 11 de octubre de 2026
area: Software a medida para negocios reales     # bajo el logo
etiqueta: Estado del sitio · octubre 2026        # pastilla
titulo: [Primera línea, Línea final en blanco]
resumen: Una a tres frases con la conclusión.
kpis:                                # 3 o 4
  - {valor: "23", etiqueta: rutas generadas, detalle: build del 11 de octubre}
preparado_para: {nombre: Empresa, detalle: Contacto · cargo}   # opcional (propuestas)
preparado_por: {nombre: Aragon, detalle: Jordan David Aragon}
siguiente_paso: "Texto de la contraportada."     # opcional
contacto: {whatsapp: ..., web: ...}  # opcional; por defecto correo, agenda y lugar del sitio
contraportada: true
secciones:
  - titulo: La respuesta corta
    subtitulo: Una línea que explica la sección.
    encabezado: Resumen              # texto corto de la cabecera
    nueva_pagina: true               # por defecto; false continúa en la misma página
    bloques: [ ... ]
```

**Comillas.** En YAML, una coma parte una lista entre corchetes y « #» empieza un comentario. Toda celda o valor con coma o con `#` va entre comillas: `["Publicación", "Fusionar el PR #14"]`. El generador avisa si una fila de tabla no tiene el número de columnas.

### Bloques

| `tipo` | Campos | Para qué |
| --- | --- | --- |
| `parrafo` | `titulo`, `texto` (párrafos separados por línea en blanco) | Texto corrido |
| `lista` | `titulo`, `items` | Viñetas (la pieza) |
| `banda` | `rotulo`, `titulo`, `texto`, `lista` | Conclusión destacada en noche con rendija |
| `tarjetas` | `titulo`, `columnas`, `items: [{etiqueta, titulo, texto, lista, color}]` | Comparar 2–4 cosas |
| `aviso` | `estilo` (`ok`, `alerta`, `critico`, `info`, `marca`), `titulo`, `texto`, `lista` | Lo que no se puede pasar por alto. `critico` va invertido (noche). |
| `tabla` | `titulo`, `columnas`, `filas`, `anchos`, `total`, `nota` | Datos, alcance, planes, inversión |
| `kpis` | `titulo`, `columnas`, `items: [{valor, etiqueta, detalle}]` | Cifras clave |
| `barras` | `titulo`, `items: [{nombre, valor (0–100), color, nota}]` | Avance o cumplimiento |
| `fases` | `titulo`, `items: [{nombre, duracion, texto, necesitamos, entregables}]` | El proceso de trabajo (propuestas) |
| `imagenes` | `titulo`, `columnas`, `items: [{src, titulo, pie, alt}]` (`src` relativo a la carpeta del YAML) | Capturas, mockups o fotos |
| `fuentes` | `texto` | Fuentes, método o supuestos |

Colores (`color`): `noche`, `grafito`, `gris`, `terciario`, `linea` o un HEX en gris.

### Formato en el texto

- `**negrita**`, `` `código` ``.
- Chips de estado: `[[ok:Listo]]`, `[[alerta:Parcial]]`, `[[critico:Falta]]`, `[[info:Decisión]]`, `[[neutro:Fuera de alcance]]`.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `generar_documento.py` | YAML → HTML → PDF (Chromium); portada, cuerpo y contraportada unidos con pypdf |
| `estilos.css` | Todo el diseño |
| `GUIA-DE-REDACCION.md` | Cómo se escribe un documento de Aragon |
| `plantillas/propuesta.yaml` | Plantilla de propuesta con las fases del sitio |

Fuentes: Sora en `../fuentes/`; Inter y JetBrains Mono se toman de `app/fonts/` (las mismas de la web).
