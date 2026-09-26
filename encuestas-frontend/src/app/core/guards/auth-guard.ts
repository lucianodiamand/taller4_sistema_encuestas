import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { Rol } from '../../shared/models/rol';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Verificar si el usuario es un encuestador y si está activo
    const role = authService.currentUserRole();
    if (role === Rol.ENCUESTADOR && !authService.isUsuarioActivo()) {
      // Si el encuestador está desactivado, redirigir al login con mensaje
      authService.logout();
      return router.createUrlTree(['/login'], { queryParams: { desactivado: 'true' } });
    }
    return true;
  }

  return router.createUrlTree(['/login']);
};