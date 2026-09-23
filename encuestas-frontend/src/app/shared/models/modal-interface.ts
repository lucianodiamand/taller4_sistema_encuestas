export interface DatosModal {
  titulo: string;
  tipoAccion: 'ver' | 'modificar' | 'eliminar' | 'crear';
  tipoEntidad: string;
  entidad: any;
}