export type Status = 'All' | 'Open' | 'Shipped';
export type Params = { status: Status; search: string };
export type Order = { id: string; title: string; status: Exclude<Status, 'All'> };
export type Result = { params: Params; orders: Order[] };
const orders: Order[] = [
  { id: 'ORD-101', title: 'Desk organizer', status: 'Open' },
  { id: 'ORD-102', title: 'Weekly planner', status: 'Shipped' },
  { id: 'ORD-103', title: 'Notebook set', status: 'Open' },
  { id: 'ORD-104', title: 'Pencil case', status: 'Shipped' },
];
export function createOrdersClient() {
  let count = 0;
  const listeners = new Set<() => void>();
  return {
    getCount: () => count,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    fetchOrders(params: Params): Promise<Result> {
      count += 1;
      listeners.forEach((listener) => listener());
      const delay = 100 + Math.floor(Math.random() * 801);
      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              params,
              orders: orders.filter(
                (order) =>
                  (params.status === 'All' || order.status === params.status) &&
                  order.title.toLowerCase().includes(params.search.trim().toLowerCase()),
              ),
            }),
          delay,
        );
      });
    },
  };
}
export type OrdersClient = ReturnType<typeof createOrdersClient>;
