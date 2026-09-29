import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { adminGuard } from './core/guards/admin-guard';

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
  {
    path: 'encuestas/nueva',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/encuesta/editor-encuesta/editor-encuesta').then(m => m.EditorEncuesta),
  },
  {
    path: 'encuestas/:id/editar',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/encuesta/editor-encuesta/editor-encuesta').then(m => m.EditorEncuesta),
  },
  {
    path: 'encuestas/:id/qr',
    canActivate: [authGuard],
    loadComponent: () => import('./features/encuesta/qr-encuesta/qr-encuesta').then(m => m.QrEncuesta),
  },
  {
    path: 'encuestas/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/encuesta/detalle-encuesta/detalle-encuesta').then(m => m.DetalleEncuesta),
  },
  {
    path: 'responder/:token',
    loadComponent: () => import('./features/public/responder-encuesta/responder-encuesta').then(m => m.ResponderEncuesta),
  },
  {
    path: 'respuestas/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/encuesta/respuesta-detalle/respuesta-detalle').then(m => m.RespuestaDetalle),
  },
  { path: '**', redirectTo: 'login' } // Fallback
];