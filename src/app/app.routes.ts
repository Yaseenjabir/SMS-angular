import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./students/students').then((m) => m.Students),
      },
      {
        path: 'classes',
        loadComponent: () => import('./classes/classes').then((m) => m.Classes),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  { path: '**', redirectTo: '' },
];
