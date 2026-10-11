import type { Faq } from '../../data/faq';

/* Preguntas con <details>: funcionan sin JavaScript, con teclado y con lector de pantalla. */
export default function FaqList({ items, idPrefix = '' }: { items: Pick<Faq, 'id' | 'q' | 'a'>[]; idPrefix?: string }) {
  return (
    <div className="accordion">
      {items.map((item) => (
        <details key={item.id} id={`${idPrefix}${item.id}`} className="acc-item">
          <summary>
            {item.q}
            <span className="acc-icon" aria-hidden="true" />
          </summary>
          <div className="acc-body">
            <div>
              <p>{item.a}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
