/* Servicio de Encuestas.
 * Con USAR_BACKEND_REAL = false (config.ts) simula la API con datos estáticos.
 * Los métodos devuelven Observables igual que el HttpClient real.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EstadoEncuesta } from '../../shared/models/estado-encuesta';
import { Encuesta, EncuestaCrear } from '../../shared/models/encuesta-interface';
import { TipoPregunta } from '../../shared/models/tipo-pregunta';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  private http = inject(HttpClient);

  // ===== Datos de ejemplo (mock) =====
  private mockEncuestas: Encuesta[] = [
    {
      id: 1,
      titulo: 'Satisfacción Q1',
      descripcion: 'Encuesta de satisfacción trimestral',
      estado: EstadoEncuesta.ACTIVA,
      fechaCreacion: new Date('2026-03-01T10:00:00').toISOString(),
      clienteId: 1,
      clienteNombre: 'Empresa Alpha',
      usuarioId: 1,
      usuarioNombre: 'Admin Sistema',
      preguntas: [
        { orden: 1, texto: '¿Cómo calificarías el servicio?', tipo: TipoPregunta.ESCALA, opciones: [] },
        { orden: 2, texto: '¿Qué nos recomendarías mejorar?', tipo: TipoPregunta.TEXTO_LIBRE, opciones: [] },
      ],
    },
    {
      id: 2,
      titulo: 'Clima Laboral',
      descripcion: 'Encuesta interna de clima',
      estado: EstadoEncuesta.CERRADA,
      fechaCreacion: new Date('2026-02-15T09:00:00').toISOString(),
      clienteId: 2,
      clienteNombre: 'Consultora Beta',
      usuarioId: 1,
      usuarioNombre: 'Admin Sistema',
      preguntas: [
        {
          orden: 1,
          texto: '¿Qué ambiente predomina en tu equipo?',
          tipo: TipoPregunta.OPCION_UNICA,
          opciones: ['Muy bueno', 'Bueno', 'Regular', 'Malo'],
        },
      ],
    },
  ];

  // GET /api/encuestas
  obtenerTodas(): Observable<Encuesta[]> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<Encuesta[]>(`${API_URL}/encuestas`);
    }
    return of(this.mockEncuestas);
  }

  // GET /api/encuestas/{id}  (endpoint a confirmar en backend)
  obtenerPorId(id: number): Observable<Encuesta | undefined> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<Encuesta>(`${API_URL}/encuestas/${id}`);
    }
    return of(this.mockEncuestas.find((e) => e.id === id));
  }

  // POST /api/encuestas
  crear(datos: EncuestaCrear): Observable<Encuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.post<Encuesta>(`${API_URL}/encuestas`, datos);
    }
    const siguienteId = this.mockEncuestas.length ? Math.max(...this.mockEncuestas.map((e) => e.id)) + 1 : 1;
    const nueva: Encuesta = {
      ...datos,
      id: siguienteId,
      estado: EstadoEncuesta.ACTIVA,
      fechaCreacion: new Date().toISOString(),
      clienteNombre: 'Admin Sistema', // en el mock no se resuelve el nombre del cliente
      usuarioNombre: 'Admin Sistema',
    };
    this.mockEncuestas = [...this.mockEncuestas, nueva];
    return of(nueva);
  }

  // PATCH /api/encuestas/{id}/estado?nuevoEstado=...
  cambiarEstado(id: number, nuevoEstado: EstadoEncuesta): Observable<Encuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.patch<Encuesta>(`${API_URL}/encuestas/${id}/estado`, null, {
        params: { nuevoEstado },
      });
    }
    this.mockEncuestas = this.mockEncuestas.map((e) => (e.id === id ? { ...e, estado: nuevoEstado } : e));
    return of(this.mockEncuestas.find((e) => e.id === id)!);
  }

  // PUT /api/encuestas/{id}  (RF05/RF06: editar - endpoint a confirmar en backend)
  modificar(id: number, datos: Partial<Encuesta>): Observable<Encuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.put<Encuesta>(`${API_URL}/encuestas/${id}`, datos);
    }
    this.mockEncuestas = this.mockEncuestas.map((e) => (e.id === id ? { ...e, ...datos } : e));
    return of(this.mockEncuestas.find((e) => e.id === id)!);
  }

  // DELETE /api/encuestas/{id}  (endpoint a confirmar en backend)
  eliminar(id: number): Observable<void> {
    if (USAR_BACKEND_REAL) {
      return this.http.delete<void>(`${API_URL}/encuestas/${id}`);
    }
    this.mockEncuestas = this.mockEncuestas.filter((e) => e.id !== id);
    return of(undefined);
  }
}