package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.model.TokenBlacklist;
import com.encuestas.encuestas_backend.repository.TokenBlacklistRepository;
import com.encuestas.encuestas_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TokenBlacklistService {

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public void invalidarToken(String token) {
        TokenBlacklist entrada = new TokenBlacklist();
        entrada.setToken(token);
        entrada.setFechaExpiracionToken(jwtUtil.extraerFechaExpiracion(token));
        tokenBlacklistRepository.save(entrada);
    }

    public boolean estaInvalidado(String token) {
        return tokenBlacklistRepository.existsByToken(token);
    }
}