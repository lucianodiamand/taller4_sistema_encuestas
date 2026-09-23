// Pregunta dentro de una encuesta (backend: Pregunta.java / PreguntaDTO.java).
// "opciones" solo aplica en los tipos OPCION_UNICA y OPCION_MULTIPLE.
import { TipoPregunta } from './tipo-pregunta';

export interface Pregunta {
  orden: number;
  texto: string;
  tipo: TipoPregunta;
  opciones: string[];
}