package com.encuestas.encuestas_backend.dto.publico;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class EnviarRespuestaDTO {
    private List<RespuestaPreguntaDTO> respuestas;
}