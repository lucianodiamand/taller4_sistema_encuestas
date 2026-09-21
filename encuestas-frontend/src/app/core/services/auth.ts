/* SIMULACION DE AUTH EN BACKEND */
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos signals (Angular 16+) para hacer la UI reactiva a los cambios de sesión
  currentUserRole = signal<string | null>(this.getRoleFromToken());

  constructor(private router: Router) {}

  login(username: string, clave: string): boolean {
    // Simulación del endpoint de login basado en tu esquema de base de datos
    if (username === 'admin' && clave === '1234') {
      this.setSession('fake-jwt-token-admin', 'ADMIN');
      return true;
    } else if (username === 'encuestador' && clave === '1234') {
      this.setSession('fake-jwt-token-encuestador', 'ENCUESTADOR');
      return true;
    }
    return false;
  }

  private setSession(token: string, role: string) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role);
    this.currentUserRole.set(role);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    this.currentUserRole.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRoleFromToken(): string | null {
    return localStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}