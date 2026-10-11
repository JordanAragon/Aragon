/**
 * Los cuatro servicios de Aragon. Cada uno tiene su página (/servicios/<slug>)
 * y una parada en «Del desorden al sistema» del inicio: `forma` dice qué figura
 * forman las partículas cuando el recorrido llega a ese servicio.
 */

export type ServiceSlug = 'apps-web' | 'automatizacion' | 'agentes-ia' | 'infraestructura';

export type Service = {
  slug: ServiceSlug;
  index: string;
  name: string;
  short: string;
  verb: string;
  promise: string;
  summary: string;
  forma: 'tabla' | 'flujo' | 'conversacion' | 'latido';
  signs: string[];
  examples: { title: string; body: string }[];
  includes: string[];
  stack: string[];
  outcome: string;
  faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: 'apps-web',
    index: '01',
    name: 'Apps web a medida',
    short: 'Apps web',
    verb: 'Ordenar',
    promise: 'Toda tu operación en un solo lugar, hecha para cómo trabaja tu equipo.',
    summary:
      'Paneles internos, portales para tus clientes y sistemas de pedidos, inventario o citas. Software que reemplaza las hojas de cálculo sueltas y que tu equipo entiende sin manual.',
    forma: 'tabla',
    signs: [
      'La información del negocio vive en hojas de cálculo que solo una persona entiende.',
      'Pagas varias herramientas y ninguna se adapta a tu proceso.',
      'Para saber cómo va el mes hay que preguntarle a alguien.',
      'Tus clientes te escriben para cosas que podrían resolver solos.',
    ],
    examples: [
      { title: 'Panel de operación', body: 'Pedidos, inventario, tareas y responsables en una vista, con permisos por rol.' },
      { title: 'Portal de clientes', body: 'Tus clientes consultan su estado, descargan documentos y hacen solicitudes sin escribirte.' },
      { title: 'Sitio que convierte', body: 'Una web que explica qué haces y lleva a una conversación, rápida y bien posicionada.' },
    ],
    includes: [
      'Diagnóstico del proceso y mapa de pantallas',
      'Diseño de interfaz propio, no una plantilla',
      'Desarrollo con roles, permisos y registro de cambios',
      'Base de datos con respaldos',
      'Despliegue en tu dominio',
      'Capacitación corta para el equipo',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    outcome: 'Una herramienta en producción que tu equipo usa todos los días y que puedes seguir ampliando.',
    faq: [
      { q: '¿Puede funcionar en el celular?', a: 'Sí. Diseñamos primero para el uso real: si tu equipo trabaja desde el celular, la app se piensa para el celular.' },
      { q: '¿Qué pasa con la información que ya tengo en Excel?', a: 'La migramos. Limpiamos los datos y los cargamos en la nueva base antes de que empieces a usarla.' },
    ],
  },
  {
    slug: 'automatizacion',
    index: '02',
    name: 'Automatización de procesos',
    short: 'Automatización',
    verb: 'Conectar',
    promise: 'El trabajo repetido se hace solo, y te avisa si algo falla.',
    summary:
      'Conectamos tus herramientas para que la información viaje sola: del WhatsApp al sistema, del formulario a la factura, de la venta al reporte. Con registro de cada ejecución.',
    forma: 'flujo',
    signs: [
      'Alguien copia y pega datos entre herramientas todos los días.',
      'Los pedidos o solicitudes se pierden entre chats y correos.',
      'Te enteras de un error cuando el cliente ya se quejó.',
      'Los reportes se arman a mano cada semana.',
    ],
    examples: [
      { title: 'Pedidos sin pérdidas', body: 'Cada pedido que entra por WhatsApp, formulario o correo queda registrado y asignado.' },
      { title: 'Avisos a tiempo', body: 'Alertas al equipo cuando un pedido se atrasa, un pago no entra o un servicio se cae.' },
      { title: 'Reportes que llegan solos', body: 'El resumen del día o de la semana llega a tu correo o a tu WhatsApp, sin armarlo.' },
    ],
    includes: [
      'Mapa del proceso tal como funciona hoy',
      'Flujos en n8n, en la nube o en un servidor tuyo',
      'Integraciones con tus herramientas actuales',
      'Avisos cuando algo falla',
      'Registro de cada ejecución',
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
    slug: 'agentes-ia',
    index: '03',
    name: 'Agentes de IA',
    short: 'Agentes de IA',
    verb: 'Responder',
    promise: 'Un asistente que atiende a toda hora con tu información, sin inventar.',
    summary:
      'Asistentes en WhatsApp o en tu web que responden preguntas, toman pedidos, agendan citas y consultan tus datos. Saben cuándo pasar la conversación a una persona.',
    forma: 'conversacion',
    signs: [
      'Respondes las mismas preguntas muchas veces al día.',
      'Los mensajes que llegan de noche se responden al otro día.',
      'La calidad de la atención depende de quién esté de turno.',
      'Tienes información útil que tus clientes no encuentran.',
    ],
    examples: [
      { title: 'Atención en WhatsApp', body: 'Responde horarios, precios, estado de pedidos y preguntas frecuentes con tu información.' },
      { title: 'Agendamiento', body: 'Propone horarios disponibles, confirma la cita y la deja en tu calendario.' },
      { title: 'Asistente interno', body: 'Tu equipo le pregunta por procesos, inventario o clientes y responde con la fuente.' },
    ],
    includes: [
      'Base de conocimiento con tu información',
      'Conexión a WhatsApp, web o tus sistemas',
      'Reglas para pasar a una persona',
      'Registro de conversaciones y de fuentes usadas',
      'Pruebas con preguntas reales antes de publicar',
      'Ajustes con el uso durante el primer mes',
    ],
    stack: ['Modelos de lenguaje', 'n8n', 'WhatsApp Business', 'Bases vectoriales', 'Supabase'],
    outcome: 'Un agente que atiende de día y de noche y deja trazado de dónde sacó cada respuesta.',
    faq: [
      { q: '¿El agente puede inventar respuestas?', a: 'Lo limitamos a tu información y a reglas claras. Si no sabe algo, lo dice y pasa la conversación a una persona.' },
      { q: '¿Mis clientes van a saber que es un asistente?', a: 'Sí. Recomendamos decirlo desde el primer mensaje: genera confianza y evita malentendidos.' },
    ],
  },
  {
    slug: 'infraestructura',
    index: '04',
    name: 'Infraestructura y servidores',
    short: 'Infraestructura',
    verb: 'Vigilar',
    promise: 'Tus sistemas corriendo, respaldados y vigilados, bajo tu control.',
    summary:
      'Montamos y mantenemos los servidores donde viven tus sistemas: contenedores, respaldos, acceso privado y monitoreo. Lo mismo que usamos en nuestro propio servidor.',
    forma: 'latido',
    signs: [
      'No sabes dónde están alojados tus sistemas ni quién tiene acceso.',
      'Nunca has probado restaurar un respaldo.',
      'Te enteras de una caída porque alguien te avisa.',
      'Pagas servicios en la nube que nadie revisa.',
    ],
    examples: [
      { title: 'Servidor propio', body: 'Tus herramientas en un servidor con contenedores, certificados y respaldos programados.' },
      { title: 'Monitoreo', body: 'Cada servicio vigilado, con aviso inmediato si deja de responder.' },
      { title: 'Migración', body: 'Pasamos tus sistemas de un proveedor a otro sin perder datos.' },
    ],
    includes: [
      'Inventario de lo que tienes hoy',
      'Servidor con Docker y proxy con certificados',
      'Acceso privado con Tailscale',
      'Respaldos programados y prueba de restauración',
      'Monitoreo con avisos',
      'Documentación de accesos y procedimientos',
    ],
    stack: ['Linux', 'Docker', 'Caddy', 'Tailscale', 'PostgreSQL', 'Uptime Kuma'],
    outcome: 'Infraestructura documentada, vigilada y tuya: sabes qué corre, dónde y quién entra.',
    faq: [
      { q: '¿Necesito un servidor propio?', a: 'No siempre. Te decimos con números si te conviene la nube, un servidor propio o una mezcla.' },
      { q: '¿Quién tiene las contraseñas?', a: 'Tú. Los accesos quedan a tu nombre y documentados; nosotros entramos con permisos que puedes revocar.' },
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
