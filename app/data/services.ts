/**
 * Los tres servicios de Aragon, con la IA primero. Cada uno tiene su página
 * (/servicios/<slug>) y una parada en «Del desorden al sistema» del inicio:
 * `forma` dice qué figura forman las partículas cuando el recorrido llega a ese
 * servicio. El orden sigue a un pedido: el agente lo atiende, la automatización
 * lo mueve y el software lo deja en su lugar.
 */

export type ServiceSlug = 'agentes-ia' | 'automatizacion' | 'apps-web';

export type Service = {
  slug: ServiceSlug;
  index: string;
  name: string;
  short: string;
  verb: string;
  promise: string;
  summary: string;
  forma: 'conversacion' | 'flujo' | 'tabla';
  signs: string[];
  examples: { title: string; body: string }[];
  includes: string[];
  stack: string[];
  outcome: string;
  faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: 'agentes-ia',
    index: '01',
    name: 'Desarrollo agéntico',
    short: 'Agentes de IA',
    verb: 'Responder',
    promise: 'Agentes de IA que atienden tu WhatsApp a toda hora, con tu información y sin inventar.',
    summary:
      'Agentes conversacionales en WhatsApp o en tu web que responden, toman pedidos, agendan citas y hacen el trabajo en tus sistemas. Saben cuándo pasar la conversación a una persona.',
    forma: 'conversacion',
    signs: [
      'Respondes las mismas preguntas muchas veces al día.',
      'Los mensajes que llegan de noche se responden al otro día.',
      'La calidad de la atención depende de quién esté de turno.',
      'Tienes información útil que tus clientes no encuentran.',
    ],
    examples: [
      { title: 'Atención en WhatsApp', body: 'Responde horarios, precios, estado de pedidos y preguntas frecuentes con tu información.' },
      { title: 'Un agente que hace el trabajo', body: 'No solo contesta: toma el pedido, lo registra en tu sistema, agenda la cita y avisa a tu equipo.' },
      { title: 'Asistente interno', body: 'Tu equipo le pregunta por procesos, inventario o clientes y responde con la fuente.' },
    ],
    includes: [
      'Base de conocimiento con tu información',
      'Conexión a WhatsApp, web o tus sistemas',
      'Acciones en tus herramientas: pedidos, citas, avisos',
      'Reglas para pasar a una persona',
      'Registro de conversaciones y de fuentes usadas',
      'Pruebas con preguntas reales antes de publicar',
    ],
    stack: ['Modelos de lenguaje', 'WhatsApp Business', 'n8n', 'Bases vectoriales', 'Supabase'],
    outcome: 'Un agente que atiende de día y de noche, hace su parte del trabajo y deja trazado de dónde sacó cada respuesta.',
    faq: [
      { q: '¿El agente puede inventar respuestas?', a: 'Lo limitamos a tu información y a reglas claras. Si no sabe algo, lo dice y pasa la conversación a una persona.' },
      { q: '¿Mis clientes van a saber que es un asistente?', a: 'Sí. Recomendamos decirlo desde el primer mensaje: genera confianza y evita malentendidos.' },
      { q: '¿Qué es desarrollo agéntico?', a: 'Construir agentes que no solo conversan: consultan tus datos y ejecutan pasos en tus herramientas, como crear un pedido o agendar una cita, con reglas claras de qué pueden hacer solos.' },
    ],
  },
  {
    slug: 'automatizacion',
    index: '02',
    name: 'Automatización de procesos',
    short: 'Automatización',
    verb: 'Conectar',
    promise: 'El trabajo manual se hace solo, y te avisa si algo falla.',
    summary:
      'Eliminamos el copiar y pegar conectando tus herramientas: del WhatsApp al sistema, del formulario a la factura, de la venta al reporte. Tu operación crece sin sumar trabajo manual.',
    forma: 'flujo',
    signs: [
      'Alguien copia y pega datos entre herramientas todos los días.',
      'Los pedidos o solicitudes se pierden entre chats y correos.',
      'Te enteras de un error cuando el cliente ya se quejó.',
      'Los reportes se arman a mano cada semana.',
    ],
    examples: [
      { title: 'Pedidos sin pérdidas', body: 'Cada pedido que entra por WhatsApp, formulario o correo queda registrado y asignado.' },
      { title: 'Avisos a tiempo', body: 'Alertas al equipo cuando un pedido se atrasa, un pago no entra o un proceso se detiene.' },
      { title: 'Reportes que llegan solos', body: 'El resumen del día o de la semana llega a tu correo o a tu WhatsApp, sin armarlo.' },
    ],
    includes: [
      'Mapa del proceso tal como funciona hoy',
      'Flujos en n8n con registro de cada ejecución',
      'Integraciones con tus herramientas actuales',
      'Avisos cuando algo falla',
      'Conexión con tu agente de IA y tu software',
      'Documentación para que no dependas de nosotros',
    ],
    stack: ['n8n', 'APIs', 'WhatsApp Business', 'Google Workspace', 'PostgreSQL', 'Webhooks'],
    outcome: 'Procesos que corren solos, con un registro para saber qué pasó en cada caso.',
    faq: [
      { q: '¿Tengo que cambiar las herramientas que ya uso?', a: 'Casi nunca. Primero conectamos lo que ya tienes; solo proponemos cambiar algo si de verdad estorba.' },
      { q: '¿Qué pasa si una automatización falla?', a: 'Cada flujo tiene avisos: el error llega al equipo con el caso que falló, y queda registrado para reintentarlo.' },
    ],
  },
  {
    slug: 'apps-web',
    index: '03',
    name: 'Software a la medida',
    short: 'Software a la medida',
    verb: 'Ordenar',
    promise: 'Toda tu operación en un solo lugar, hecha para cómo trabaja tu equipo y rápida desde el primer clic.',
    summary:
      'Paneles internos, portales para tus clientes, sistemas de pedidos, inventario o citas y webs que convierten. Software que reemplaza las hojas sueltas, sobre infraestructura web de alta velocidad.',
    forma: 'tabla',
    signs: [
      'La información del negocio vive en hojas de cálculo que solo una persona entiende.',
      'Pagas varias herramientas y ninguna se adapta a tu proceso.',
      'Tu web tarda en cargar y los clientes se van antes de verla.',
      'Tus clientes te escriben para cosas que podrían resolver solos.',
    ],
    examples: [
      { title: 'Panel de operación', body: 'Pedidos, inventario, tareas y responsables en una vista, con permisos por rol.' },
      { title: 'Portal de clientes', body: 'Tus clientes consultan su estado, descargan documentos y hacen solicitudes sin escribirte.' },
      { title: 'Web de alta velocidad', body: 'Una web que carga al instante, explica qué haces y lleva a una conversación, bien posicionada.' },
    ],
    includes: [
      'Diagnóstico del proceso y mapa de pantallas',
      'Diseño de interfaz propio, no una plantilla',
      'Desarrollo con roles, permisos y registro de cambios',
      'Base de datos con respaldos',
      'Despliegue en infraestructura web de alta velocidad, en tu dominio',
      'Capacitación corta para el equipo',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    outcome: 'Una herramienta en producción que tu equipo usa todos los días, que carga rápido y que puedes seguir ampliando.',
    faq: [
      { q: '¿Puede funcionar en el celular?', a: 'Sí. Diseñamos primero para el uso real: si tu equipo trabaja desde el celular, la app se piensa para el celular.' },
      { q: '¿Qué pasa con la información que ya tengo en Excel?', a: 'La migramos. Limpiamos los datos y los cargamos en la nueva base antes de que empieces a usarla.' },
      { q: '¿Qué es infraestructura web de alta velocidad?', a: 'Que tu app o tu web se sirve desde una red global, con páginas preparadas de antemano e imágenes optimizadas. Carga rápido en cualquier ciudad y aguanta picos de visitas sin que administres servidores.' },
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

/** El nombre corto dentro de una frase: «Ver agentes de IA», no «Ver agentes de ia». */
export function inSentence(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
