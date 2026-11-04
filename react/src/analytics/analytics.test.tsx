import { StrictMode, useEffect, type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DemoAnalytics, type Consent } from './tracker';
import { usePageViews } from './use-page-views';
const route = vi.hoisted(() => ({ pathname: '/cases/11-spa-analytics/', search: '' }));
vi.mock('next/navigation', () => ({
  usePathname: () => route.pathname,
  useSearchParams: () => new URLSearchParams(route.search),
}));
const base = '/cases/11-spa-analytics/';
function navigate(path: string, search = '') {
  route.pathname = base + path;
  route.search = search;
  window.history.replaceState(
    null,
    '',
    '/angular-bug-clinic/react' + route.pathname + (search ? '?' + search : ''),
  );
}
function setup(fixed: boolean, strict = false) {
  navigate('');
  const analytics = new DemoAnalytics(fixed);
  const hook = renderHook(
    ({ consent }: { consent: Consent }) => {
      useEffect(() => analytics.initialize(), []);
      usePageViews(analytics, consent);
    },
    {
      initialProps: { consent: 'pending' as Consent },
      wrapper: strict
        ? ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>
        : undefined,
    },
  );
  const answer = (consent: 'granted' | 'denied') => {
    act(() => analytics.answer(consent));
    hook.rerender({ consent });
  };
  return { ...hook, analytics, answer };
}
const views = (analytics: DemoAnalytics) =>
  analytics.snapshot().filter(([command, name]) => command === 'event' && name === 'page_view');
for (const fixed of [false, true])
  describe('11 ' + (fixed ? 'Fixed' : 'Broken'), () => {
    const invariant = fixed ? it : it.fails;
    invariant('does not record analytics before consent', () => {
      const { analytics } = setup(fixed);
      analytics.event('add_to_wishlist', { items: [] });
      expect(analytics.snapshot().filter(([command]) => command === 'event')).toEqual([]);
    });
    invariant(
      'records exactly one view per route/query with a correct title and full location',
      () => {
        const { analytics, answer, rerender } = setup(fixed);
        answer('granted');
        for (const [path, search] of [
          ['plants/', ''],
          ['plants/detail/', 'color=green'],
          ['plants/detail/', 'color=clay'],
        ]) {
          navigate(path, search);
          rerender({ consent: 'granted' });
        }
        expect(views(analytics).map((entry) => entry[2])).toEqual([
          {
            page_location: window.location.origin + '/angular-bug-clinic/react' + base,
            page_title: 'Home | Demo Plant Shop',
          },
          {
            page_location: window.location.origin + '/angular-bug-clinic/react' + base + 'plants/',
            page_title: 'Plants | Demo Plant Shop',
          },
          {
            page_location:
              window.location.origin +
              '/angular-bug-clinic/react' +
              base +
              'plants/detail/?color=green',
            page_title: 'Monstera (green) | Demo Plant Shop',
          },
          {
            page_location:
              window.location.origin +
              '/angular-bug-clinic/react' +
              base +
              'plants/detail/?color=clay',
            page_title: 'Monstera (clay) | Demo Plant Shop',
          },
        ]);
      },
    );
    invariant(
      'defaults all four consent signals to denied first and rejection leaves only consent',
      () => {
        const { analytics, answer } = setup(fixed);
        answer('denied');
        expect(analytics.snapshot()).toEqual([
          [
            'consent',
            'default',
            {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            },
          ],
          [
            'consent',
            'update',
            {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            },
          ],
        ]);
      },
    );
  });
it('Broken explicitly counts two initial views before consent and none on navigation', () => {
  const { analytics, answer, rerender } = setup(false);
  expect(views(analytics)).toHaveLength(2);
  expect(analytics.consent).toBe('pending');
  expect(analytics.snapshot()[0][0]).toBe('config');
  answer('granted');
  navigate('plants/');
  rerender({ consent: 'granted' });
  expect(views(analytics)).toHaveLength(2);
});
it('Fixed deduplicates Strict Mode replay and re-renders, but records a return navigation', () => {
  const { analytics, answer, rerender } = setup(true, true);
  answer('granted');
  rerender({ consent: 'granted' });
  expect(views(analytics)).toHaveLength(1);
  expect(analytics.snapshot().filter(([cmd]) => cmd === 'config')).toEqual([
    ['config', 'G-DEMO000000', { send_page_view: false }],
  ]);
  navigate('plants/');
  rerender({ consent: 'granted' });
  navigate('');
  rerender({ consent: 'granted' });
  expect(views(analytics)).toHaveLength(3);
});
it('Fixed tracks only the current page after delayed acceptance and stops all events after rejection', () => {
  const { analytics, answer, rerender } = setup(true);
  navigate('plants/');
  rerender({ consent: 'pending' });
  expect(views(analytics)).toHaveLength(0);
  answer('granted');
  expect(views(analytics)).toHaveLength(1);
  expect(views(analytics)[0][2].page_title).toBe('Plants | Demo Plant Shop');
  analytics.event('add_to_wishlist', {
    currency: 'USD',
    value: 24,
    items: [{ item_id: 'demo-monstera', item_name: 'Monstera', price: 24, quantity: 1 }],
  });
  expect(analytics.snapshot().at(-1)?.[1]).toBe('add_to_wishlist');
  answer('denied');
  const before = analytics.snapshot();
  analytics.event('add_to_wishlist', { items: [] });
  navigate('plants/detail/', 'color=clay');
  rerender({ consent: 'denied' });
  expect(analytics.snapshot()).toBe(before);
});
