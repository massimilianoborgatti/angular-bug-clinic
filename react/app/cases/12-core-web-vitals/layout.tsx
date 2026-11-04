import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = {
  title: 'The landing page that felt slow | Bug Clinic',
  description:
    'Compare delayed artwork, layout shifts and repeated pricing work with focused Core Web Vitals repairs.',
};
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
