/* Servicio de Usuarios (encuestadores y administradores).
 * Con USAR_BACKEND_REAL = false (config.ts) simula la API con datos estáticos.
 * Los métodos devuelven Observables igual que el HttpClient real, así el resto
 * del código no cambia cuando conectemos el backend.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Rol } from '../../shared/models/rol';
import { Usuario, UsuarioCrear } from '../../shared/models/usuario-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  // ===== Datos de ejemplo (mock) =====
  private mockUsuarios: Usuario[] = [
    { id: 1, email: 'admin@encuestas.com', nombre: 'Admin', apellido: 'Sistema', rol: Rol.ADMIN, activo: true },
    { id: 2, email: 'juan@encuestas.com', nombre: 'Juan', apellido: 'Pérez', rol: Rol.ENCUESTADOR, activo: true },
    { id: 3, email: 'maria@encuestas.com', nombre: 'María', apellido: 'Gómez', rol: Rol.ENCUESTADOR, activo: true },
  ];

  // GET /api/usuarios
  obtenerTodos(): Observable<Usuario[]> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<Usuario[]>(`${API_URL}/usuarios`);
    }
    return of(this.mockUsuarios);
  }

  // Solo los usuarios con rol ENCUESTADOR
  obtenerEncuestadores(): Observable<Usuario[]> {
    if (USAR_BACKEND_REAL) {
      return this.http
        .get<Usuario[]>(`${API_URL}/usuarios`)
        .pipe(map((usuarios) => usuarios.filter((u) => u.rol === Rol.ENCUESTADOR)));
    }
    return of(this.mockUsuarios.filter((u) => u.rol === Rol.ENCUESTADOR));
  }

  // POST /api/usuarios
  crear(datos: UsuarioCrear): Observable<Usuario> {
    if (USAR_BACKEND_REAL) {
      return this.http.post<Usuario>(`${API_URL}/usuarios`, datos);
    }
    const siguienteId = this.mockUsuarios.length ? Math.max(...this.mockUsuarios.map((u) => u.id)) + 1 : 1;
    const nuevo: Usuario = { ...datos, id: siguienteId, activo: true };
    this.mockUsuarios = [...this.mockUsuarios, nuevo];
    return of(nuevo);
  }

  // PUT /api/usuarios/{id}  (RF03: editar/desactivar usuarios - endpoint a confirmar en backend)
  modificar(id: number, datos: Partial<Usuario>): Observable<Usuario> {
    if (USAR_BACKEND_REAL) {
      return this.http.put<Usuario>(`${API_URL}/usuarios/${id}`, datos);
    }
    this.mockUsuarios = this.mockUsuarios.map((u) => (u.id === id ? { ...u, ...datos } : u));
    return of(this.mockUsuarios.find((u) => u.id === id)!);
  }

  // DELETE /api/usuarios/{id}  (RF03: dar de baja - endpoint a confirmar en backend)
  eliminar(id: number): Observable<void> {
    if (USAR_BACKEND_REAL) {
      return this.http.delete<void>(`${API_URL}/usuarios/${id}`);
    }
    this.mockUsuarios = this.mockUsuarios.filter((u) => u.id !== id);
    return of(undefined);
  }
}