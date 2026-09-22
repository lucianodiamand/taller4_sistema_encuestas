import { inject, Injectable, signal } from '@angular/core';
import { Cliente } from '../../shared/models/cliente-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  // Estado inicial simulado
  private mockClientes: Cliente[] = [
    { id: 1, nombre: 'Empresa Alpha', cuit: 30111111118, es_visible: true },
    { id: 2, nombre: 'Consultora Beta', cuit: 30222222225, es_visible: true },
  ];

  // Signal reactivo
  clientes = signal<Cliente[]>(this.mockClientes);

  obtenerTodos() {
    return this.clientes();
  }

  agregar(cliente: Omit<Cliente, 'id'>) {
    const nuevoId = Math.max(...this.clientes().map((c) => c.id)) + 1;
    const nuevoCliente = { ...cliente, id: nuevoId };
    this.clientes.update((actuales) => [...actuales, nuevoCliente]);
  }

  modificar(id: number, datos: Partial<Cliente>) {
    this.clientes.update((actuales) => actuales.map((c) => (c.id === id ? { ...c, ...datos } : c)));
  }

  eliminar(id: number) {
    this.clientes.update((actuales) => actuales.filter((c) => c.id !== id));
    this.http.get<any>('http://127.0.0.1/api/usuarios').subscribe((data) => {
      console.log(data);
    });
  }
}
