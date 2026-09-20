export type Project = {
  id: string;
  slug: string;
  title: string;
  status: string;
  image: string;
  kicker: string;
  body: string;
  stack: string;
  stackLabel: string;
};

export const projects: Project[] = [
  {
    id: '01',
    slug: 'aragon-finance',
    title: 'Aragon Finance',
    status: 'CONCEPTO / EN DESARROLLO',
    image: '/projects/aragon-finance.svg',
    kicker: 'UN SISTEMA PERSONAL PARA ENTENDER, PLANEAR Y CONTROLAR EL DINERO.',
    body: 'Una plataforma de finanzas personales con patrimonio, flujo mensual, presupuestos y una lectura más clara de cómo se mueve el dinero.',
    stack: 'Next.js · Supabase · FastAPI · Gemini',
    stackLabel: 'DIRECCIÓN TÉCNICA PROPUESTA',
  },
  {
    id: '02',
    slug: 'agro-os',
    title: 'Agro OS',
    status: 'CONCEPTO / EN DESARROLLO',
    image: '/projects/agro-os.svg',
    kicker: 'LA OPERACIÓN AGRÍCOLA, VISTA COMO UN SOLO SISTEMA.',
    body: 'Un centro operativo para viveros y pequeñas operaciones agrícolas: lotes, tareas, trazabilidad, alertas y estado general en una sola experiencia.',
    stack: 'React · Data · Workflows · UX',
    stackLabel: 'DIRECCIÓN DE PRODUCTO',
  },
  {
    id: '03',
    slug: 'nexo',
    title: 'Nexo',
    status: 'CONCEPTO / EN DESARROLLO',
    image: '/projects/nexo-infrastructure.svg',
    kicker: 'UNA CONSOLA PARA HACER VISIBLE TODA TU INFRAESTRUCTURA.',
    body: 'Una interfaz privada para supervisar servicios, almacenamiento, red, disponibilidad y automatizaciones de un entorno self-hosted.',
    stack: 'Next.js · Docker · Linux · APIs',
    stackLabel: 'DIRECCIÓN TÉCNICA PROPUESTA',
  },
  {
    id: '04',
    slug: 'atelier',
    title: 'Atelier',
    status: 'CONCEPTO / EN DESARROLLO',
    image: '/projects/atelier.svg',
    kicker: 'COMERCIO PRIVADO QUE SE SIENTE COMO UNA EXPERIENCIA EDITORIAL.',
    body: 'Una plataforma premium para marcas y clubes de compra con drops limitados, perfiles privados, catálogo curado y una experiencia de checkout más cuidada.',
    stack: 'Next.js · WooCommerce · UX · Commerce',
    stackLabel: 'DIRECCIÓN DE PRODUCTO',
  },
];
