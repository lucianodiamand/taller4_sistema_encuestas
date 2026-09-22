import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si ya hay un token guardado, bloquea la entrada al login y envía al panel
  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  // Si no está logueado, permite ver el login
  return true;
};