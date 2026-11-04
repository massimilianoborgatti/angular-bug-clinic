import { Suspense, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { AnalyticsClinic } from '../../../src/analytics/clinic';
export const metadata: Metadata = {
  title: 'Page views that lied | Bug Clinic',
  description:
    'Compare duplicate SPA page views and premature events with route-aware tracking and consent-first analytics.',
};
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p>Loading the local analytics demo…</p>}>
      <AnalyticsClinic>{children}</AnalyticsClinic>
    </Suspense>
  );
}
