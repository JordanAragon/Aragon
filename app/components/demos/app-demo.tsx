'use client';

import { useEffect, useState } from 'react';

/*
  Demo de una app web a medida: un panel de pedidos donde cada pedido avanza de
  estado solo, como pasaría con el equipo trabajando. Datos de ejemplo.
*/

type Order = { id: number; client: string; zone: string; status: number };

const CLIENTS = ['Tienda La 14', 'Panadería Sol', 'Droguería Norte', 'Minimercado El Ancla', 'Café Granada', 'Ferretería Centro', 'Frutas del Valle'];
const ZONES = ['Norte', 'Sur', 'Centro', 'Jamundí', 'Oeste'];
const STATUS = ['Recibido', 'En bodega', 'En ruta', 'Entregado'];

function seedOrders(): Order[] {
  return Array.from({ length: 6 }, (_, i) => ({ id: 1042 - i, client: CLIENTS[i % CLIENTS.length], zone: ZONES[i % ZONES.length], status: Math.min(3, Math.floor(i / 1.6)) }));
}

export default function AppDemo({ running = true }: { running?: boolean }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [fresh, setFresh] = useState<number | null>(null);

  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let tick = 0;
    const id = window.setInterval(() => {
      tick += 1;
      setOrders((list) => {
        if (tick % 3 === 0) {
          const nextId = list[0].id + 1;
          setFresh(nextId);
          return [{ id: nextId, client: CLIENTS[nextId % CLIENTS.length], zone: ZONES[nextId % ZONES.length], status: 0 }, ...list].slice(0, 6);
        }
        const movable = list.filter((o) => o.status < 3);
        if (!movable.length) return list;
        const pick = movable[tick % movable.length];
        return list.map((o) => (o.id === pick.id ? { ...o, status: o.status + 1 } : o));
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [running]);

  const counts = STATUS.map((_, s) => orders.filter((o) => o.status === s).length);

  return (
    <div className="demo-app">
      <aside className="demo-app-side" aria-hidden="true">
        <span className="demo-app-brand">
          <i /> Distribuidora
        </span>
        {['Pedidos', 'Inventario', 'Clientes', 'Rutas', 'Reportes'].map((item, i) => (
          <span key={item} className="demo-app-nav" data-active={i === 0}>
            {item}
          </span>
        ))}
      </aside>
      <div className="demo-app-main">
        <div className="demo-app-head">
          <strong>Pedidos de hoy</strong>
          <span className="mono">datos de ejemplo</span>
        </div>
        <dl className="demo-app-stats">
          {STATUS.map((s, i) => (
            <div key={s}>
              <dt>{s}</dt>
              <dd className="tabular">{counts[i]}</dd>
            </div>
          ))}
        </dl>
        <table className="demo-app-table">
          <thead>
            <tr>
              <th scope="col">Pedido</th>
              <th scope="col">Cliente</th>
              <th scope="col">Zona</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} data-fresh={o.id === fresh}>
                <td className="mono tabular">#{o.id}</td>
                <td>{o.client}</td>
                <td>{o.zone}</td>
                <td>
                  <span className="demo-status" data-s={o.status}>
                    <span className="demo-status-track" aria-hidden="true">
                      {[0, 1, 2, 3].map((k) => (
                        <i key={k} data-on={k <= o.status} />
                      ))}
                    </span>
                    {STATUS[o.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
