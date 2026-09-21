export interface DatosModal {
  titulo: string;
  tipoAccion: 'ver' | 'modificar' | 'eliminar';
  entidad: any;
}