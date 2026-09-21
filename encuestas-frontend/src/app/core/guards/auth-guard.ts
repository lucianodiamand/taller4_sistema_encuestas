import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Aquí podrías agregar lógica para verificar roles si una ruta específica lo requiere
    // ej: const requiredRole = route.data['role'];
    return true;
  }

  router.navigate(['/login']);
  return false;
};