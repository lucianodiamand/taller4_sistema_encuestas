package com.encuestas.encuestas_backend.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class RespuestaPregunta {
    private Integer ordenPregunta;   // para saber a qué pregunta corresponde
    private String textoPregunta;    // guardamos también el texto, por si la encuesta cambia después
    private String respuesta;        // para OPCION_MULTIPLE, guardamos las opciones separadas por coma
}