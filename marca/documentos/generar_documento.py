"""Genera un documento PDF de Aragon (informe o propuesta) a partir de un archivo YAML.

Uso (desde la raíz del repo de Aragon):
    pip install playwright pyyaml pypdf && playwright install chromium
    python marca/documentos/generar_documento.py docs/documentos/<fecha>-<tema>/documento.yaml [salida.pdf]

El esquema del YAML está en README.md de esta carpeta; las reglas de redacción, en GUIA-DE-REDACCION.md.
"""
import html
import io
import re
import sys
from pathlib import Path

import yaml
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

AQUI = Path(__file__).resolve().parent
MARCA = AQUI.parent
RAIZ = MARCA.parent
LOGO = MARCA / "logo"

# Escala de grises del tablero de marca (2026-10-11). Los documentos son monocromos.
GRISES = {"noche": "#0A0A0A", "noche-2": "#111111", "elevada": "#181818", "linea-oscura": "#242424",
          "grafito": "#454545", "gris": "#9A9A9A", "terciario": "#B3B3B3", "linea": "#E1E1DF",
          "papel": "#F5F5F4", "blanco": "#FFFFFF"}

# Contacto por defecto: el mismo que publica el sitio (app/data/site.ts).
CONTACTO = {"correo": "jordandavidaragon@outlook.com",
            "agenda": "cal.com/jordan-david-micolta-aragon-cognqx/30min",
            "lugar": "Cali, Colombia"}

TIPOS = {"informe": "Informe", "propuesta": "Propuesta", "documento": "Documento"}


def uri(p: Path) -> str:
    return p.resolve().as_uri()


def fuentes_css() -> str:
    out = []
    for w in (400, 500, 600, 700):
        out.append(f"@font-face{{font-family:'Sora';src:url('{uri(MARCA / 'fuentes' / f'sora-latin-{w}-normal.woff2')}') format('woff2');font-weight:{w}}}")
    for fam, archivo in (("Inter", "inter-latin-wght-normal.woff2"), ("JetBrains Mono", "jetbrains-mono-latin-wght-normal.woff2")):
        out.append(f"@font-face{{font-family:'{fam}';src:url('{uri(RAIZ / 'app' / 'fonts' / archivo)}') format('woff2');font-weight:100 900}}")
    return "".join(out)


def color(nombre, defecto="noche") -> str:
    v = nombre or defecto
    return GRISES.get(v, v)


