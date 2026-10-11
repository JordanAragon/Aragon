import type { Metadata } from 'next';
import WorkList from '../components/home/work-list';
import PageIntro, { CtaBand } from '../components/ui/page-intro';

export const metadata: Metadata = {
  title: 'Trabajo',
  description: 'Productos propios, infraestructura propia y proyectos para clientes construidos por Aragon, con su estado real.',
  alternates: { canonical: '/trabajo' },
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        label="trabajo"
        title="Lo que hemos construido, con su estado tal cual."
        lead="Aquí no hay logos de clientes inventados ni cifras de adorno. Cada proyecto dice qué es, en qué estado está y qué decisiones tomamos."
      />
      <section className="night work-page" data-tone="night" aria-label="Proyectos">
        <div className="shell">
          <WorkList />
          <p className="work-note mono">Las ilustraciones resumen cada proyecto; las capturas reales se agregan cuando cada cliente las aprueba.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
