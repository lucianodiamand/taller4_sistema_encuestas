// Estadísticas de una encuesta (RF17): se muestran en el detalle de encuesta.
export interface EstadisticasEncuesta {
  encuestaId: number;
  encuestaTitulo: string;
  enlacesGenerados: number;
  enlacesRespondidos: number;
  enlacesPendientes: number;
  respuestasPendientesValidacion: number;
  respuestasAprobadas: number; // respuestas válidas
  respuestasRechazadas: number;
}