import type { Task, Tokens } from '../../../node/src/tokens';
import { brokenRefresh } from './broken-refresh';
import { singleFlightRefresh } from './fixed-refresh';
export function createTaskClient(base: string, fixed: boolean, log: (event: string) => void) {
  let tokens: Tokens | undefined;
  let controller = new AbortController();
  let refreshCount = 0;
  async function read<T>(response: Response): Promise<T> {
    const body = await response.json();
    if (!response.ok) {
      if (body.error === 'refresh_reused') log('refresh reused → session revoked');
      throw new Error(body.error ?? 'request_failed');
    }
    return body as T;
  }
  const doRefresh = async (token: string): Promise<Tokens> => {
    log('401 → refresh started');
    refreshCount += 1;
    return read<Tokens>(
      await fetch(base + '/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
        signal: controller.signal,
      }),
    );
  };
  const refresh = fixed ? singleFlightRefresh(doRefresh, log) : brokenRefresh(doRefresh);
  async function loadList(list: string): Promise<Task[]> {
    if (!tokens) throw new Error('not_logged_in');
    const snapshot = tokens;
    const get = (token: string) =>
      fetch(base + '/tasks?list=' + list, {
        headers: { Authorization: 'Bearer ' + token },
        signal: controller.signal,
      });
    let response = await get(snapshot.accessToken);
    if (response.status === 401) {
      // A late 401 can arrive after another request has already refreshed.
      if (!fixed || tokens.accessToken === snapshot.accessToken)
        tokens = await refresh(snapshot.refreshToken);
      response = await get(tokens.accessToken);
    }
    return (await read<{ tasks: Task[] }>(response)).tasks;
  }
  return {
    async login() {
      controller.abort();
      controller = new AbortController();
      refreshCount = 0;
      tokens = await read<Tokens>(
        await fetch(base + '/login', { method: 'POST', signal: controller.signal }),
      );
      log('Logged in; access expires in 5 seconds');
    },
    async load() {
      const results = await Promise.allSettled(['today', 'upcoming', 'later'].map(loadList));
      if (results.some((result) => result.status === 'rejected')) {
        tokens = undefined;
        log('Dashboard unavailable; log in again');
        throw new Error('dashboard_failed');
      }
      log('3 task lists loaded');
      return results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
    },
    count: () => refreshCount,
    dispose: () => {
      controller.abort();
      tokens = undefined;
    },
  };
}
