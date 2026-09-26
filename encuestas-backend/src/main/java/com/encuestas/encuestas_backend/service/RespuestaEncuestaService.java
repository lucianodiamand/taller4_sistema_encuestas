package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.publico.EncuestaPublicaDTO;
import com.encuestas.encuestas_backend.dto.publico.EnviarRespuestaDTO;
import com.encuestas.encuestas_backend.dto.publico.RespuestaPreguntaDTO;
import com.encuestas.encuestas_backend.dto.respuesta.RespuestaEncuestaResponseDTO;
import com.encuestas.encuestas_backend.model.*;
import com.encuestas.encuestas_backend.repository.EnlaceRepository;
import com.encuestas.encuestas_backend.repository.RespuestaEncuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RespuestaEncuestaService {

    @Autowired
    private EnlaceService enlaceService;

    @Autowired
    private EnlaceRepository enlaceRepository;

    @Autowired
    private RespuestaEncuestaRepository respuestaEncuestaRepository;

    // Paso 1 del flujo público: el encuestado accede al link y necesita ver la encuesta
    public EncuestaPublicaDTO obtenerEncuestaPorToken(String token) {
        Enlace enlace = enlaceService.validarYObtener(token); // ya valida RN02 y "no respondido"
        return new EncuestaPublicaDTO(enlace.getEncuesta());
    }

    // Paso 2 del flujo público: el encuestado envía sus respuestas
    // @Transactional: si algo falla en el medio, se revierten TODOS los cambios (ni se guarda
    // la respuesta a medias, ni se marca el enlace como usado). Todo o nada.
    @Transactional
    public void responder(String token, EnviarRespuestaDTO dto) {
        Enlace enlace = enlaceService.validarYObtener(token);

        RespuestaEncuesta respuestaEncuesta = new RespuestaEncuesta();
        respuestaEncuesta.setEnlace(enlace);
        respuestaEncuesta.setRespuestas(convertirRespuestas(dto.getRespuestas()));
        respuestaEncuestaRepository.save(respuestaEncuesta);

        // RF13: el enlace queda marcado como "respondido" e inhabilitado
        enlace.setEstado(EstadoEnlace.RESPONDIDO);
        enlaceRepository.save(enlace);
    }

    private List<RespuestaPregunta> convertirRespuestas(List<RespuestaPreguntaDTO> dtos) {
        return dtos.stream()
                .map(dto -> {
                    RespuestaPregunta r = new RespuestaPregunta();
                    r.setOrdenPregunta(dto.getOrdenPregunta());
                    r.setTextoPregunta(dto.getTextoPregunta());
                    r.setRespuesta(dto.getRespuesta());
                    return r;
                })
                .collect(Collectors.toList());
    }

    // RF14: el encuestador ve sus respuestas pendientes de validación
    public List<RespuestaEncuestaResponseDTO> listarPendientesPorEncuestador(Long encuestadorId) {
        return respuestaEncuestaRepository
                .findByEnlaceEncuestadorIdAndEstadoValidacion(encuestadorId, EstadoRespuesta.PENDIENTE)
                .stream()
                .map(RespuestaEncuestaResponseDTO::new)
                .collect(Collectors.toList());
    }

    // RF15: el encuestador aprueba o rechaza una respuesta
    public RespuestaEncuestaResponseDTO validar(Long respuestaId, Long encuestadorId, EstadoRespuesta nuevoEstado) {
        RespuestaEncuesta respuesta = respuestaEncuestaRepository.findById(respuestaId)
                .orElseThrow(() -> new RuntimeException("Respuesta no encontrada con id: " + respuestaId));

        // RN03: solo el encuestador dueño de la encuesta puede aprobar/rechazar sus respuestas
        Long duenioId = respuesta.getEnlace().getEncuestador().getId();
        if (!duenioId.equals(encuestadorId)) {
            throw new RuntimeException("No tenés permiso para validar esta respuesta.");
        }

        if (nuevoEstado != EstadoRespuesta.APROBADA && nuevoEstado != EstadoRespuesta.RECHAZADA) {
            throw new RuntimeException("El estado debe ser APROBADA o RECHAZADA.");
        }

        respuesta.setEstadoValidacion(nuevoEstado);
        RespuestaEncuesta guardada = respuestaEncuestaRepository.save(respuesta);
        return new RespuestaEncuestaResponseDTO(guardada);
    }

    public String generarCsv(Long encuestaId) {
        List<RespuestaEncuesta> aprobadas = respuestaEncuestaRepository
                .findByEnlaceEncuestaIdAndEstadoValidacion(encuestaId, EstadoRespuesta.APROBADA);

        if (aprobadas.isEmpty()) {
            throw new RuntimeException("No hay respuestas aprobadas para exportar en esta encuesta.");
        }

        StringBuilder csv = new StringBuilder();

        // Encabezado: usamos las preguntas de la PRIMERA respuesta como referencia de columnas
        csv.append("Fecha de respuesta");
        for (RespuestaPregunta r : aprobadas.get(0).getRespuestas()) {
            csv.append(",").append(escaparCsv(r.getTextoPregunta()));
        }
        csv.append("\n");

        // Una fila por cada respuesta aprobada
        for (RespuestaEncuesta respuestaEncuesta : aprobadas) {
            csv.append(escaparCsv(respuestaEncuesta.getFechaRespuesta().toString()));
            for (RespuestaPregunta r : respuestaEncuesta.getRespuestas()) {
                csv.append(",").append(escaparCsv(r.getRespuesta()));
            }
            csv.append("\n");
        }

        return csv.toString();
    }


    // Un valor de respuesta libre podría tener comas, comillas o saltos de línea,
    // lo cual rompería el formato CSV si no lo tratamos. Esta función lo "protege"
    // envolviéndolo en comillas dobles cuando hace falta (regla estándar del formato CSV).
    private String escaparCsv(String valor) {
        if (valor == null) {
            return "";
        }
        if (valor.contains(",") || valor.contains("\"") || valor.contains("\n")) {
            return "\"" + valor.replace("\"", "\"\"") + "\"";
        }
        return valor;
    }
}