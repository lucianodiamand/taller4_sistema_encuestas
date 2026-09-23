/* Servicio de Clientes.
 * Con USAR_BACKEND_REAL = false (config.ts) simula la API con datos estáticos.
 * Los métodos devuelven Observables igual que el HttpClient real.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cliente, ClienteCrear } from '../../shared/models/cliente-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);

  // ===== Datos de ejemplo (mock) =====
  private mockClientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Empresa Alpha',
      email: 'contacto@alpha.com',
      telefono: '351 555-0100',
      cuit: 30111111118,
      activo: true,
      usuarioId: 1,
      usuarioNombre: 'Admin Sistema',
    },
    {
      id: 2,
      nombre: 'Consultora Beta',
      email: 'info@beta.com',
      telefono: null,
      cuit: 30222222225,
      activo: true,
      usuarioId: 1,
      usuarioNombre: 'Admin Sistema',
    },
  ];

  // GET /api/clientes
  obtenerTodos(): Observable<Cliente[]> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<Cliente[]>(`${API_URL}/clientes`);
    }
    return of(this.mockClientes);
  }

  // POST /api/clientes
  crear(datos: ClienteCrear): Observable<Cliente> {
    if (USAR_BACKEND_REAL) {
      return this.http.post<Cliente>(`${API_URL}/clientes`, datos);
    }
    const siguienteId = this.mockClientes.length ? Math.max(...this.mockClientes.map((c) => c.id)) + 1 : 1;
    const nuevo: Cliente = {
      ...datos,
      id: siguienteId,
      activo: true,
      usuarioNombre: 'Admin Sistema',
    };
    this.mockClientes = [...this.mockClientes, nuevo];
    return of(nuevo);
  }

  // PUT /api/clientes/{id}  (RF04: editar - endpoint a confirmar en backend)
  modificar(id: number, datos: Partial<Cliente>): Observable<Cliente> {
    if (USAR_BACKEND_REAL) {
      return this.http.put<Cliente>(`${API_URL}/clientes/${id}`, datos);
    }
    this.mockClientes = this.mockClientes.map((c) => (c.id === id ? { ...c, ...datos } : c));
    return of(this.mockClientes.find((c) => c.id === id)!);
  }

  // DELETE /api/clientes/{id}  (RF04: eliminar - endpoint a confirmar en backend)
  eliminar(id: number): Observable<void> {
    if (USAR_BACKEND_REAL) {
      return this.http.delete<void>(`${API_URL}/clientes/${id}`);
    }
    this.mockClientes = this.mockClientes.filter((c) => c.id !== id);
    return of(undefined);
  }
}