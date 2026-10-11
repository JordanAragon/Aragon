/** Cómo trabajamos: cuatro fases en orden. El orden es información (es una secuencia real). */

export type Phase = {
  n: string;
  name: string;
  line: string;
  body: string;
  youGive: string[];
  youGet: string[];
};

export const phases: Phase[] = [
  {
    n: '01',
    name: 'Diagnóstico',
    line: 'Entendemos cómo trabaja tu negocio hoy.',
    body:
      'Empieza con una llamada de 30 minutos. Si hay un proyecto, seguimos con una sesión para recorrer el proceso real: quién hace qué, con qué herramientas y dónde se pierde el tiempo o la información.',
    youGive: ['30 minutos para la primera llamada', 'Acceso a quien conoce el proceso', 'Ejemplos reales: hojas, chats, formatos'],
    youGet: ['Mapa del proceso actual', 'Qué conviene construir primero y por qué', 'Propuesta con alcance, plazo y precio cerrados'],
  },
  {
    n: '02',
    name: 'Prototipo',
    line: 'Decides sobre algo que puedes tocar.',
    body:
      'Antes de construir, armamos una versión navegable de las pantallas o del flujo principal. Lo revisas con tu equipo y lo ajustamos hasta que tenga sentido para quien lo va a usar.',
    youGive: ['Una o dos sesiones de revisión', 'Comentarios de quien usará el sistema'],
    youGet: ['Prototipo navegable', 'Diseño de interfaz aprobado', 'Plan de entregas'],
  },
  {
    n: '03',
    name: 'Construcción',
    line: 'Entregas cortas que pruebas mientras avanzan.',
    body:
      'Construimos por partes. Cada entrega queda en línea para que la pruebes con datos reales. Lo que no funciona se corrige antes de seguir, no al final.',
    youGive: ['Pruebas de cada entrega', 'Datos reales para cargar'],
    youGet: ['Avances en línea', 'Registro de cambios', 'Código en un repositorio a tu nombre'],
  },
  {
    n: '04',
    name: 'Producción',
    line: 'Lo ponemos a correr y lo seguimos cuidando.',
    body:
      'Desplegamos, migramos la información y acompañamos las primeras semanas de uso. Después puedes seguir con un plan de mantenimiento o llevarlo con tu equipo: la documentación es tuya.',
    youGive: ['Un responsable del lado de tu negocio'],
    youGet: ['Sistema en producción', 'Monitoreo y respaldos', 'Documentación y accesos a tu nombre'],
  },
];

export const principles = [
  { title: 'Entender antes de construir', body: 'Ninguna línea de código antes de conocer el proceso real. La mitad de las soluciones salen del diagnóstico.' },
  { title: 'Funciona en producción', body: 'Entregamos sistemas que se usan, con datos reales, monitoreo y respaldos. Un demo bonito no cuenta como entrega.' },
  { title: 'Es tuyo', body: 'El código, los datos y los accesos quedan a tu nombre. Puedes seguir con nosotros o sin nosotros.' },
  { title: 'Sin humo', body: 'Te decimos qué no conviene construir. Si una herramienta que ya existe te sirve, te lo decimos primero.' },
];
