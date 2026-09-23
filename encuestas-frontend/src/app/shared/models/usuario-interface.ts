// Etidad Usuario tal como la devuelve el backend (UsuarioResponseDTO).
// "password" solo se usa al crear/editar (UsuarioRequestDTO), no viene en la respuesta.
import { Rol } from './rol';

export type UsuarioCrear = {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: Rol;
};

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: Rol;
  activo: boolean;
}