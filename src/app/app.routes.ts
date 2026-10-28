import { Routes } from '@angular/router';
import { Home } from './home';
export const routes: Routes = [
  { path: '', component: Home, title: 'Case library · Angular Bug Clinic' },
  ...[
    '01-subscription-leak',
    '02-onpush-stale-view',
    '03-async-validator-race',
    '04-guard-redirect-loop',
    '05-ionic-back-button',
  ].map((slug) => ({
    path: 'cases/' + slug,
    loadComponent: () => import('./shared/planned-case').then((m) => m.PlannedCase),
    data: { slug },
    title: 'Case study · Angular Bug Clinic',
  })),
  { path: '**', redirectTo: '' },
];
