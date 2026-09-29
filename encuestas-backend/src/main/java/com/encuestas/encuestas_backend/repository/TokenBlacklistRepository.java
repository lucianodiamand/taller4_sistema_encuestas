package com.encuestas.encuestas_backend.repository;

import com.encuestas.encuestas_backend.model.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {

    boolean existsByToken(String token);

    // Borra de la blacklist los tokens que igual ya hubieran expirado solos.
    // @Modifying es necesario porque esta query no hace un SELECT, sino un DELETE.
    @Modifying
    @Query("DELETE FROM TokenBlacklist t WHERE t.fechaExpiracionToken < :ahora")
    void eliminarExpirados(LocalDateTime ahora);
}