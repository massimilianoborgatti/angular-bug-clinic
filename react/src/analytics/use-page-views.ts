'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { type Consent, DemoAnalytics } from './tracker';
export function pageTitle(pathname: string, search: string) {
  if (pathname.endsWith('/plants/detail/'))
    return `Monstera (${new URLSearchParams(search).get('color') || 'green'}) | Demo Plant Shop`;
  return pathname.endsWith('/plants/') ? 'Plants | Demo Plant Shop' : 'Home | Demo Plant Shop';
}
export function usePageViews(analytics: DemoAnalytics, consent: Consent) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const lastLocation = useRef<string | null>(null);
  useEffect(() => {
    if (!analytics.fixed || consent !== 'granted') return;
    const location =
      window.location.origin + window.location.pathname + (search ? '?' + search : '');
    if (lastLocation.current === location) return;
    lastLocation.current = location;
    analytics.event('page_view', {
      page_location: location,
      page_title: pageTitle(pathname, search),
    });
  }, [analytics, consent, pathname, search]);
}
