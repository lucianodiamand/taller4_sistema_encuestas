package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Enlace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EnlaceRepository extends JpaRepository<Enlace, Long> {
    Optional<Enlace> findByToken(String token);
}