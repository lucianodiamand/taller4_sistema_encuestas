// Estadísticas de una encuesta (RF17): se muestran en el detalle de encuesta.
export interface EstadisticasEncuesta {
  encuestaId: number;
  totalRespuestas: number;
  pendientes: number;
  aprobadas: number; // respuestas válidas
  rechazadas: number;
}