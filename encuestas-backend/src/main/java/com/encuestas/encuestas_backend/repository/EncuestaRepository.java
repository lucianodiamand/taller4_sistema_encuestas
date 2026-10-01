package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Encuesta;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {
	List<Encuesta> findByEliminadoFalse();
}