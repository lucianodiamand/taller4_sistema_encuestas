import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login) 
  },
  { 
    path: 'dashboard', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) 
  },
  // Ruta pública a la que accederán los encuestados anónimos
/*   { 
    path: 'encuesta/:codigo', 
    loadComponent: () => import('./features/public/responder-encuesta/responder-encuesta').then(m => m.ResponderEncuesta) 
  }, */
  { path: '**', redirectTo: 'login' } // Fallback
];
