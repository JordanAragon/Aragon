import type { Metadata } from 'next';
import PageIntro from '../components/ui/page-intro';
import { site } from '../data/site';

export const metadata: Metadata = {
  title: 'Tratamiento de datos',
  description: 'Cómo trata Aragon los datos personales que recibe por su sitio web, según la Ley 1581 de 2012 de Colombia.',
  alternates: { canonical: '/privacidad' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro label="tratamiento de datos" title="Tratamiento de datos personales." lead="Versión del 11 de octubre de 2026." />
      <section className="paper legal" data-tone="paper" aria-label="Política">
        <div className="shell">
          <div className="prose legal-prose">
          <h2>Quién es el responsable</h2>
          <p>
            {site.founderLegal}, que opera con el nombre Aragon, en {site.location}. Contacto: <span className="mono">{site.contactEmail}</span>.
          </p>
          <h2>Qué datos recibimos</h2>
          <p>
            Este sitio no guarda datos en un servidor propio. El formulario de contacto arma un mensaje en tu navegador y lo envía por WhatsApp o por tu correo, según elijas. Recibimos lo que tú escribas en ese mensaje (por ejemplo, tu nombre, tu empresa y la descripción de tu caso) y los datos propios del canal (tu número o tu correo).
          </p>
          <p>Si agendas una llamada, Cal.com recibe los datos de la reserva según su propia política de privacidad.</p>
          <h2>Para qué los usamos</h2>
          <p>Solo para responder tu mensaje, preparar la llamada y, si hay un proyecto, para la relación comercial. No vendemos ni compartimos tus datos con terceros para publicidad.</p>
          <h2>Tus derechos</h2>
          <p>
            Según la Ley 1581 de 2012, puedes conocer, actualizar, rectificar y pedir que eliminemos tus datos, y revocar la autorización. Escríbenos a <span className="mono">{site.contactEmail}</span> y respondemos dentro de los plazos de ley.
          </p>
          <h2>Cuánto tiempo los guardamos</h2>
          <p>Mientras dure la conversación o el proyecto y lo que exijan las obligaciones legales y contables. Después los eliminamos.</p>
          </div>
        </div>
      </section>
    </>
  );
}
