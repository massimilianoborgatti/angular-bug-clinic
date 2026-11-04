import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Sample code review: Northwind Notes | Bug Clinic',
  description:
    'A fictional notes app report with nine findings, paired repairs and reproducible tests.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
