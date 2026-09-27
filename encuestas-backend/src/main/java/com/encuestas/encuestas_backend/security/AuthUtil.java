package com.encuestas.encuestas_backend.security;

import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Devuelve el Usuario completo correspondiente al token con el que se hizo este request
    public Usuario obtenerUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // recordá: guardamos el email como "username"

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado."));
    }

    public Long obtenerUsuarioActualId() {
        return obtenerUsuarioActual().getId();
    }
}