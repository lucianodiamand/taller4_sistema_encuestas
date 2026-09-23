// Respuesta enviada por un encuestado anónimo a través de un enlace de un solo uso
// (README, sección 5 - RespuestaEncuesta). Aún no implementada en el backend.
import { EstadoRespuesta } from './estado-respuesta';

export interface RespuestaEncuesta {
  id: number;
  codigo: string; // enlace único de un solo uso
  encuesta_id: number;
  fecha: string; // ISO 8601
  estado: EstadoRespuesta;
}