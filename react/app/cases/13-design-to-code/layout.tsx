import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'The design that broke on phones | Bug Clinic',
  description:
    'Compare a rigid landing page with a responsive, accessible implementation of an original design.',
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
