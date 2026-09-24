package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.EstadoRespuesta;
import com.encuestas.encuestas_backend.model.RespuestaEncuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RespuestaEncuestaRepository extends JpaRepository<RespuestaEncuesta, Long> {

    // "buscar por enlace.encuestador.id Y estadoValidacion"
    List<RespuestaEncuesta> findByEnlaceEncuestadorIdAndEstadoValidacion(
            Long encuestadorId, EstadoRespuesta estadoValidacion);
}