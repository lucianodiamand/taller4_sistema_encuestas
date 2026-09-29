import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { Rol } from '../../shared/models/rol';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && authService.currentUserRole() === Rol.ADMIN) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};