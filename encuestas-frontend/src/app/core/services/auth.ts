/* SIMULACION DE AUTH EN BACKEND */
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from '../../shared/models/rol';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos signals (Angular 16+) para hacer la UI reactiva a los cambios de sesión
  currentUserRole = signal<Rol | null>(this.getRoleFromToken());
  // Id del usuario logueado (mock: admin=1, encuestador=2). Con backend real saldría del JWT.
  currentUserId = signal<number | null>(this.getUserId());

  constructor(private router: Router) {}

  login(username: string, clave: string): boolean {
    // Simulación del endpoint de login basado en tu esquema de base de datos
    if (username === 'admin' && clave === '1234') {
      this.setSession('fake-jwt-token-admin', Rol.ADMIN, 1);
      return true;
    } else if (username === 'encuestador' && clave === '1234') {
      this.setSession('fake-jwt-token-encuestador', Rol.ENCUESTADOR, 2);
      return true;
    }
    return false;
  }

  private setSession(token: string, role: Rol, userId: number) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', String(userId));
    this.currentUserRole.set(role);
    this.currentUserId.set(userId);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.currentUserRole.set(null);
    this.currentUserId.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRoleFromToken(): Rol | null {
    const role = localStorage.getItem('role');
    return role === Rol.ADMIN || role === Rol.ENCUESTADOR ? role : null;
  }

  private getUserId(): number | null {
    const raw = localStorage.getItem('userId');
    if (!raw) return null;
    const id = Number(raw);
    return Number.isInteger(id) ? id : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}