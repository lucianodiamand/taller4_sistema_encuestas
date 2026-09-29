/* Servicio de Respuestas de encuesta (validación del encuestador, RF14/RF15).
 * El backend aún no implementa RespuestaEncuesta: se simula con datos estáticos
 * siguiendo el mismo patrón que los demás servicios (USAR_BACKEND_REAL en config.ts).
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadoRespuesta } from '../../shared/models/estado-respuesta';
import { RespuestaEncuesta } from '../../shared/models/respuesta-encuesta-interface';
import { EstadisticasEncuesta } from '../../shared/models/estadisticas-encuesta';
import { RespuestaEnviada, RespuestaPregunta } from '../../shared/models/respuesta-enviada-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class RespuestaService {
  private http = inject(HttpClient);

  // ===== Datos de ejemplo (mock) =====
  private mockRespuestas: RespuestaEncuesta[] = [
    { 
      id: 501, 
      encuestaId: 1, 
      encuestaTitulo: 'Satisfacción Q1', 
      fechaRespuesta: '2026-09-20T10:00:00',
      estadoValidacion: EstadoRespuesta.PENDIENTE,
      respuestas: [
        { ordenPregunta: 1, textoPregunta: '¿Cómo calificarías tu experiencia?', respuesta: '4' },
        { ordenPregunta: 2, textoPregunta: '¿Qué mejorarías?', respuesta: 'La espera en caja' },
      ] 
    },
    { 
      id: 502, 
      encuestaId: 1, 
      encuestaTitulo: 'Satisfacción Q1', 
      fechaRespuesta: '2026-09-21T11:30:00',
      estadoValidacion: EstadoRespuesta.PENDIENTE,
      respuestas: [
        { ordenPregunta: 1, textoPregunta: '¿Cómo calificarías tu experiencia?', respuesta: '5' },
        { ordenPregunta: 2, textoPregunta: '¿Qué mejorarías?', respuesta: 'Nada' },
      ] 
    },
    { 
      id: 503, 
      encuestaId: 2, 
      encuestaTitulo: 'Clima Laboral', 
      fechaRespuesta: '2026-09-22T14:00:00',
      estadoValidacion: EstadoRespuesta.PENDIENTE,
      respuestas: [
        { ordenPregunta: 1, textoPregunta: '¿Qué ambiente predomina en tu equipo?', respuesta: 'Muy bueno' },
      ] 
    },
  ];

  // GET /api/respuestas/pendientes (endpoint a confirmar en backend)
  obtenerPendientes(): Observable<RespuestaEncuesta[]> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<RespuestaEncuesta[]>(`${API_URL}/respuestas/pendientes`);
    }
    return of(this.mockRespuestas.filter((r) => r.estadoValidacion === EstadoRespuesta.PENDIENTE));
  }

  // Pendientes de una encuesta puntual (RF14, ya filtradas por el encuestador logueado en backend)
  obtenerPendientesDeEncuesta(encuestaId: number): Observable<RespuestaEncuesta[]> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<RespuestaEncuesta[]>(`${API_URL}/respuestas/pendientes`, {
        params: { encuestaId },
      });
    }
    return of(
      this.mockRespuestas.filter(
        (r) => r.encuestaId === encuestaId && r.estadoValidacion === EstadoRespuesta.PENDIENTE,
      ),
    );
  }

  // GET /api/respuestas/{id}  (endpoint NO expuesto en backend; se filtra de /pendientes)
  obtenerPorId(id: number): Observable<RespuestaEncuesta> {
    if (USAR_BACKEND_REAL) {
      // Backend no expone GET por id: obtenemos la lista de pendientes y filtramos
      return this.http.get<RespuestaEncuesta[]>(`${API_URL}/respuestas/pendientes`).pipe(
        map((lista) => {
          const r = lista.find((x) => x.id === id);
          if (!r) throw new Error('RESPUESTA_NO_ENCONTRADA');
          return r;
        })
      );
    }
    // Mock: buscar directamente en el array
    const r = this.mockRespuestas.find((x) => x.id === id);
    if (!r) return throwError(() => new Error('RESPUESTA_NO_ENCONTRADA'));
    return of(r);
  }

  // GET /api/encuestas/{id}/estadisticas (RF17 - endpoint a confirmar en backend)
  obtenerEstadisticas(encuestaId: number): Observable<EstadisticasEncuesta> {
    return this.http.get<EstadisticasEncuesta>(`${API_URL}/encuestas/${encuestaId}/estadisticas`);
  }

  // PATCH /api/respuestas/{id}/validacion?estado=... (RF15 - endpoint a confirmar en backend)
  // http://localhost:8080/api/respuestas/1/estado?nuevoEstado=APROBADA
  validar(id: number, nuevoEstado: EstadoRespuesta): Observable<void> {
    if (USAR_BACKEND_REAL) {
      return this.http.patch<void>(`${API_URL}/respuestas/${id}/estado`, null, {
        params: { nuevoEstado },
      });
    }
    // Mock: actualizar estado local
    this.mockRespuestas = this.mockRespuestas.map((r) => 
      r.id === id ? { ...r, estadoValidacion: nuevoEstado } : r
    );
    return of(undefined);
  }

  // POST /api/publico/encuestas/{token}/responder (endpoint a confirmar en backend)
  enviar(datos: RespuestaEnviada): Observable<RespuestaEncuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.post<RespuestaEncuesta>(`${API_URL}/publico/encuestas/${datos.token}/responder`, datos);
    }
    const siguienteId = this.mockRespuestas.length ? Math.max(...this.mockRespuestas.map((r) => r.id)) + 1 : 504;
    const nueva: RespuestaEncuesta = {
      id: siguienteId,
      encuestaId: datos.encuestaId,
      fechaRespuesta: new Date().toISOString(),
      estadoValidacion: EstadoRespuesta.PENDIENTE,
      respuestas: datos.respuestas,
      encuestaTitulo: '', // en el mock no se resuelve el título de la encuesta
    };
    this.mockRespuestas = [...this.mockRespuestas, nueva];
    return of(nueva);
  }
}