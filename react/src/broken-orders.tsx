'use client';
import { useEffect, useState } from 'react';
import type { Result } from './orders';
import { OrdersView, useOrderControls } from './orders-view';
export function BrokenOrders() {
  const controls = useOrderControls();
  const { client, status, search } = controls;
  const [result, setResult] = useState<Result | null>(null);
  const params = { status, search };
  useEffect(() => {
    client.fetchOrders(params).then(setResult);
  }, [client, params]);
  return <OrdersView controls={controls} result={result} />;
}
