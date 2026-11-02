import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { createTokenService, ACCESS_LIFETIME_MS } from '../../../node/src/tokens';
import { createHandlers } from './handlers';
import { TaskDashboard } from './dashboard';
const base = 'http://localhost/case-07-api';
const server = setupServer();
let time = 1_000;
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  time = 1_000;
  server.use(
    ...createHandlers(
      base,
      createTokenService(() => time),
    ),
  );
});
afterEach(() => server.resetHandlers());
async function expireAndReload(fixed: boolean) {
  render(<TaskDashboard fixed={fixed} base={base} />);
  fireEvent.click(screen.getByRole('button', { name: 'Log in to demo' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled(),
  );
  expect(screen.getByRole('status')).toHaveTextContent('Logged in');
  time += ACCESS_LIFETIME_MS;
  fireEvent.click(screen.getByRole('button', { name: 'Reload dashboard' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Log in to demo' })).toBeEnabled());
}
for (const fixed of [false, true])
  describe('07 ' + (fixed ? 'Fixed' : 'Broken'), () => {
    const invariant = fixed ? it : it.fails;
    invariant('keeps the session with one refresh and three successful task requests', async () => {
      await expireAndReload(fixed);
      expect(screen.getByRole('status')).toHaveTextContent(/^Logged in$/);
      expect(screen.getByTestId('refresh-count')).toHaveTextContent('1');
      expect(screen.getByText('Review the task list')).toBeVisible();
      expect(screen.getByText('Prepare next week')).toBeVisible();
      expect(screen.getByText('Organize the notebook')).toBeVisible();
      expect(screen.getByText('refresh shared by 3 requests')).toBeVisible();
    });
  });
it('Broken specifically reuses a refresh token and loses the session', async () => {
  await expireAndReload(false);
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
  expect(screen.getByTestId('refresh-count')).toHaveTextContent('3');
  expect(screen.getAllByText('refresh reused → session revoked')).toHaveLength(2);
  expect(screen.queryByText('Review the task list')).not.toBeInTheDocument();
});
it('Fixed can refresh again after the next expiry and start a fresh session', async () => {
  await expireAndReload(true);
  time += ACCESS_LIFETIME_MS;
  fireEvent.click(screen.getByRole('button', { name: 'Reload dashboard' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled(),
  );
  expect(screen.getByTestId('refresh-count')).toHaveTextContent('2');
  expect(screen.getByRole('status')).toHaveTextContent(/^Logged in$/);
  fireEvent.click(screen.getByRole('button', { name: 'Log in to demo' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled(),
  );
  expect(screen.getByTestId('refresh-count')).toHaveTextContent('0');
});
it('unmount aborts pending HTTP work', async () => {
  const abort = vi.spyOn(AbortController.prototype, 'abort');
  const view = render(<TaskDashboard fixed base={base} />);
  fireEvent.click(screen.getByRole('button', { name: 'Log in to demo' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Reload dashboard' })).toBeEnabled(),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Reload dashboard' }));
  view.unmount();
  expect(abort).toHaveBeenCalled();
});
