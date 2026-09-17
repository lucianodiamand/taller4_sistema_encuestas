package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}