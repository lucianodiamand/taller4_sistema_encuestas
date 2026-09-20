package com.encuestas.encuestas_backend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * NO es una entidad (no lleva @Entity): no tiene tabla propia.
 * Se guarda como JSON dentro de la columna "preguntas" de Encuesta.
 *
 * Ubicación: src/main/java/com/encuestas/encuestas_backend/model/Pregunta.java
 */
@Getter
@Setter
@NoArgsConstructor
public class Pregunta {

    private Integer id;               // identificador dentro de la encuesta (1, 2, 3...)
    private String texto;
    private TipoPregunta tipo;
    private List<String> opciones;    // solo para OPCION_UNICA / OPCION_MULTIPLE; null en TEXTO_LIBRE
    private Boolean obligatoria = true;
}