export type FaqTopic = 'Empezar' | 'Costos y tiempos' | 'Durante el proyecto' | 'Después de entregar' | 'Tecnología y datos';

export type Faq = { id: string; topic: FaqTopic; q: string; a: string; home?: boolean };

export const faqTopics: FaqTopic[] = ['Empezar', 'Costos y tiempos', 'Durante el proyecto', 'Después de entregar', 'Tecnología y datos'];

export const faqs: Faq[] = [
  {
    id: 'como-empezamos',
    topic: 'Empezar',
    home: true,
    q: '¿Cómo empezamos?',
    a: 'Con una llamada de 30 minutos. Nos cuentas qué pasa hoy y qué quieres cambiar. Si vemos un proyecto, te proponemos una sesión de diagnóstico y después una propuesta con alcance, plazo y precio.',
  },
  {
    id: 'que-necesito',
    topic: 'Empezar',
    q: '¿Qué necesito tener listo antes de escribirles?',
    a: 'Nada técnico. Basta con saber qué te molesta del proceso actual. Si tienes ejemplos (una hoja de cálculo, capturas de chats, un formato), ayudan mucho en el diagnóstico.',
  },
  {
    id: 'tamano',
    topic: 'Empezar',
    q: '¿Trabajan con negocios pequeños?',
    a: 'Sí. Buena parte del trabajo es para negocios que crecieron con WhatsApp y hojas de cálculo y necesitan orden. Ajustamos el alcance a lo que de verdad conviene construir.',
  },
  {
    id: 'fuera-colombia',
    topic: 'Empezar',
    q: '¿Trabajan con clientes fuera de Cali o de Colombia?',
    a: 'Sí. Todo el proceso funciona en remoto: llamadas, revisiones y entregas en línea. Trabajamos en horario de Colombia (UTC−5).',
  },
  {
    id: 'cuanto-cuesta',
    topic: 'Costos y tiempos',
    home: true,
    q: '¿Cuánto cuesta un proyecto?',
    a: 'Depende del alcance, por eso no publicamos una tarifa fija. Después del diagnóstico recibes una propuesta con precio cerrado para lo acordado, sin cobros por hora que crecen sin aviso.',
  },
  {
    id: 'cuanto-tarda',
    topic: 'Costos y tiempos',
    home: true,
    q: '¿Cuánto tarda?',
    a: 'Una automatización puntual puede estar lista en días; una app web completa, en semanas. El plazo exacto va en la propuesta, junto con el plan de entregas.',
  },
  {
    id: 'pagos',
    topic: 'Costos y tiempos',
    q: '¿Cómo se paga?',
    a: 'Por etapas, atadas a entregas que puedes revisar. Las condiciones exactas van en la propuesta.',
  },
  {
    id: 'plantillas',
    topic: 'Durante el proyecto',
    home: true,
    q: '¿Usan plantillas?',
    a: 'No. Cada sistema se diseña para tu proceso. Usamos herramientas probadas por dentro (bases de datos, frameworks, n8n), pero lo que ves y usas está hecho para ti.',
  },
  {
    id: 'cambios',
    topic: 'Durante el proyecto',
    q: '¿Qué pasa si quiero cambiar algo a mitad de camino?',
    a: 'Es normal. Como trabajamos por entregas, los cambios se ven temprano. Si un cambio modifica el alcance, lo conversamos y ajustamos plazo y precio antes de hacerlo.',
  },
  {
    id: 'avance',
    topic: 'Durante el proyecto',
    q: '¿Cómo sé cómo va el proyecto?',
    a: 'Cada entrega queda en línea para que la pruebes, con un registro de cambios. No tienes que esperar al final para ver algo funcionando.',
  },
  {
    id: 'dueno-codigo',
    topic: 'Después de entregar',
    home: true,
    q: '¿De quién es el código?',
    a: 'Tuyo. El código, los datos y los accesos quedan a tu nombre, con documentación. Puedes seguir con nosotros o llevarlo con otro equipo.',
  },
  {
    id: 'mantenimiento',
    topic: 'Después de entregar',
    q: '¿Qué pasa después de la entrega?',
    a: 'Acompañamos las primeras semanas de uso para corregir y ajustar. Después puedes contratar un plan de mantenimiento con monitoreo, respaldos y mejoras.',
  },
  {
    id: 'sistema-existente',
    topic: 'Después de entregar',
    q: '¿Pueden mejorar un sistema que ya tengo?',
    a: 'Sí. Empezamos revisando lo que existe: a veces conviene mejorarlo y a veces rehacer una parte. Te lo decimos con argumentos antes de tocar nada.',
  },
  {
    id: 'tecnologias',
    topic: 'Tecnología y datos',
    q: '¿Con qué tecnologías trabajan?',
    a: 'Next.js, React y TypeScript para las apps; PostgreSQL y Supabase para los datos; n8n para automatizar; modelos de lenguaje para los agentes; Docker, Caddy y Tailscale para la infraestructura.',
  },
  {
    id: 'ia-inventa',
    topic: 'Tecnología y datos',
    home: true,
    q: '¿Un agente de IA puede inventar respuestas?',
    a: 'Lo limitamos a tu información y a reglas claras, y cada respuesta queda registrada con su fuente. Si no sabe algo, lo dice y pasa la conversación a una persona.',
  },
  {
    id: 'datos',
    topic: 'Tecnología y datos',
    q: '¿Qué hacen con los datos de mi negocio?',
    a: 'Solo los usamos para construir y operar tu sistema. Quedan en servicios a tu nombre, con accesos documentados, y tratamos los datos personales según la Ley 1581 de 2012.',
  },
];
