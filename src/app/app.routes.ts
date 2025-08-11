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
      {
        path: 'teachers',
        loadComponent: () =>
          import('./teachers/teachers').then((m) => m.Teachers),
      },
      {
        path: 'exams',
        loadComponent: () => import('./exams/exams').then((m) => m.Exams),
      },
      {
        path: 'fees',
        loadComponent: () => import('./fees/fees').then((m) => m.Fees),
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./announcements/announcements').then((m) => m.Announcements),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings').then((m) => m.Settings),
      },
    ],
  },
  {
    canActivate: [authGuard],
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  { path: '**', redirectTo: '' },
];
