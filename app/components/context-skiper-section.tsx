'use client';

import CanvasCrowd from './skiper/canvas-crowd';
import TextScrollTitle from './skiper/text-scroll-title';

const SKIPER_SPRITE = 'https://assets.codepen.io/721952/all-peeps.png';

export default function ContextSkiperSection() {
  return (
    <section id="contexto" className="context-skiper section-shell" aria-labelledby="context-skiper-title">
      <style>{`
        .context-skiper{background:var(--bg);border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);overflow:hidden}
        .context-skiper-grid{display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);min-height:100svh;gap:clamp(36px,5.5vw,88px);align-items:stretch}
        .context-skiper-copy{align-self:center;max-width:640px;padding-block:clamp(72px,9svh,120px)}
        .context-skiper-copy .section-label{display:inline-block;margin-bottom:24px}
        .context-skiper-copy .text-scroll-title{max-width:700px;margin:0;font-size:clamp(58px,7.2vw,108px);line-height:.82;letter-spacing:-.095em}
        .context-skiper-copy>p{max-width:530px;margin:34px 0 40px;color:#4f4f55;font-size:14px;line-height:1.9}
        .context-skiper-facts{max-width:520px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .context-skiper-fact{display:grid;grid-template-columns:86px minmax(0,1fr);gap:18px;padding:14px 0;border-bottom:1px solid rgba(196,195,189,.72)}
        .context-skiper-fact:last-child{border-bottom:0}
        .context-skiper-fact small{color:var(--muted);font:900 8px/1 var(--body);letter-spacing:.15em;text-transform:uppercase}
        .context-skiper-fact b{font:800 11px/1.35 var(--body);letter-spacing:.02em}
        .context-skiper-link{display:inline-flex;margin-top:28px;color:var(--ink);font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;text-decoration:underline;text-underline-offset:5px}
        .context-skiper-visual{position:relative;min-height:100svh;overflow:hidden;background:#000}
        .context-skiper-stage{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#000}
        .context-skiper-stage .canvas-crowd-wrap{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:hidden!important;z-index:1!important}
        .context-skiper-stage .canvas-crowd{position:absolute!important;left:0!important;bottom:0!important;width:100%!important;height:100%!important;display:block!important;opacity:1!important;filter:none!important;mask-image:none!important;-webkit-mask-image:none!important}
        @media (max-width:1100px){.context-skiper-grid{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:34px}.context-skiper-copy .text-scroll-title{font-size:clamp(52px,7.4vw,90px)}}
        @media (max-width:780px){.context-skiper-grid{grid-template-columns:1fr;min-height:0;gap:0}.context-skiper-visual{min-height:72svh;order:-1}.context-skiper-copy{padding-block:64px 72px}.context-skiper-copy .text-scroll-title{font-size:clamp(50px,13vw,82px)}.context-skiper-copy>p{font-size:13px}.context-skiper-fact{grid-template-columns:72px minmax(0,1fr)}}
        @media (max-width:520px){.context-skiper-visual{min-height:64svh}.context-skiper-copy{padding-block:54px 64px}.context-skiper-copy .text-scroll-title{font-size:clamp(45px,13.5vw,66px)}.context-skiper-fact{gap:14px}}
      `}</style>

      <div className="page-shell context-skiper-grid">
        <div className="context-skiper-copy">
          <span className="section-number">04</span>
          <span className="section-label">LO QUE HAY DETRÁS</span>
          <TextScrollTitle
            id="context-skiper-title"
            segments={['No solo diseño', { text: 'la superficie.', className: 'title-muted' }]}
          />
          <p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso pienso en la interfaz, pero también en lo que tiene que funcionar detrás.</p>
          <div className="context-skiper-facts">
            <div className="context-skiper-fact"><small>BASE</small><b>Sistemas / Tecnología</b></div>
            <div className="context-skiper-fact"><small>ENFOQUE</small><b>Producto / Experiencia</b></div>
            <div className="context-skiper-fact"><small>ORIGEN</small><b>Popayán, Colombia</b></div>
          </div>
          <a href="https://github.com/JordanAragon" target="_blank" rel="noopener noreferrer" className="context-skiper-link">Ver trabajo técnico ↗</a>
        </div>

        <div className="context-skiper-visual" aria-hidden="true">
          <div className="context-skiper-stage">
            <CanvasCrowd src={SKIPER_SPRITE} rows={15} cols={7} />
          </div>
        </div>
      </div>
    </section>
  );
}
