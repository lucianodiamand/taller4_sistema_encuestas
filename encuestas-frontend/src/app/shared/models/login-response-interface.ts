export interface LoginResponse {
  token: string;
  email: string;
  rol: string;      // 'ADMIN' | 'ENCUESTADOR'
  usuarioId: number;
}