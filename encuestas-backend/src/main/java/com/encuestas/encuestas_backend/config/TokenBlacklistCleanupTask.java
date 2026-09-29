package com.encuestas.encuestas_backend.config;

import com.encuestas.encuestas_backend.repository.TokenBlacklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class TokenBlacklistCleanupTask {

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    // Corre una vez por hora
    @Scheduled(fixedRate = 3600000)
    public void limpiarTokensExpirados() {
        tokenBlacklistRepository.eliminarExpirados(LocalDateTime.now());
    }
}