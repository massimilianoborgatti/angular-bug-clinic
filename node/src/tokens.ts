export const ACCESS_LIFETIME_MS = 5_000;
export type Tokens = { accessToken: string; refreshToken: string; expiresAt: number };
export type Task = { id: string; title: string; list: string };
type Failure = {
  ok: false;
  error: 'invalid_token' | 'token_expired' | 'refresh_reused' | 'session_revoked';
};
export type Result<T> = { ok: true; value: T } | Failure;
type Session = { revoked: boolean };
const tasks: Task[] = [
  { id: '1', title: 'Review the task list', list: 'today' },
  { id: '2', title: 'Prepare next week', list: 'upcoming' },
  { id: '3', title: 'Organize the notebook', list: 'later' },
];
// No runtime-specific imports: the API and browser share these exact transitions.
export function createTokenService(now = () => Date.now(), id = () => crypto.randomUUID()) {
  const access = new Map<string, { session: Session; expiresAt: number }>();
  const refresh = new Map<string, { session: Session; used: boolean }>();
  function issue(session: Session): Tokens {
    const tokens = { accessToken: id(), refreshToken: id(), expiresAt: now() + ACCESS_LIFETIME_MS };
    access.set(tokens.accessToken, { session, expiresAt: tokens.expiresAt });
    refresh.set(tokens.refreshToken, { session, used: false });
    return tokens;
  }
  return {
    login(): Tokens {
      return issue({ revoked: false });
    },
    refresh(token: string): Result<Tokens> {
      const record = refresh.get(token);
      if (!record) return { ok: false, error: 'invalid_token' };
      if (record.used) {
        record.session.revoked = true;
        return { ok: false, error: 'refresh_reused' };
      }
      if (record.session.revoked) return { ok: false, error: 'session_revoked' };
      record.used = true;
      return { ok: true, value: issue(record.session) };
    },
    tasks(token: string, list = 'all'): Result<{ tasks: Task[] }> {
      const record = access.get(token);
      if (!record) return { ok: false, error: 'invalid_token' };
      if (record.session.revoked) return { ok: false, error: 'session_revoked' };
      if (now() >= record.expiresAt) return { ok: false, error: 'token_expired' };
      return {
        ok: true,
        value: {
          tasks: tasks
            .filter((task) => list === 'all' || task.list === list)
            .map((task) => ({ ...task })),
        },
      };
    },
  };
}
