# Guía de redacción de documentos Aragon

Un documento de Aragon lo lee alguien con poco tiempo: el dueño de un negocio, un cliente o David. En un minuto sabe qué pasa, cuánto cuesta o qué falta, y qué tiene que hacer.

## Cinco reglas

1. **La conclusión primero.** La portada y el primer párrafo de cada sección dicen el resultado, no el tema. «El sitio funciona; falta decidir y publicar», no «Análisis del estado del sitio».
2. **Una idea por bloque.** Si un párrafo necesita «además» dos veces, son dos bloques.
3. **Cifras con unidad y fuente.** «23 rutas generadas (build del 11 de octubre)», no «varias páginas».
4. **Palabras del negocio del cliente.** Como se lo explicarías en su local: «el pedido llega por WhatsApp y alguien lo copia a mano en una hoja», no «el flujo de captura de datos presenta fricción».
5. **Decir lo que no se sabe.** Lo no verificado se dice y se dice cómo verificarlo. Nunca se rellena ni se inventa un cliente, una cifra o un testimonio.

## Tipos de documento

| Tipo | Código | Para qué | Estructura |
| --- | --- | --- | --- |
| `informe` | `AR-INF-AAAA-NNN` | Estado, diagnóstico, auditoría o cierre de un proyecto | Portada con conclusión → respuesta corta → detalle de lo más a lo menos importante → plan (orden, quién, cómo se sabe que quedó) → fuentes |
| `propuesta` | `AR-PT-AAAA-NNN` | Ofrecer un proyecto a un cliente | Portada con lo que el cliente gana → la propuesta en una página → lo que entendimos → alcance → cómo trabajamos (fases) → inversión → supuestos |
| `documento` | `AR-DOC-AAAA-NNN` | Cualquier otro (manual, acta, guía) | La misma lógica: lo importante primero |

Títulos de sección: frases que se entienden solas («Lo que falta para publicar»), no etiquetas («Hallazgos»).

### En una propuesta

- El título de portada habla del cliente, no de Aragon: «Tus pedidos en un solo lugar, sin copiar a mano», no «Propuesta de desarrollo de software».
- «Lo que entendimos de tu negocio» usa lo que dijo el cliente en el diagnóstico, con sus palabras y sus cifras. Si no dio cifras, no se ponen.
- Todo lo que no está en el alcance va en «Fuera de esta propuesta».
- Las fases salen de `app/data/process.ts`: lo que dice el sitio y lo que dice la propuesta es lo mismo.
- Precio, forma de pago, garantía y acompañamiento: **por confirmar con David** antes de la primera propuesta real (ver `PRODUCT.md`). Hasta entonces la plantilla los deja entre ‹ ›.

## Frases que no se usan

Suenan a relleno o a texto de IA y no dicen nada. Se borran o se cambian por el dato.

| No | En su lugar |
| --- | --- |
| «En el dinámico mundo de…», «En la era digital…», «Hoy más que nunca…» | Empezar por el dato. |
| «Es importante destacar que…», «Cabe resaltar…», «Vale la pena mencionar…» | Decirlo directamente. |
| «En resumen», «En conclusión», «Para finalizar» | El resumen va al inicio. |
| «Robusto», «integral», «holístico», «de vanguardia», «innovador», «de clase mundial», «escalable» sin cifra | El adjetivo concreto o la cifra. |
| «Potenciar», «optimizar» sin decir qué y cuánto, «llevar al siguiente nivel», «sinergia», «impulsar», «transformación digital» | El verbo real: reducir, corregir, agregar, quitar, conectar. |
| «Solución», «ecosistema», «experiencia», «plataforma» usados como relleno | Nombrar la cosa: el panel de pedidos, el formulario, el agente que responde. |
| «Soluciones tecnológicas a medida que se adaptan a tus necesidades» | Qué se construye y para qué. |
| «No solo… sino también…» | Dos frases. |
| «Un viaje», «un camino», «dar un paso más allá», «aliado estratégico» | Lo que se hace, en una línea. |
| «Esto permite…», «Esto garantiza…» sin decir a quién y qué | Sujeto y resultado concretos. |
| Preguntas retóricas («¿Te imaginas…?») | La respuesta, sin la pregunta. |
| Exclamaciones y emojis | Nada. |

## Antes y después

> **Antes:** En Aragon desarrollamos soluciones tecnológicas robustas e innovadoras que potencian la transformación digital de tu negocio.
>
> **Después:** Hoy los pedidos llegan por WhatsApp y alguien los copia en una hoja. Con el panel, el pedido entra una vez y todos ven en qué va.

> **Antes:** Se recomienda abordar de manera prioritaria la optimización de la presencia digital.
>
> **Después:** Faltan cuatro textos por confirmar y la fusión del PR #14. Con eso el sitio se publica.

## Estados: la pieza

Los documentos son monocromos. El estado se lee en el cuadro, la pieza de la marca, y siempre va con su palabra:

| Chip | Pieza | Significa |
| --- | --- | --- |
| `[[ok:Listo]]` | Llena (chip negro) | Funciona y está verificado. |
| `[[alerta:Parcial]]` | A medias | Funciona con limitaciones conocidas. |
| `[[critico:Falta]]` | Vacía, borde grueso | No existe o está roto; bloquea. |
| `[[info:Decisión]]` | Rombo | Depende de una decisión, no de trabajo técnico. |
| `[[neutro:Fuera de alcance]]` | Punteada | No corresponde a este documento. |

## Revisión antes de entregar

- [ ] ¿La portada dice la conclusión (o, en una propuesta, lo que gana el cliente)?
- [ ] ¿Cada cifra tiene unidad, fecha o fuente?
- [ ] ¿Hay alguna frase de la lista de «No»? Buscar y quitar.
- [ ] ¿Queda algún ‹ › sin llenar?
- [ ] ¿Se entiende sin haber estado en la conversación?
- [ ] ¿Está claro qué es dato verificado y qué es recomendación?
- [ ] ¿Las acciones tienen orden, responsable y cómo se sabe que quedaron?
