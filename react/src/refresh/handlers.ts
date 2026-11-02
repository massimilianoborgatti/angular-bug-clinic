import { http, HttpResponse } from 'msw/http';
import { delay } from 'msw/utils/delay';
import { createTokenService } from '../../../node/src/tokens';
export const DEMO_API = '/angular-bug-clinic/react/case-07-api';
export function createHandlers(base: string, service = createTokenService()) {
  return [
    http.post(base + '/login', () => HttpResponse.json(service.login())),
    http.post(base + '/refresh', async ({ request }) => {
      const body = (await request.json()) as { refreshToken?: unknown };
      if (typeof body.refreshToken !== 'string')
        return HttpResponse.json({ error: 'refresh_token_required' }, { status: 400 });
      await delay(80);
      const result = service.refresh(body.refreshToken);
      return HttpResponse.json(result.ok ? result.value : { error: result.error }, {
        status: result.ok ? 200 : 401,
      });
    }),
    http.get(base + '/tasks', async ({ request }) => {
      await delay(20);
      const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? '';
      const result = service.tasks(token, new URL(request.url).searchParams.get('list') ?? 'all');
      return HttpResponse.json(result.ok ? result.value : { error: result.error }, {
        status: result.ok ? 200 : 401,
      });
    }),
  ];
}
