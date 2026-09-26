package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.encuesta.EstadisticasEncuestaDTO;
import com.encuestas.encuestas_backend.model.EstadoEnlace;
import com.encuestas.encuestas_backend.model.EstadoRespuesta;
import com.encuestas.encuestas_backend.model.Encuesta;
import com.encuestas.encuestas_backend.repository.EncuestaRepository;
import com.encuestas.encuestas_backend.repository.EnlaceRepository;
import com.encuestas.encuestas_backend.repository.RespuestaEncuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstadisticasService {

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private EnlaceRepository enlaceRepository;

    @Autowired
    private RespuestaEncuestaRepository respuestaEncuestaRepository;

    public EstadisticasEncuestaDTO obtenerEstadisticas(Long encuestaId) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id: " + encuestaId));

        long generados = enlaceRepository.countByEncuestaId(encuestaId);
        long respondidos = enlaceRepository.countByEncuestaIdAndEstado(encuestaId, EstadoEnlace.RESPONDIDO);
        long pendientes = enlaceRepository.countByEncuestaIdAndEstado(encuestaId, EstadoEnlace.PENDIENTE);

        long aprobadas = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.APROBADA);
        long rechazadas = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.RECHAZADA);
        long pendientesValidacion = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.PENDIENTE);

        return new EstadisticasEncuestaDTO(
                encuesta.getId(),
                encuesta.getTitulo(),
                generados,
                respondidos,
                pendientes,
                aprobadas,
                rechazadas,
                pendientesValidacion
        );
    }
}