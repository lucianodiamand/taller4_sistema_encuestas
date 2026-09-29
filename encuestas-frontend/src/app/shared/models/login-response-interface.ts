export interface LoginResponse {
  token: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;      // 'ADMIN' | 'ENCUESTADOR'
  usuarioId: number;
}