import type { Tokens } from '../../../node/src/tokens';
export type Refresh = (token: string) => Promise<Tokens>;
export function singleFlightRefresh(refresh: Refresh, log: (event: string) => void): Refresh {
  let pending: Promise<Tokens> | undefined;
  let waiting = 0;
  return (token) => {
    if (!pending) {
      waiting = 1;
      pending = refresh(token).finally(() => {
        pending = undefined;
        waiting = 0;
      });
    } else {
      waiting += 1;
      log('refresh shared by ' + waiting + ' requests');
    }
    return pending;
  };
}