def md(texto) -> str:
    """Formato en línea: **negrita**, `código` y [[estado:texto]] como chip."""
    if texto is None:
        return ""
    t = html.escape(str(texto))
    t = re.sub(r"\[\[(ok|alerta|critico|info|neutro):([^\]]+)\]\]", r'<span class="chip \1"><i></i>\2</span>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    return t


def parrafos(texto) -> str:
    if not texto:
        return ""
    return "".join(f"<p>{md(p.strip())}</p>" for p in str(texto).strip().split("\n\n") if p.strip())


def lista(items, clase="lista") -> str:
    return f"<ul class='{clase}'>" + "".join(f"<li>{md(i)}</li>" for i in items) + "</ul>"


def h3(b) -> str:
    return f"<h3>{md(b['titulo'])}</h3>" if b.get("titulo") else ""


def bloque(b: dict) -> str:
    tipo = b.get("tipo", "parrafo")
    if tipo == "parrafo":
        return f"<div class='bloque'>{h3(b)}{parrafos(b.get('texto'))}</div>"
    if tipo == "lista":
        return f"<div class='bloque'>{h3(b)}{lista(b['items'])}</div>"
    if tipo == "tarjetas":
        n = b.get("columnas", 3)
        items = "".join(
            f"<div class='tarjeta' style='--pieza:{color(i.get('color'))}'>"
            + (f"<div class='mono etq'>{md(i['etiqueta'])}</div>" if i.get("etiqueta") else "")
            + f"<h4>{md(i['titulo'])}</h4>" + parrafos(i.get("texto"))
            + (lista(i["lista"]) if i.get("lista") else "") + "</div>"
            for i in b["items"])
        return f"<div class='bloque partible'>{h3(b)}<div class='tarjetas' style='grid-template-columns:repeat({n},1fr)'>{items}</div></div>"
    if tipo == "aviso":
        cuerpo = parrafos(b.get("texto")) + (lista(b["lista"], "flechas") if b.get("lista") else "")
        return f"<div class='bloque'><div class='aviso {b.get('estilo', 'info')}'><div class='t'><i></i>{md(b.get('titulo', ''))}</div>{cuerpo}</div></div>"
    if tipo == "banda":
        return ("<div class='bloque'><div class='banda'><div class='rendija'></div>"
                + (f"<div class='mono'>{md(b['rotulo'])}</div>" if b.get("rotulo") else "")
                + f"<h3>{md(b.get('titulo', ''))}</h3>{parrafos(b.get('texto'))}"
                + (lista(b["lista"]) if b.get("lista") else "") + "</div></div>")
    if tipo == "tabla":
        for n, fila in enumerate(b["filas"], 1):
            if len(fila) != len(b["columnas"]):
                raise ValueError(f"Tabla «{b.get('titulo', '')}», fila {n}: {len(fila)} celdas para {len(b['columnas'])} columnas. "
                                 "Pon entre comillas las celdas con comas o con « #».")
        anchos = b.get("anchos")
        cols = "".join(f"<col style='width:{a}'>" for a in anchos) if anchos else ""
        cab = "".join(f"<th>{md(c)}</th>" for c in b["columnas"])
        filas = "".join("<tr>" + "".join(f"<td>{md(c)}</td>" for c in f) + "</tr>" for f in b["filas"])
        pie = ("<tfoot><tr>" + "".join(f"<td>{md(c)}</td>" for c in b["total"]) + "</tr></tfoot>") if b.get("total") else ""
        nota = f"<div class='nota-tabla'>{md(b['nota'])}</div>" if b.get("nota") else ""
        return f"<div class='bloque partible'>{h3(b)}<table><colgroup>{cols}</colgroup><thead><tr>{cab}</tr></thead><tbody>{filas}</tbody>{pie}</table>{nota}</div>"
    if tipo == "kpis":
        n = b.get("columnas", len(b["items"]))
        ks = "".join(f"<div class='k'><div class='v'>{md(k['valor'])}</div><div class='e'>{md(k['etiqueta'])}</div><div class='d'>{md(k.get('detalle', ''))}</div></div>" for k in b["items"])
        return f"<div class='bloque'>{h3(b)}<div class='kpis-int' style='grid-template-columns:repeat({n},1fr)'>{ks}</div></div>"
    if tipo == "barras":
        filas = "".join(
            f"<div class='barra'><div class='n'>{md(i['nombre'])}</div><div class='pista'><div class='relleno' style='width:{i['valor']}%;background:{color(i.get('color'))}'></div></div><div class='pct'>{i['valor']} %</div>"
            + (f"<div></div><div class='nota'>{md(i['nota'])}</div>" if i.get("nota") else "") + "</div>"
            for i in b["items"])
        return f"<div class='bloque'>{h3(b)}<div class='barras'>{filas}</div></div>"
    if tipo == "fases":
        items = b["items"]
        fs = "".join(
            f"<div class='fase'><div class='fase-cab'><span class='cuadro'>{n:02d}</span><span class='linea'></span></div>"
            f"<div class='mono dur'>{md(f.get('duracion', ''))}</div><h4>{md(f['nombre'])}</h4>{parrafos(f.get('texto'))}"
            + (f"<div class='mono sub'>Necesitamos de ti</div>{lista(f['necesitamos'])}" if f.get("necesitamos") else "")
            + (f"<div class='mono sub'>Recibes</div>{lista(f['entregables'])}" if f.get("entregables") else "")
            + "</div>"
            for n, f in enumerate(items, 1))
        return f"<div class='bloque'>{h3(b)}<div class='fases' style='grid-template-columns:repeat({len(items)},1fr)'>{fs}</div></div>"
    if tipo == "fuentes":
        return f"<div class='bloque fuentes'>{parrafos(b['texto'])}</div>"
    raise ValueError(f"Tipo de bloque desconocido: {tipo}")


def portada(d: dict) -> str:
    lineas = d["titulo"] if isinstance(d["titulo"], list) else [d["titulo"]]
    h1 = "".join(f"<span>{md(l)}</span>" for l in lineas[:-1]) + f"<span class='resalte'>{md(lineas[-1])}</span>"
    kpis = d.get("kpis", [])
    k = "".join(f"<div class='kpi'><div class='v'>{md(x['valor'])}</div><div class='e'>{md(x['etiqueta'])}</div><div class='d'>{md(x.get('detalle', ''))}</div></div>" for x in kpis)
    por = d.get("preparado_por", {"nombre": "Aragon", "detalle": "Jordan David Micolta Aragón"})
    para = d.get("preparado_para")
    tipo = TIPOS.get(d.get("tipo", "informe"), "Documento")
    bloque_para = (f"<div><div class='mono'>Preparado para</div><div class='quien'>{md(para.get('nombre', ''))}</div><div class='donde'>{md(para.get('detalle', ''))}</div></div>"
                   if para else "")
    return f"""<section class="portada"><div class="escena"><div class="muro"></div><div class="rendija"></div><div class="suelo"></div>
      <div class="capa">
        <div class="cabeza"><div><img class="logo" src="{uri(LOGO / 'logo-horizontal-blanco.svg')}"><div class="mono sub">{md(d.get('area', 'Software a medida para negocios reales'))}</div></div>
          <div class="mono meta">{md(tipo)} · {md(d.get('codigo', ''))}<br>{md(d.get('version', ''))} · {md(d.get('fecha', ''))}</div></div>
        <div class="centro"><div class="pastilla mono"><i></i>{md(d.get('etiqueta', tipo))}</div><h1>{h1}</h1>
          <div class="resumen">{md(d.get('resumen', ''))}</div>
          {f'<div class="kpis" style="grid-template-columns:repeat({len(kpis)},1fr)">{k}</div>' if kpis else ''}</div>
        <div class="pie-portada">{bloque_para}<div><div class='mono'>Preparado por</div><div class="quien">{md(por.get('nombre', 'Aragon'))}</div><div class="donde">{md(por.get('detalle', ''))}</div></div>
          <img class="iso" src="{uri(LOGO / 'simbolo-blanco.svg')}"></div>
      </div></div></section>"""


def contraportada(d: dict) -> str:
    c = {**CONTACTO, **(d.get("contacto") or {})}
    sig = d.get("siguiente_paso")
    paso = (f"<div class='paso'><div class='mono'>Siguiente paso</div><p>{md(sig)}</p></div>" if sig else "")
    filas = "".join(f"<div class='fila'><span class='mono'>{md(k)}</span><span>{md(v)}</span></div>"
                    for k, v in (("Correo", c.get("correo")), ("Agenda", c.get("agenda")), ("WhatsApp", c.get("whatsapp")), ("Web", c.get("web")), ("Desde", c.get("lugar"))) if v)
    return f"""<section class="contra"><div class="escena"><div class="muro"></div><div class="rendija"></div><div class="suelo"></div>
      <div class="capa"><img class="grande" src="{uri(LOGO / 'simbolo-blanco.svg')}">
        <div class="lema">Software a medida<br><span>para negocios reales.</span></div>
        {paso}<div class="contacto">{filas}</div>
        <div class="mono cierre">Ideas · Procesos · Personas · Sistemas</div></div></div></section>"""


def secciones(d: dict) -> str:
    out = []
    for i, s in enumerate(d.get("secciones", []), 1):
        num = f"{i:02d}"
        empieza_pagina = i == 1 or s.get("nueva_pagina", True)
        clase = "nueva" if (i > 1 and empieza_pagina) else "continua"
        enc = s.get("encabezado", s["titulo"])
        cuerpo = "".join(bloque(b) for b in s.get("bloques", []))
        sub = f"<p>{md(s['subtitulo'])}</p>" if s.get("subtitulo") else ""
        cabecera = (f"""<div class="cabecera"><img src="{uri(LOGO / 'logo-horizontal-mono-negro.svg')}"><span class="mono">{num} · {md(enc)}</span></div>"""
                    if empieza_pagina else "")
        out.append(f"""<section class="seccion {clase}">{cabecera}
          <div class="titulo-seccion"><div class="numero">{num}</div><div><h2>{md(s['titulo'])}</h2>{sub}</div></div>{cuerpo}</section>""")
    return "".join(out)


def documento(cuerpo: str) -> str:
    css = (AQUI / "estilos.css").read_text(encoding="utf-8")
    return f"<!doctype html><html lang='es'><head><meta charset='utf-8'><style>{fuentes_css()}{css}</style></head><body>{cuerpo}</body></html>"


def pdf(pg, html_doc: str, pie: str | None) -> bytes:
    tmp = AQUI / "_tmp_documento.html"
    tmp.write_text(html_doc, encoding="utf-8")
    try:
        pg.goto(tmp.as_uri()); pg.wait_for_load_state("networkidle"); pg.evaluate("document.fonts.ready")
        opciones = dict(format="A4", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        if pie:
            opciones.update(display_header_footer=True, header_template="<span></span>", footer_template=pie,
                            margin={"top": "9mm", "bottom": "16mm", "left": "0", "right": "0"})
        return pg.pdf(**opciones)
    finally:
        tmp.unlink(missing_ok=True)


def generar(yaml_path: Path, salida: Path):
    d = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
    tipo = TIPOS.get(d.get("tipo", "informe"), "Documento")
    pie = ("<div style=\"width:100%;padding:0 15mm;font-family:monospace;font-size:6.4pt;letter-spacing:.14em;color:#6b6b6b;"
           "display:flex;justify-content:space-between;text-transform:uppercase\">"
           f"<span>Aragon · {html.escape(tipo)} · {html.escape(str(d.get('codigo', '')))}</span>"
           "<span><span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></span></div>")
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        partes = [pdf(pg, documento(portada(d)), None), pdf(pg, documento(secciones(d)), pie)]
        if d.get("contraportada", True):
            partes.append(pdf(pg, documento(contraportada(d)), None))
        b.close()
    w = PdfWriter()
    for parte in partes:
        for page in PdfReader(io.BytesIO(parte)).pages:
            w.add_page(page)
    titulo = " ".join(d["titulo"]) if isinstance(d["titulo"], list) else d["titulo"]
    w.add_metadata({"/Title": titulo, "/Author": "Aragon", "/Subject": f"{tipo} {d.get('codigo', '')}"})
    with open(salida, "wb") as f:
        w.write(f)
    print(f"Documento generado: {salida}")


if __name__ == "__main__":
    entrada = Path(sys.argv[1])
    generar(entrada, Path(sys.argv[2]) if len(sys.argv) > 2 else entrada.with_suffix(".pdf"))
