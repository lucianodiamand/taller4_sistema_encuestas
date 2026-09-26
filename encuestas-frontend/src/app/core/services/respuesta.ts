/* Servicio de Respuestas de encuesta (validación del encuestador, RF14/RF15).
 * El backend aún no implementa RespuestaEncuesta: se simula con datos estáticos
 * siguiendo el mismo patrón que los demás servicios (USAR_BACKEND_REAL en config.ts).
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EstadoRespuesta } from '../../shared/models/estado-respuesta';
import { RespuestaEncuesta } from '../../shared/models/respuesta-encuesta-interface';
import { EstadisticasEncuesta } from '../../shared/models/estadisticas-encuesta';
import { RespuestaEnviada } from '../../shared/models/respuesta-enviada-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class RespuestaService {
  private http = inject(HttpClient);

  // ===== Datos de ejemplo (mock) =====
  private mockRespuestas: RespuestaEncuesta[] = [
    { id: 501, encuesta_id: 1, codigo: 'ABC-123', fecha: '2026-09-20', estado: EstadoRespuesta.PENDIENTE },
    { id: 502, encuesta_id: 1, codigo: 'XYZ-987', fecha: '2026-09-21', estado: EstadoRespuesta.PENDIENTE },
    { id: 503, encuesta_id: 2, codigo: 'LMN-456', fecha: '2026-09-22', estado: EstadoRespuesta.PENDIENTE },
  ];

  // GET /api/respuestas/pendientes (endpoint a confirmar en backend)
  obtenerPendientes(): Observable<RespuestaEncuesta[]> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<RespuestaEncuesta[]>(`${API_URL}/respuestas/pendientes`);
    }
    return of(this.mockRespuestas.filter((r) => r.estado === EstadoRespuesta.PENDIENTE));
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
        (r) => r.encuesta_id === encuestaId && r.estado === EstadoRespuesta.PENDIENTE,
      ),
    );
  }

  // GET /api/encuestas/{id}/estadisticas (RF17 - endpoint a confirmar en backend)
  obtenerEstadisticas(encuestaId: number): Observable<EstadisticasEncuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<EstadisticasEncuesta>(`${API_URL}/encuestas/${encuestaId}/estadisticas`);
    }
    // Mock coherente: la encuesta 1 tiene 2 pendientes en el mock
    return of({
      encuestaId,
      totalRespuestas: 5,
      pendientes: encuestaId === 1 ? 2 : 1,
      aprobadas: 2,
      rechazadas: 1,
    });
  }

  // PATCH /api/respuestas/{id}/validacion?estado=... (RF15 - endpoint a confirmar en backend)
  validar(id: number, estado: 'aprobada' | 'rechazada'): Observable<void> {
    if (USAR_BACKEND_REAL) {
      return this.http.patch<void>(`${API_URL}/respuestas/${id}/validacion`, null, {
        params: { estado },
      });
    }
    this.mockRespuestas = this.mockRespuestas.filter((r) => r.id !== id);
    return of(undefined);
  }

  // POST /api/respuestas (endpoint a confirmar en backend)
  enviar(datos: RespuestaEnviada): Observable<RespuestaEncuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.post<RespuestaEncuesta>(`${API_URL}/respuestas`, datos);
    }
    const siguienteId = this.mockRespuestas.length ? Math.max(...this.mockRespuestas.map((r) => r.id)) + 1 : 504;
    const codigo = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(100 + Math.random() * 900)}`;
    const nueva: RespuestaEncuesta = {
      id: siguienteId,
      encuesta_id: datos.encuestaId,
      codigo,
      fecha: new Date().toISOString().slice(0, 10),
      estado: EstadoRespuesta.PENDIENTE,
    };
    this.mockRespuestas = [...this.mockRespuestas, nueva];
    return of(nueva);
  }
}