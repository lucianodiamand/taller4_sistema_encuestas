package com.encuestas.encuestas_backend.dto.usuario;

import com.encuestas.encuestas_backend.model.Rol;
import com.encuestas.encuestas_backend.model.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioResponseDTO {
    private Long id;
    private String email;
    private String nombre;
    private String apellido;
    private Rol rol;
    private Boolean activo;

    // Elegimos que datos mostrar al front
    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.rol = usuario.getRol();
        this.activo = usuario.getActivo();
    }
}