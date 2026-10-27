import Link from 'next/link';
import Hero from './components/home/hero';
import OrderStory from './components/home/order-story';
import ScrollWords from './components/home/scroll-words';
import ServicesShowcase from './components/home/services-showcase';
import StackRibbon from './components/home/stack-ribbon';
import WorkList from './components/home/work-list';
import ContactBlock from './components/contact/contact-block';
import FaqList from './components/ui/faq-list';
import ProcessTimeline from './components/ui/process-timeline';
import { ArrowRight } from './components/ui/icons';
import { faqs } from './data/faq';
import { principles } from './data/process';
import { site } from './data/site';

export default function Home() {
  const homeFaqs = faqs.filter((f) => f.home);
  return (
    <>
      <Hero />

      <section className="problem night" data-tone="night" aria-labelledby="problem-title">
        <div className="shell">
          <p className="section-label">el problema</p>
          <h2 id="problem-title" className="sr-only">
            El problema
          </h2>
          <ScrollWords
            className="problem-text"
            text="La mayoría de negocios no necesita otra herramienta. Necesita que la información deje de vivir en chats, libretas y hojas sueltas, y que el trabajo manual se haga solo. Eso es lo que automatizamos."
          />
          <ul className="problem-signs">
            <li>
              <span className="sign-mark" aria-hidden="true" />
              Alguien copia y pega datos entre herramientas todos los días.
            </li>
            <li>
              <span className="sign-mark" aria-hidden="true" />
              Para saber cómo va el mes hay que preguntarle a una persona.
            </li>
            <li>
              <span className="sign-mark" aria-hidden="true" />
              Los mensajes de la noche se responden al otro día.
            </li>
          </ul>
        </div>
      </section>

      <OrderStory />

      <ServicesShowcase />

      <section className="process paper" data-tone="paper" aria-labelledby="process-title">
        <div className="shell">
          <p className="section-label">cómo trabajamos</p>
          <div className="split-head">
            <h2 id="process-title">Un prototipo funcionando en 48 horas, antes de comprometer el proyecto completo.</h2>
            <div>
              <p>Aprobado el alcance, en 48 horas tocas algo que funciona. Después, entregas cortas hasta producción, sin meses de silencio entre la firma y la entrega.</p>
              <Link href="/como-trabajamos" className="text-link">
                El proceso completo <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      <section className="work-section night" data-tone="night" aria-labelledby="work-title">
        <div className="shell">
          <p className="section-label">trabajo</p>
          <div className="split-head">
            <h2 id="work-title">Lo que hemos construido, con su estado tal cual.</h2>
            <div>
              <p>Productos propios, nuestro propio servidor y proyectos para clientes. Lo que está en desarrollo se dice así.</p>
              <Link href="/trabajo" className="text-link">
                Ver todo el trabajo <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>
          <WorkList />
        </div>
      </section>

      <section className="about-teaser paper" data-tone="paper" aria-labelledby="about-title">
        <div className="shell">
          <p className="section-label">nosotros</p>
          <div className="about-grid">
            <div>
              <h2 id="about-title">Una agencia pequeña a propósito: quien diseña tu sistema es quien lo construye y lo mantiene.</h2>
              <p className="about-lead">
                Aragon nació en Cali de la mano de {site.founder}, desarrollador de software. Empezó arreglando computadores y redes; hoy construye agentes de IA, automatizaciones y software a la medida que corren en producción.
              </p>
              <Link href="/nosotros" className="btn btn-primary">
                Conocer la agencia <ArrowRight className="arrow" />
              </Link>
            </div>
            <ul className="principles">
              {principles.map((p) => (
                <li key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <StackRibbon />

      <section className="faq-section paper" data-tone="paper" aria-labelledby="faq-title">
        <div className="shell faq-grid">
          <div>
            <p className="section-label">preguntas</p>
            <h2 id="faq-title">Lo que casi todos preguntan antes de empezar.</h2>
            <Link href="/preguntas" className="text-link">
              Todas las preguntas <ArrowRight className="arrow" />
            </Link>
          </div>
          <FaqList items={homeFaqs} idPrefix="inicio-" />
        </div>
      </section>

      <section className="contact-section night" data-tone="night" aria-labelledby="contacto-title" id="contacto">
        <div className="shell">
          <p className="section-label">contacto</p>
          <ContactBlock />
        </div>
      </section>
    </>
  );
}
