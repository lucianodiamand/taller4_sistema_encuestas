// Respuesta enviada por un encuestado anónimo a través de un enlace de un solo uso
// (README, sección 5 - RespuestaEncuesta). Aún no implementada en el backend.
import { EstadoRespuesta } from './estado-respuesta';
import { RespuestaPregunta } from './respuesta-enviada-interface';

export interface RespuestaEncuesta {
  id: number;
  encuestaId: number;
  encuestaTitulo: string;
  fechaRespuesta: string; // ISO 8601
  estadoValidacion: EstadoRespuesta;
  respuestas: RespuestaPregunta[];
}