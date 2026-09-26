/* Servicio de Enlaces de un solo uso y generación de QR (RF08/RF09).
 * El backend ya expone POST /api/enlaces (EnlaceController), que devuelve
 * urlCompleta + qrCodeBase64. En modo mock se simula el mismo resultado.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth';
import { EncuestaService } from './encuesta';
import { EstadoEnlace } from '../../shared/models/estado-enlace';
import { Enlace, EnlaceRequest } from '../../shared/models/enlace-interface';
import { Encuesta } from '../../shared/models/encuesta-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class EnlaceService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private encuestaService = inject(EncuestaService);

  // Registro mock en memoria (se pierde al refrescar)
  private mockEnlaces: { token: string; encuestaId: number; estado: EstadoEnlace }[] = [];

  // POST /api/enlaces
  generar(encuestaId: number, encuestaTitulo?: string): Observable<Enlace> {
    const body: EnlaceRequest = {
      encuestaId,
      encuestadorId: this.authService.currentUserId() ?? 0,
    };
    if (USAR_BACKEND_REAL) {
      return this.http.post<Enlace>(`${API_URL}/enlaces`, body);
    }
    const token = this.generarToken();
    // Registrar enlace en mock antes de devolverlo
    this.mockEnlaces.push({ token, encuestaId, estado: EstadoEnlace.PENDIENTE });
    return of({
      id: 9001,
      token,
      estado: EstadoEnlace.PENDIENTE,
      fechaCreacion: new Date().toISOString(),
      encuestaId,
      encuestaTitulo: encuestaTitulo ?? '',
      // En el mock no hay imagen real: la vista muestra un placeholder + la URL
      urlCompleta: `http://localhost:4200/responder/${token}`,
      qrCodeBase64: '',
    });
  }

  // GET /api/enlaces/{token}  (endpoint a confirmar en backend)
  obtenerPorToken(token: string): Observable<Encuesta> {
    if (USAR_BACKEND_REAL) {
      return this.http.get<Encuesta>(`${API_URL}/enlaces/${token}`);
    }
    // Token fijo 'demo' para probar a mano aunque se recargue la página
    if (token === 'demo') {
      return this.encuestaService.obtenerPorId(1).pipe(
        map((enc) => {
          if (!enc) throw new Error('ENLACE_INVALIDO');
          return enc;
        })
      );
    }
    const registro = this.mockEnlaces.find((e) => e.token === token);
    if (!registro) {
      return throwError(() => new Error('ENLACE_INVALIDO'));
    }
    if (registro.estado === EstadoEnlace.RESPONDIDO) {
      return throwError(() => new Error('ENLACE_USADO'));
    }
    return this.encuestaService.obtenerPorId(registro.encuestaId).pipe(
      map((enc) => {
        if (!enc) throw new Error('ENLACE_INVALIDO');
        // Verificar estado de la encuesta
        if (enc.estado !== 'ACTIVA') throw new Error('ENCUESTA_CERRADA');
        return enc;
      })
    );
  }

  // PATCH /api/enlaces/{token}/responder  (endpoint a confirmar en backend)
  marcarRespondido(token: string): Observable<void> {
    if (USAR_BACKEND_REAL) {
      return this.http.patch<void>(`${API_URL}/enlaces/${token}/responder`, null);
    }
    const idx = this.mockEnlaces.findIndex((e) => e.token === token);
    if (idx >= 0) {
      this.mockEnlaces[idx] = { ...this.mockEnlaces[idx], estado: EstadoEnlace.RESPONDIDO };
    }
    return of(undefined);
  }

  private generarToken(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  }
}