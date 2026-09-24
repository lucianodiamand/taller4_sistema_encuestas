package com.encuestas.encuestas_backend.dto.publico;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RespuestaPreguntaDTO {
    private Integer ordenPregunta;
    private String textoPregunta;
    private String respuesta;
}