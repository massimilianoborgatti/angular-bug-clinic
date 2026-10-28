import { Routes } from '@angular/router';
import { Home } from './home';
import { CASE_04_ROUTES } from './cases/04-guard-redirect-loop/shared/guard-routes';
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
    loadComponent: () => import('./cases/04-guard-redirect-loop/case-04').then((m) => m.Case04),
    title: 'Case 04 · Angular Bug Clinic',
    children: CASE_04_ROUTES,
  },
  {
    path: 'cases/05-ionic-back-button',
    loadChildren: () =>
      import('./cases/05-ionic-back-button/case-05.routes').then((m) => m.CASE_05_ROUTES),
    title: 'Case 05 · Angular Bug Clinic',
  },
  { path: '**', redirectTo: '' },
];
