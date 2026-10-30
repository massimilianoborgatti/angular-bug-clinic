'use client';
import { useEffect, useState } from 'react';
import type { Result } from './orders';
import { OrdersView, useOrderControls } from './orders-view';
export function FixedOrders() {
  const controls = useOrderControls();
  const { client, status, search } = controls;
  const [result, setResult] = useState<Result | null>(null);
  useEffect(() => {
    let ignore = false;
    client.fetchOrders({ status, search }).then((response) => {
      if (!ignore) setResult(response);
    });
    return () => {
      ignore = true;
    };
  }, [client, status, search]);
  return <OrdersView controls={controls} result={result} />;
}
