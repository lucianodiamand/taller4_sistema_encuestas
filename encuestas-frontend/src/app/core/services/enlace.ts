/* Servicio de Enlaces de un solo uso y generación de QR (RF08/RF09).
 * El backend ya expone POST /api/enlaces (EnlaceController), que devuelve
 * urlCompleta + qrCodeBase64. En modo mock se simula el mismo resultado.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth';
import { EstadoEnlace } from '../../shared/models/estado-enlace';
import { Enlace, EnlaceRequest } from '../../shared/models/enlace-interface';
import { API_URL, USAR_BACKEND_REAL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class EnlaceService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

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

  private generarToken(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  }
}