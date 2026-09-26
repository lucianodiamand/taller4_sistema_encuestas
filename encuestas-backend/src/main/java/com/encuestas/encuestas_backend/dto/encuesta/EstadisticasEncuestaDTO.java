package com.encuestas.encuestas_backend.dto.encuesta;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class EstadisticasEncuestaDTO {
    private Long encuestaId;
    private String encuestaTitulo;
    private long enlacesGenerados;
    private long enlacesRespondidos;
    private long enlacesPendientes;
    private long respuestasAprobadas;
    private long respuestasRechazadas;
    private long respuestasPendientesValidacion;
}