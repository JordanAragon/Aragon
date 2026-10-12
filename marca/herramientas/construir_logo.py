"""Construye el símbolo A de Aragon y el logotipo a partir del tablero de marca (marca/referencias/tablero-de-marca.png).

Es una vectorización a mano de la imagen del tablero: geometría limpia (inclinación, anchos y radios
en las constantes de abajo), no el master original. Si llega el vector original, reemplaza estos SVG.

Uso (desde la raíz del repo):
    pip install fonttools
    python marca/herramientas/construir_logo.py marca/logo marca/herramientas/sora-latin-500-normal.woff
"""
import math
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

OUT = Path(sys.argv[1])
SORA = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

H = 72.0          # alto del símbolo
K = 0.68          # inclinación: avance horizontal por unidad de alto
W = 31.0          # ancho horizontal de la pata negra
CAP = 25.0        # alto de la tapa
GAP = 5.5         # separación horizontal entre piezas
R = 5.6           # radio de las esquinas


def redondear(pts, r):
    """Polígono con esquinas redondeadas (arcos de radio r) como path SVG."""
    n = len(pts)
    segs = []
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]
        v1 = (p0[0] - p1[0], p0[1] - p1[1]); v2 = (p2[0] - p1[0], p2[1] - p1[1])
        l1 = math.hypot(*v1); l2 = math.hypot(*v2)
        u1 = (v1[0] / l1, v1[1] / l1); u2 = (v2[0] / l2, v2[1] / l2)
        ang = math.acos(max(-1, min(1, u1[0] * u2[0] + u1[1] * u2[1])))
        d = min(r / math.tan(ang / 2), l1 / 2.1, l2 / 2.1)
        rr = d * math.tan(ang / 2)
        a = (p1[0] + u1[0] * d, p1[1] + u1[1] * d)
        b = (p1[0] + u2[0] * d, p1[1] + u2[1] * d)
        cruz = u1[0] * u2[1] - u1[1] * u2[0]
        segs.append((a, b, rr, 0 if cruz > 0 else 1))
    f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
    d = f"M{f(segs[0][1][0])} {f(segs[0][1][1])}"
    for a, b, rr, sweep in segs[1:] + segs[:1]:
        d += f"L{f(a[0])} {f(a[1])}A{f(rr)} {f(rr)} 0 0 {sweep} {f(b[0])} {f(b[1])}"
    return d + "Z"


# Pieza negra: pata inclinada + tapa (la A sin travesaño).
x_top_l = K * H                      # esquina superior izquierda de la tapa
inner = lambda y: W + K * (H - y)    # borde interior de la pata
top_r = 80.0
negra = [(0, H), (W, H), (inner(CAP), CAP), (top_r + K * CAP, CAP), (top_r, 0), (x_top_l, 0)]

# Pieza gris grande: banda «\» bajo el extremo de la tapa.
gy = CAP + GAP * 0.9
gx = 87.0
gw = W - 1
gris_g = [(gx, gy), (gx + gw, gy), (gx + gw + K * (H - gy), H), (gx + K * (H - gy), H)]

# Pieza gris pequeña: banda «\» recortada por una paralela a la pata negra.
clip = lambda y: W + GAP + K * (H - y)           # x mínima permitida
right_bottom = 82.0                               # borde derecho, abajo
right = lambda y: right_bottom - K * (H - y)
y_apex = H - (right_bottom - W - GAP) / (2 * K)
w2 = 22.0
left_bottom = right_bottom - w2
y_meet = H - (left_bottom - W - GAP) / (2 * K)
gris_p = [(clip(y_apex), y_apex), (right_bottom, H), (left_bottom, H), (clip(y_meet), y_meet)]

ancho = max(p[0] for p in gris_g)
VB = f"0 0 {ancho:.2f} {H:.0f}"
paths = {"negra": redondear(negra, R), "gris_g": redondear(gris_g, R), "gris_p": redondear(gris_p, R * 0.8)}


def simbolo(fg, gris, extra=""):
    return (f'<path fill="{fg}" d="{paths["negra"]}"/>'
            f'<path fill="{gris}" d="{paths["gris_g"]}"/><path fill="{gris}" d="{paths["gris_p"]}"/>{extra}')


VARIANTES = {
    "simbolo": ("#0A0A0A", "#9A9A9A"),
    "simbolo-blanco": ("#FFFFFF", "#8A8A8A"),
    "simbolo-mono-negro": ("#0A0A0A", "#0A0A0A"),
    "simbolo-mono-blanco": ("#FFFFFF", "#FFFFFF"),
}
for nombre, (fg, gr) in VARIANTES.items():
    (OUT / f"{nombre}.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" role="img" aria-label="Aragon">{simbolo(fg, gr)}</svg>\n')

# Logotipo: ARAGON en Sora 600 con las A sin travesaño (V invertida de la misma fuente).
font = TTFont(SORA)
gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font["head"].unitsPerEm
cap_h = font["OS/2"].sCapHeight or 700
track = 0.30 * upm
x = 0.0; partes = []
for ch in "ARAGON":
    g = cmap[ord("V" if ch == "A" else ch)]
    pen = SVGPathPen(gs)
    if ch == "A":
        adv = gs[g].width
        tp = TransformPen(pen, (1, 0, 0, -1, x, cap_h))  # V volteada: Λ
    else:
        adv = gs[g].width
        tp = TransformPen(pen, (1, 0, 0, 1, x, 0))
    gs[g].draw(tp)
    partes.append(pen.getCommands())
    x += adv + track
x -= track
texto = "".join(partes)
wm_w = x


def wordmark_svg(color):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {-cap_h} {wm_w:.0f} {cap_h}" role="img" aria-label="Aragon">'
            f'<path fill="{color}" transform="scale(1,-1)" d="{texto}"/></svg>\n')


(OUT / "logotipo.svg").write_text(wordmark_svg("#0A0A0A"))
(OUT / "logotipo-blanco.svg").write_text(wordmark_svg("#FFFFFF"))

# Logo horizontal: símbolo + logotipo (alto del logotipo = 42 % del símbolo).
esc = (H * 0.40) / cap_h
sep = 15
lw = wm_w * esc
total = ancho + sep + lw


def horizontal(fg, gr):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total:.2f} {H:.0f}" role="img" aria-label="Aragon">'
            f'{simbolo(fg, gr)}<g transform="translate({ancho + sep:.2f} {H * 0.70:.2f}) scale({esc:.5f} {-esc:.5f})">'
            f'<path fill="{fg}" d="{texto}"/></g></svg>\n')


(OUT / "logo-horizontal.svg").write_text(horizontal("#0A0A0A", "#9A9A9A"))
(OUT / "logo-horizontal-blanco.svg").write_text(horizontal("#FFFFFF", "#8A8A8A"))
(OUT / "logo-horizontal-mono-negro.svg").write_text(horizontal("#0A0A0A", "#0A0A0A"))
(OUT / "logo-horizontal-mono-blanco.svg").write_text(horizontal("#FFFFFF", "#FFFFFF"))
print("ok", VB, f"{total:.1f}")
