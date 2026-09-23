// Estado de validación de una respuesta (README, sección 5)
export enum EstadoRespuesta {
  PENDIENTE = 'PENDIENTE', // esperando revisión del encuestador
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}