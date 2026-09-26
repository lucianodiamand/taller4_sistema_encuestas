// Respuesta enviada por un encuestado anónimo (payload del envío).
// "preguntaOrden" identifica la pregunta (la Pregunta no tiene id, solo orden).
export interface RespuestaPregunta {
  preguntaOrden: number;
  valor: string | number | string[];
}

export interface RespuestaEnviada {
  token: string;
  encuestaId: number;
  respuestas: RespuestaPregunta[];
}