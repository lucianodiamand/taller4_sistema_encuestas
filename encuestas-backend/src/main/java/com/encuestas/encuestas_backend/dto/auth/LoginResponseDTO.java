package com.encuestas.encuestas_backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private String token;
    private String email;
    private String rol;
    private Long usuarioId;

    public LoginResponseDTO(String token, String email, String rol, Long usuarioId) {
        this.token = token;
        this.email = email;
        this.rol = rol;
        this.usuarioId = usuarioId;
    }
}