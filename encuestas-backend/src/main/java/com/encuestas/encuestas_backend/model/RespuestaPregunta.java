package com.encuestas.encuestas_backend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Tampoco es una entidad: es lo que el encuestado contestó en UNA pregunta.
 * La lista completa se guarda como JSON en RespuestaEncuesta.respuestas.
 */

@Getter
@Setter
@NoArgsConstructor
public class RespuestaPregunta {

    private Integer preguntaId;       // coincide con Pregunta.id
    private List<String> valores;     // 1 elemento para texto u opción única; varios para opción múltiple
}