package com.encuestas.encuestas_backend.dto.encuesta;

import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class EncuestaRequestDTO {
    private String titulo;
    private String descripcion;
    private Long clienteId;
    private Long usuarioId;
    private List<PreguntaDTO> preguntas = new ArrayList<>();
}