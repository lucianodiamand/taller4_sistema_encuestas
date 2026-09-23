// Etidad Cliente tal como la devuelve el backend (ClienteResponseDTO).
// Incluye una referencia al usuario (administrador) que lo creó.
export type ClienteCrear = {
  nombre: string;
  email: string;
  telefono?: string | null;
  cuit: number;
  usuarioId: number;
};

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  cuit: number;
  activo: boolean;
  usuarioId: number;
  usuarioNombre: string;
}