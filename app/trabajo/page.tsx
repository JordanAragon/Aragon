import type { Metadata } from 'next';
import WorkList from '../components/home/work-list';
import PageIntro, { CtaBand } from '../components/ui/page-intro';
import NextChapter from '../components/ui/next-chapter';

export const metadata: Metadata = {
  title: 'Trabajo',
  description: 'Productos propios, infraestructura propia y proyectos para clientes construidos por Aragon, con su estado real.',
  alternates: { canonical: '/trabajo' },
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        figure="trabajo"
        label="trabajo"
        title="Lo que hemos construido, con su estado tal cual."
        lead="Aquí no hay logos de clientes inventados ni cifras de adorno. Cada proyecto dice qué es, en qué estado está y qué decisiones tomamos."
      />
      <section className="night work-page" data-tone="night" aria-label="Proyectos">
        <div className="shell">
          <WorkList />
          <p className="work-note mono">Las capturas son de cada proyecto tal como está publicado o corriendo hoy; las direcciones privadas del servidor están ocultas.</p>
        </div>
      </section>
      <CtaBand />
      <NextChapter from="/trabajo" />
    </>
  );
}
