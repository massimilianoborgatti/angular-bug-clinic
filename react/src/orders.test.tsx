import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrokenOrders } from './broken-orders';
import { FixedOrders } from './fixed-orders';
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});
const tick = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};
async function load() {
  await tick(100);
  expect(screen.getAllByTestId('order-status')).toHaveLength(4);
}
async function race() {
  await load();
  vi.mocked(Math.random).mockReturnValue(0.999);
  fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Open' } });
  vi.mocked(Math.random).mockReturnValue(0);
  fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Shipped' } });
  vi.mocked(Math.random).mockReturnValue(0.999);
  await tick(100);
  expect(screen.getByTestId('showing')).toHaveTextContent('Showing: Shipped');
  await tick(800);
  expect(screen.getByLabelText('Status')).toHaveValue('Shipped');
}
for (const [name, Component] of [
  ['Broken', BrokenOrders],
  ['Fixed', FixedOrders],
] as const) {
  describe(name, () => {
    const invariant = name === 'Broken' ? it.fails : it;
    invariant('keeps the request count at one after loading without input', async () => {
      render(<Component />);
      await load();
      for (let i = 0; i < 3; i++) await tick(100);
      expect(screen.getByTestId('request-count')).toHaveTextContent(/^1$/);
    });
    invariant('keeps only shipped orders after the older Open response resolves', async () => {
      render(<Component />);
      await race();
      expect(screen.getAllByTestId('order-status').map((row) => row.textContent)).toEqual([
        'Shipped',
        'Shipped',
      ]);
    });
  });
}
it('Broken explicitly starts another request after each completed response', async () => {
  render(<BrokenOrders />);
  expect(screen.getByTestId('request-count')).toHaveTextContent(/^1$/);
  await load();
  expect(screen.getByTestId('request-count')).toHaveTextContent(/^2$/);
  await tick(100);
  expect(screen.getByTestId('request-count')).toHaveTextContent(/^3$/);
});
it('Broken explicitly replaces shipped results with the older open results', async () => {
  render(<BrokenOrders />);
  await race();
  expect(screen.getByTestId('showing')).toHaveTextContent('Showing: Open');
  expect(screen.getAllByTestId('order-status').map((row) => row.textContent)).toEqual([
    'Open',
    'Open',
  ]);
});
it('Fixed filters by search and shows loading and empty states', async () => {
  render(<FixedOrders />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  await load();
  fireEvent.change(screen.getByLabelText('Search orders'), { target: { value: 'NOTEBOOK' } });
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  await tick(100);
  expect(screen.getByRole('status')).toHaveTextContent('Selection loaded');
  expect(screen.getAllByTestId('order-status')).toHaveLength(1);
  expect(screen.getByText('Notebook set')).toBeVisible();
  fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Shipped' } });
  await tick(100);
  expect(screen.getByText('No matching orders.')).toBeVisible();
});
it('Fixed survives Strict Mode cleanup without stale results or a continuing loop', async () => {
  render(
    <StrictMode>
      <FixedOrders />
    </StrictMode>,
  );
  expect(screen.getByTestId('request-count')).toHaveTextContent(/^2$/);
  await race();
  expect(screen.getAllByTestId('order-status').map((row) => row.textContent)).toEqual([
    'Shipped',
    'Shipped',
  ]);
  const settledCount = screen.getByTestId('request-count').textContent;
  await tick(3000);
  expect(screen.getByTestId('request-count')).toHaveTextContent(settledCount!);
});
