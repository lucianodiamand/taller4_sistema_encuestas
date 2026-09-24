package com.encuestas.encuestas_backend.dto.respuesta;

import com.encuestas.encuestas_backend.dto.publico.RespuestaPreguntaDTO;
import com.encuestas.encuestas_backend.model.EstadoRespuesta;
import com.encuestas.encuestas_backend.model.RespuestaEncuesta;
import com.encuestas.encuestas_backend.model.RespuestaPregunta;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class RespuestaEncuestaResponseDTO {
    private Long id;
    private EstadoRespuesta estadoValidacion;
    private LocalDateTime fechaRespuesta;
    private Long encuestaId;
    private String encuestaTitulo;
    private Long encuestadorId;   // el encuestador dueño del enlace, para validar RN03
    private List<RespuestaPreguntaDTO> respuestas;

    public RespuestaEncuestaResponseDTO(RespuestaEncuesta respuestaEncuesta) {
        this.id = respuestaEncuesta.getId();
        this.estadoValidacion = respuestaEncuesta.getEstadoValidacion();
        this.fechaRespuesta = respuestaEncuesta.getFechaRespuesta();
        this.encuestaId = respuestaEncuesta.getEnlace().getEncuesta().getId();
        this.encuestaTitulo = respuestaEncuesta.getEnlace().getEncuesta().getTitulo();
        this.encuestadorId = respuestaEncuesta.getEnlace().getEncuestador().getId();
        this.respuestas = respuestaEncuesta.getRespuestas().stream()
                .map(this::convertir)
                .collect(Collectors.toList());
    }

    private RespuestaPreguntaDTO convertir(RespuestaPregunta r) {
        RespuestaPreguntaDTO dto = new RespuestaPreguntaDTO();
        dto.setOrdenPregunta(r.getOrdenPregunta());
        dto.setTextoPregunta(r.getTextoPregunta());
        dto.setRespuesta(r.getRespuesta());
        return dto;
    }
}