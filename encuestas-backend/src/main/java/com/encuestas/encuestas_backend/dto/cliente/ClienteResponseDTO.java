package com.encuestas.encuestas_backend.dto.cliente;

import com.encuestas.encuestas_backend.model.Cliente;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private Long cuit;
    private Boolean activo;
    private Long usuarioId;
    private String usuarioNombre;

    public ClienteResponseDTO(Cliente cliente) {
        this.id = cliente.getId();
        this.nombre = cliente.getNombre();
        this.email = cliente.getEmail();
        this.telefono = cliente.getTelefono();
        this.cuit = cliente.getCuit();
        this.activo = cliente.getActivo();
        this.usuarioId = cliente.getUsuario().getId();
        this.usuarioNombre = cliente.getUsuario().getNombre() + " " + cliente.getUsuario().getApellido();
    }
}