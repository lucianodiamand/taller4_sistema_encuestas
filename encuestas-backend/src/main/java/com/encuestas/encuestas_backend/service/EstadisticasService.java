package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.encuesta.EstadisticasEncuestaDTO;
import com.encuestas.encuestas_backend.model.*;
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

    public EstadisticasEncuestaDTO obtenerEstadisticas(Long encuestaId, Usuario usuarioActual) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id: " + encuestaId));

        boolean esAdmin = usuarioActual.getRol() == Rol.ADMIN;

        long generados;
        long respondidos;
        long pendientes;
        long aprobadas;
        long rechazadas;
        long pendientesValidacion;

        if (esAdmin) {
            // ADMIN: estadísticas globales de la encuesta, sin filtrar por encuestador
            generados = enlaceRepository.countByEncuestaId(encuestaId);
            respondidos = enlaceRepository.countByEncuestaIdAndEstado(encuestaId, EstadoEnlace.RESPONDIDO);
            pendientes = enlaceRepository.countByEncuestaIdAndEstado(encuestaId, EstadoEnlace.PENDIENTE);

            aprobadas = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.APROBADA);
            rechazadas = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.RECHAZADA);
            pendientesValidacion = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.PENDIENTE);

        } else {
            // ENCUESTADOR: solo lo relacionado a los enlaces que él mismo generó para esta encuesta
            Long encuestadorId = usuarioActual.getId();

            generados = enlaceRepository.countByEncuestaIdAndEncuestadorId(encuestaId, encuestadorId);
            respondidos = enlaceRepository.countByEncuestaIdAndEncuestadorIdAndEstado(encuestaId, encuestadorId, EstadoEnlace.RESPONDIDO);
            pendientes = enlaceRepository.countByEncuestaIdAndEncuestadorIdAndEstado(encuestaId, encuestadorId, EstadoEnlace.PENDIENTE);

            aprobadas = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEnlaceEncuestadorIdAndEstadoValidacion(encuestaId, encuestadorId, EstadoRespuesta.APROBADA);
            rechazadas = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEnlaceEncuestadorIdAndEstadoValidacion(encuestaId, encuestadorId, EstadoRespuesta.RECHAZADA);
            pendientesValidacion = respuestaEncuestaRepository.countByEnlaceEncuestaIdAndEnlaceEncuestadorIdAndEstadoValidacion(encuestaId, encuestadorId, EstadoRespuesta.PENDIENTE);
        }

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