package com.encuestas.encuestas_backend.dto.encuesta;

import com.encuestas.encuestas_backend.model.TipoPregunta;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PreguntaDTO {
    private Integer orden;
    private String texto;
    private TipoPregunta tipo;
    private List<String> opciones = new ArrayList<>();
}