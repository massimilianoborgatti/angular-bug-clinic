import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Logged out at random | Bug Clinic',
  description:
    'Compare competing refresh requests with a single-flight repair for rotating tokens.',
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
