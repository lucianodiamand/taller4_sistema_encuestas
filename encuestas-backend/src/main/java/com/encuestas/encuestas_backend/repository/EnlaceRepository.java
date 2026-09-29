package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Enlace;
import com.encuestas.encuestas_backend.model.EstadoEnlace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EnlaceRepository extends JpaRepository<Enlace, Long> {
    Optional<Enlace> findByToken(String token);
    long countByEncuestaId(Long encuestaId);
    long countByEncuestaIdAndEstado(Long encuestaId, EstadoEnlace estado);

    long countByEncuestaIdAndEncuestadorId(Long encuestaId, Long encuestadorId);
    long countByEncuestaIdAndEncuestadorIdAndEstado(Long encuestaId, Long encuestadorId, EstadoEnlace estado);
}