/* Auth Service - soporta backend real (JWT) y modo mock */
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Rol } from '../../shared/models/rol';
import { LoginResponse } from '../../shared/models/login-response-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  // Usamos signals (Angular 16+) para hacer la UI reactiva a los cambios de sesión
  currentUserRole = signal<Rol | null>(this.getRoleFromToken());
  // Id del usuario logueado (mock: admin=1, encuestador=2). Con backend real saldría del JWT.
  currentUserId = signal<number | null>(this.getUserId());
  // Estado activo del usuario actual
  currentUserActivo = signal<boolean | null>(null);
  // Email real del usuario logueado
  currentUserEmail = signal<string | null>(this.getEmailFromStorage());
  currentUserNombre = signal<string | null>(this.getNameFromStorage());
  currentUserApellido = signal<string | null>(this.getApellidoFromStorage());

  constructor(private router: Router) {}

  login(email: string, clave: string): Observable<boolean> {
    if (USAR_BACKEND_REAL) {
      return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password: clave }).pipe(
        map((res) => {
          this.setSession(res.token, res.rol as Rol, res.usuarioId, true, res.email, res.nombre, res.apellido);
          return true;
        }),
        catchError((err) => {
          // Credenciales inválidas u otro error HTTP
          return throwError(() => err);
        })
      );
    }

    // MOCK: aceptar credenciales del seed y las viejas (admin/1234, encuestador/1234)
    if ((email === 'admin@test.com' || email === 'admin') && clave === '1234') {
      this.setSession('fake-jwt-token-admin', Rol.ADMIN, 1, true, email, 'Admin', 'User');
      return of(true);
    } else if ((email === 'encuestador@test.com' || email === 'encuestador') && clave === '1234') {
      this.setSession('fake-jwt-token-encuestador', Rol.ENCUESTADOR, 2, true, email, 'Encuestador', 'User');
      return of(true);
    } else if (email === 'admin@test.com' && clave === 'admin123') {
      this.setSession('fake-jwt-token-admin', Rol.ADMIN, 1, true, email, 'Admin', 'User');
      return of(true);
    } else if (email === 'encuestador@test.com' && clave === 'encuestador123') {
      this.setSession('fake-jwt-token-encuestador', Rol.ENCUESTADOR, 2, true, email, 'Encuestador', 'User');
      return of(true);
    }
    return throwError(() => new Error('CREDENCIALES_INVALIDAS'));
  }

  private setSession(token: string, role: Rol, userId: number, activo: boolean, email: string, nombre: string, apellido: string) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('activo', String(activo));
    localStorage.setItem('email', email);
    localStorage.setItem('name', nombre);
    localStorage.setItem('apellido', apellido);
    this.currentUserRole.set(role);
    this.currentUserId.set(userId);
    this.currentUserActivo.set(activo);
    this.currentUserEmail.set(email);
    this.currentUserNombre.set(nombre);
    this.currentUserApellido.set(apellido);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('activo');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('apellido');
    this.currentUserRole.set(null);
    this.currentUserId.set(null);
    this.currentUserActivo.set(null);
    this.currentUserEmail.set(null);
    this.currentUserNombre.set(null);
    this.currentUserApellido.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRoleFromToken(): Rol | null {
    const role = localStorage.getItem('role');
    return role === Rol.ADMIN || role === Rol.ENCUESTADOR ? role : null;
  }

  getActivoFromStorage(): boolean {
    const activo = localStorage.getItem('activo');
    return activo === 'true';
  }

  getEmailFromStorage(): string | null {
    return localStorage.getItem('email');
  }

  getNameFromStorage(): string | null {
    return localStorage.getItem('nombre');
  }

  getApellidoFromStorage(): string | null {
    return localStorage.getItem('apellido');
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
  
  getCurrentUserNombreCompleto(): { nombre: string; apellido: string } | null {
    const nombre = this.currentUserNombre();
    const apellido = this.currentUserApellido();
    if (nombre && apellido) {
      return { nombre, apellido };
    }
    return null;
  }

  // Verifica si el usuario actual (encuestador) está activo
  async verificarUsuarioActivo(): Promise<boolean> {
    const userId = this.currentUserId();
    const role = this.currentUserRole();
    
    // Si no es encuestador, siempre permitir (admin no se desactiva)
    if (role !== Rol.ENCUESTADOR || !userId) {
      return true;
    }

    // Verificar con el servicio de usuarios - usando mock
    return new Promise((resolve) => {
      // En modo mock, usamos el valor de localStorage directamente
      const activo = this.getActivoFromStorage();
      this.currentUserActivo.set(activo);
      resolve(activo);
    });
  }

  // Verificación síncrona usando localStorage (para guards)
  isUsuarioActivo(): boolean {
    const role = this.currentUserRole();
    if (role !== Rol.ENCUESTADOR) {
      return true; // Admin siempre activo
    }
    return this.getActivoFromStorage();
  }
}