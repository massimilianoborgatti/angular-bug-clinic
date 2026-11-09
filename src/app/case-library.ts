import { cases, type ClinicCase } from './catalog';

type LibraryCase = Pick<ClinicCase, 'id' | 'title' | 'symptom' | 'category'> &
  ({ slug: string; href?: never; ready?: boolean } | { href: string; slug?: never; ready?: never });

const additionalCases: LibraryCase[] = [
  {
    id: '06',
    href: 'react/',
    title: 'The effect that never stopped',
    symptom:
      'A changing dependency keeps requests running, and an old response replaces the latest filter.',
    category: 'React · Next.js',
  },
  {
    id: '07',
    href: 'react/cases/07-node-refresh-race/',
    title: 'Logged out at random',
    symptom: 'Three expired requests race to refresh one session and revoke it.',
    category: 'React · Node.js',
  },
  {
    id: '09',
    href: 'react/cases/09-form-errors/',
    title: 'The form errors nobody heard',
    symptom:
      'Validation errors appear on screen without names, descriptions or a focus destination.',
    category: 'React · Accessibility',
  },
  {
    id: '10',
    slug: '10-woocommerce-cart',
    title: 'The cart that only updated after a reload',
    symptom: 'An AJAX addition succeeds, but a custom header badge and spinner stay stale.',
    category: 'WordPress · WooCommerce',
  },
  {
    id: '11',
    href: 'react/cases/11-spa-analytics/',
    title: 'Page views that lied',
    symptom: 'Duplicate initial views, missing navigation events and a consent choice ignored.',
    category: 'React · Analytics',
  },
  {
    id: '12',
    href: 'react/cases/12-core-web-vitals/',
    title: 'The landing page that felt slow',
    symptom: 'Late artwork, moving content and repeated work slow a simple landing page.',
    category: 'React · Web Performance',
  },
  {
    id: '13',
    href: 'react/cases/13-design-to-code/',
    title: 'The design that broke on phones',
    symptom: 'A rigid landing page overlaps, overflows and leaves keyboard controls behind.',
    category: 'React · Design to code',
  },
  {
    id: '14',
    href: 'react/cases/14-code-review-sample/',
    title: 'Sample code review: Northwind Notes',
    symptom: 'Nine findings, a readable report and tested repairs for a fictional notes app.',
    category: 'Code Review · Next.js',
  },
  {
    id: '15',
    href: 'react/cases/15-elementor-mobile-layout/',
    title: 'The mobile layout that overflowed',
    symptom: 'A fixed-width hero and crowded service cards make a workshop page scroll sideways.',
    category: 'WordPress · Elementor',
  },
];

export const caseLibrary: readonly LibraryCase[] = [...cases, ...additionalCases].sort(
  (a, b) => Number(a.id) - Number(b.id),
);
