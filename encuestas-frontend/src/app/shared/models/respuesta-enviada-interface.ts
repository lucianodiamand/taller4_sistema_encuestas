// Respuesta enviada por un encuestado anónimo (payload del envío).
// Alineado con el backend: RespuestaEncuestaResponseDTO.respuestas = [{ ordenPregunta, textoPregunta, respuesta }]
export interface RespuestaPregunta {
  ordenPregunta: number;
  textoPregunta: string;
  respuesta: string; // para OPCION_MULTIPLE: opciones unidas con ', '
}

export interface RespuestaEnviada {
  token: string;
  encuestaId: number;
  respuestas: RespuestaPregunta[];
}