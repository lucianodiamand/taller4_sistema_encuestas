package com.encuestas.encuestas_backend.dto.encuesta;

import com.encuestas.encuestas_backend.model.Encuesta;
import com.encuestas.encuestas_backend.model.Pregunta;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * Lo que devolvemos al frontend. Cliente y Usuario viajan como id + nombre, no como objetos completos.
 * "preguntas" reutiliza la clase Pregunta: no es una entidad, no tiene relaciones y no expone nada sensible.
 **/

@Getter
@Setter
public class EncuestaResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String restricciones;
    private Boolean disponible;
    private LocalDate fechaCreacion;
    private Long clienteId;
    private String clienteNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private Integer cantidadPreguntas;
    private List<Pregunta> preguntas;

    public EncuestaResponseDTO(Encuesta encuesta) {
        this.id = encuesta.getId();
        this.nombre = encuesta.getNombre();
        this.descripcion = encuesta.getDescripcion();
        this.restricciones = encuesta.getRestricciones();
        this.disponible = encuesta.getDisponible();
        this.fechaCreacion = encuesta.getFechaCreacion();
        this.clienteId = encuesta.getCliente().getId();
        this.clienteNombre = encuesta.getCliente().getNombre();
        this.usuarioId = encuesta.getUsuario().getId();
        this.usuarioNombre = encuesta.getUsuario().getNombre() + " " + encuesta.getUsuario().getApellido();
        this.preguntas = encuesta.getPreguntas();
        this.cantidadPreguntas = encuesta.getPreguntas().size();   // reemplaza a la columna cant_preguntas
    }
}