// Tipo de cada pregunta dentro de una encuesta (backend: TipoPregunta.java)
export enum TipoPregunta {
  TEXTO_LIBRE = 'TEXTO_LIBRE', // respuesta abierta
  OPCION_UNICA = 'OPCION_UNICA', // elige 1 opción (radio button)
  OPCION_MULTIPLE = 'OPCION_MULTIPLE', // elige varias opciones (checkbox)
  ESCALA = 'ESCALA',
  EMAIL = 'EMAIL',
  NUMERO = 'NUMERO',
  TELEFONO = 'TELEFONO', // ejemplo: del 1 al 5
}
