import { Routes } from '@angular/router';
import { brokenAuthGuard, fixedAuthGuard } from './guard-demo';
import { GuardLogin, GuardStopped, GuardTasks } from './guard-pages';

// These children belong only to the case 04 route, never to the app root.
export const CASE_04_ROUTES: Routes = [
  { path: 'broken/tasks', component: GuardTasks, canActivate: [brokenAuthGuard] },
  { path: 'broken/login', component: GuardLogin, canActivate: [brokenAuthGuard] },
  { path: 'broken/stopped', component: GuardStopped },
  { path: 'fixed/tasks', component: GuardTasks, canActivate: [fixedAuthGuard] },
  { path: 'fixed/login', component: GuardLogin },
];
