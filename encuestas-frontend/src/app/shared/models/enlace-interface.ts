// Enlace de un solo uso generado por el encuestador para responder la encuesta
// (backend: Enlace.java / EnlaceResponseDTO.java).
// El QR llega en base64 y se muestra con 'data:image/png;base64,' + qrCodeBase64.
import { EstadoEnlace } from './estado-enlace';

export type EnlaceRequest = {
  encuestaId: number;
  encuestadorId: number;
};

export interface Enlace {
  id: number;
  token: string;
  estado: EstadoEnlace;
  fechaCreacion: string; // ISO 8601
  encuestaId: number;
  encuestaTitulo: string;
  urlCompleta: string;
  qrCodeBase64?: string | null;
}