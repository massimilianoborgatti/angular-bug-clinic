import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'The effect that never stopped | Bug Clinic',
  description: 'Compare a React request loop and stale results with a focused effect cleanup.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
