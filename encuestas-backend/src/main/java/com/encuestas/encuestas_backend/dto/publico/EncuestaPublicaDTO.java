package com.encuestas.encuestas_backend.dto.publico;

import com.encuestas.encuestas_backend.dto.encuesta.PreguntaDTO;
import com.encuestas.encuestas_backend.model.Encuesta;
import com.encuestas.encuestas_backend.model.Pregunta;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class EncuestaPublicaDTO {
    private String titulo;
    private String descripcion;
    private List<PreguntaDTO> preguntas;

    public EncuestaPublicaDTO(Encuesta encuesta) {
        this.titulo = encuesta.getTitulo();
        this.descripcion = encuesta.getDescripcion();
        this.preguntas = encuesta.getPreguntas().stream()
                .map(this::convertirPregunta)
                .collect(Collectors.toList());
    }

    private PreguntaDTO convertirPregunta(Pregunta pregunta) {
        PreguntaDTO dto = new PreguntaDTO();
        dto.setOrden(pregunta.getOrden());
        dto.setTexto(pregunta.getTexto());
        dto.setTipo(pregunta.getTipo());
        dto.setOpciones(pregunta.getOpciones());
        return dto;
    }
}