import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'The form errors nobody heard | Bug Clinic',
  description:
    'Compare inaccessible form errors with explicit labels, linked error messages and focused recovery.',
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
