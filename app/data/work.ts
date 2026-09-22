export type WorkItem = {
  slug: string;
  number: string;
  title: string;
  type: string;
  context: string;
  description: string;
  status: string;
  stack: string[];
  proof: string[];
  href?: string;
};

export const work: WorkItem[] = [
  {
    slug: 'aiden',
    number: '01',
    title: 'AiDEN',
    type: 'SISTEMA OPERATIVO',
    context: 'Gestión y trazabilidad para operaciones de vivero.',
    description:
      'Una plataforma para organizar producción, inventario, trazabilidad, ambiente, calidad, costos, personal y reportes alrededor de una misma operación.',
    status: 'PROYECTO REAL / CONSTRUIDO',
    stack: ['React', 'Vite', 'Tailwind', 'Datos operativos'],
    proof: ['9 módulos operativos', 'Roles de usuario', 'Flujos de trazabilidad', 'Persistencia y sincronización local'],
    href: 'https://github.com/JordanAragon/AiDEN',
  },
  {
    slug: 'aragon-server',
    number: '02',
    title: 'Aragon Server',
    type: 'INFRAESTRUCTURA',
    context: 'Entorno self-hosted para servicios personales y operación privada.',
    description:
      'Una infraestructura doméstica diseñada y operada para centralizar archivos, música, servicios internos y acceso remoto sobre Linux, Docker y una red privada.',
    status: 'SISTEMA REAL / OPERADO',
    stack: ['Ubuntu Server', 'Docker', 'Nextcloud', 'Navidrome', 'Tailscale'],
    proof: ['Cloud privado', 'Streaming musical', 'Contenedores gestionados', 'Acceso remoto privado'],
  },
];

export function getWorkItem(slug: string) {
  return work.find((item) => item.slug === slug);
}
