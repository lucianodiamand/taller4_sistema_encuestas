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

  constructor(private router: Router) {}

  login(username: string, clave: string): boolean {
    // Simulación del endpoint de login basado en tu esquema de base de datos
    if (username === 'admin' && clave === '1234') {
      this.setSession('fake-jwt-token-admin', Rol.ADMIN);
      return true;
    } else if (username === 'encuestador' && clave === '1234') {
      this.setSession('fake-jwt-token-encuestador', Rol.ENCUESTADOR);
      return true;
    }
    return false;
  }

  private setSession(token: string, role: Rol) {
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

  getRoleFromToken(): Rol | null {
    const role = localStorage.getItem('role');
    return role === Rol.ADMIN || role === Rol.ENCUESTADOR ? role : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}