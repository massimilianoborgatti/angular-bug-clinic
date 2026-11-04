import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = {
  title: 'Northwind Notes - local sample',
  description: 'A fictional notes app with paired baseline and repaired code.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
