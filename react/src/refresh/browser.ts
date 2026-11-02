import { createHandlers, DEMO_API } from './handlers';
let starting: Promise<unknown> | undefined;
export function startDemo() {
  if (typeof window === 'undefined') return Promise.resolve();
  starting ??= import('msw/browser').then(({ setupWorker }) => {
    const worker = setupWorker(...createHandlers(DEMO_API));
    return worker.start({
      serviceWorker: {
        url: '/angular-bug-clinic/react/mockServiceWorker.js',
        options: { scope: '/angular-bug-clinic/react/' },
      },
      onUnhandledFrame: 'bypass',
      quiet: true,
    });
  });
  return starting;
}
