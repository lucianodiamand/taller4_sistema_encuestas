package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // JpaRepository<Usuario, Long> ya te da gratis:
    // save(), findById(), findAll(), deleteById(), count(), etc.

    // Spring Data JPA puede generar consultas solo a partir del nombre del metodo.
    // Esto va a buscar un usuario por su campo "email" sin que escribas SQL:
    Optional<Usuario> findByEmail(String email);
}