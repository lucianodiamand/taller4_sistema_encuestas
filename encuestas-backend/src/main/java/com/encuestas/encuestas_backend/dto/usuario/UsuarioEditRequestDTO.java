package com.encuestas.encuestas_backend.dto.usuario;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioEditRequestDTO {
    private String nombre;
    private String apellido;
    private String email;
    private Boolean activo;
}