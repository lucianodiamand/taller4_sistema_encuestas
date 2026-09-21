package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {
}