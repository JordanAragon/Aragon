# Marca Aragon

Fuente: el tablero de marca que entregó David el 2026-10-11 ([`referencias/tablero-de-marca.png`](referencias/tablero-de-marca.png)).

## Concepto

Letra A + arquitectura + solidez = el símbolo. La A sin travesaño es la estructura y la dirección; las piezas grises son las partes que se suman a un sistema. Lema: **Software a medida para negocios reales.** Descriptor: Ideas · Procesos · Personas · Sistemas.

## Logo

| Archivo | Uso |
| --- | --- |
| `logo/logo-horizontal.svg` / `-blanco.svg` | Principal, sobre claro / sobre oscuro |
| `logo/logo-horizontal-mono-negro.svg` / `-mono-blanco.svg` | Monocromo (una tinta): cabeceras de documento, sellos, grabados |
| `logo/simbolo*.svg` | Símbolo solo: favicon, app icon, marcas de agua |
| `logo/logotipo*.svg` | «ARAGON» solo, en Sora 500 con las A sin travesaño |

Los SVG son una **vectorización a mano** del tablero (`herramientas/construir_logo.py`), no el master original. Si llega el vector original, se reemplazan.

## Color

| Nombre | HEX | Uso |
| --- | --- | --- |
| Noche | `#0A0A0A` | Base |
| Noche secundaria | `#111111` | Superficies, tarjetas |
| Noche elevada | `#181818` | Secciones, contraste |
| Línea oscura | `#242424` | Bordes, separadores |
| Texto secundario | `#454545` | Lectura sobre claro |
| Texto terciario | `#B3B3B3` | Textos auxiliares, rótulos |
| Línea clara | `#E1E1DF` | Divisiones |
| Papel | `#F5F5F4` | Fondo principal claro |
| Blanco | `#FFFFFF` | Texto sobre oscuro |

## Tipografía

- **Sora** (SIL OFL): títulos, interfaz y marca. Pesos 400–700 en `fuentes/`.
- **Inter** (SIL OFL): texto, documentación y contenido.
- **JetBrains Mono** (SIL OFL): solo códigos, rótulos y datos.

## Aplicaciones

- Documentos PDF (informes y propuestas): [`documentos/`](documentos/README.md).
- Web: todavía usa el cuadrado como marca e Inter Tight en los títulos (`DESIGN.md`). Llevar el símbolo A y Sora a la web es una decisión pendiente de David.
