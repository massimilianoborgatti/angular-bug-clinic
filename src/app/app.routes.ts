import { Routes } from '@angular/router';
import { Home } from './home';
export const routes: Routes = [
  { path: '', component: Home, title: 'Case library · Angular Bug Clinic' },
  {
    path: 'cases/01-subscription-leak',
    loadComponent: () => import('./cases/01-subscription-leak/case-01').then((m) => m.Case01),
    title: 'Case 01 · Angular Bug Clinic',
  },
  {
    path: 'cases/02-onpush-stale-view',
    loadComponent: () => import('./cases/02-onpush-stale-view/case-02').then((m) => m.Case02),
    title: 'Case 02 · Angular Bug Clinic',
  },
  {
    path: 'cases/03-async-validator-race',
    loadComponent: () => import('./cases/03-async-validator-race/case-03').then((m) => m.Case03),
    title: 'Case 03 · Angular Bug Clinic',
  },
  {
    path: 'cases/04-guard-redirect-loop',
    loadComponent: () => import('./shared/planned-case').then((m) => m.PlannedCase),
    data: { slug: '04-guard-redirect-loop' },
    title: 'Case 04 · Angular Bug Clinic',
  },
  {
    path: 'cases/05-ionic-back-button',
    loadComponent: () => import('./shared/planned-case').then((m) => m.PlannedCase),
    data: { slug: '05-ionic-back-button' },
    title: 'Case 05 · Angular Bug Clinic',
  },
  { path: '**', redirectTo: '' },
];
