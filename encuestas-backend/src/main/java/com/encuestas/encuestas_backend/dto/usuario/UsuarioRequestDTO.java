package com.encuestas.encuestas_backend.dto.usuario;

import com.encuestas.encuestas_backend.model.Rol;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDTO {
    private String email;
    private String password;
    private String nombre;
    private String apellido;
    private Rol rol;
}