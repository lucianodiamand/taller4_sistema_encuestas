package com.encuestas.encuestas_backend.dto.encuesta;

import com.encuestas.encuestas_backend.model.Encuesta;
import com.encuestas.encuestas_backend.model.EstadoEncuesta;
import com.encuestas.encuestas_backend.model.Pregunta;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class EncuestaResponseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private EstadoEncuesta estado;
    private LocalDateTime fechaCreacion;
    private Long clienteId;
    private String clienteNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private List<PreguntaDTO> preguntas;

    public EncuestaResponseDTO(Encuesta encuesta) {
        this.id = encuesta.getId();
        this.titulo = encuesta.getTitulo();
        this.descripcion = encuesta.getDescripcion();
        this.estado = encuesta.getEstado();
        this.fechaCreacion = encuesta.getFechaCreacion();
        this.clienteId = encuesta.getCliente().getId();
        this.clienteNombre = encuesta.getCliente().getNombre();
        this.usuarioId = encuesta.getUsuario().getId();
        this.usuarioNombre = encuesta.getUsuario().getNombre() + " " + encuesta.getUsuario().getApellido();
        this.preguntas = encuesta.getPreguntas().stream()
                .map(this::convertirPregunta)
                .collect(Collectors.toList());
    }

    // Convierte cada Pregunta (modelo) en un PreguntaDTO
    private PreguntaDTO convertirPregunta(Pregunta pregunta) {
        PreguntaDTO dto = new PreguntaDTO();
        dto.setOrden(pregunta.getOrden());
        dto.setTexto(pregunta.getTexto());
        dto.setTipo(pregunta.getTipo());
        dto.setOpciones(pregunta.getOpciones());
        return dto;
    }
}