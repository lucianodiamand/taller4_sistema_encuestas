// Etidad Encuesta tal como la devuelve el backend (EncuestaResponseDTO).
// Referencia al cliente y al usuario (creador), más las preguntas embebidas.
import { EstadoEncuesta } from './estado-encuesta';
import { Pregunta } from './pregunta-interface';

// Datos necesarios al crear una encuesta (equivale a EncuestaRequestDTO del backend).
// La respuesta incluye además id, estado, fechaCreacion y los nombres de cliente/usuario.
export type EncuestaCrear = {
  titulo: string;
  descripcion?: string | null;
  clienteId: number;
  usuarioId: number;
  preguntas: Pregunta[];
};

export interface Encuesta {
  id: number;
  titulo: string;
  descripcion?: string | null;
  estado: EstadoEncuesta;
  fechaCreacion: string; // ISO 8601
  clienteId: number;
  clienteNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  preguntas: Pregunta[];
}