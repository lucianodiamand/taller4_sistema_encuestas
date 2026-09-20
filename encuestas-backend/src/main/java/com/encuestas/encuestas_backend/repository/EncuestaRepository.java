package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {

    // SELECT * FROM encuestas WHERE activo = true (Spring lo deduce del nombre del método)
    List<Encuesta> findByActivoTrue();
}