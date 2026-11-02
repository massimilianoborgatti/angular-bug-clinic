import type { Refresh } from './fixed-refresh';
export function brokenRefresh(refresh: Refresh): Refresh {
  return (token) => refresh(token);
}
