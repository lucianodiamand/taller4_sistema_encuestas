package com.encuestas.encuestas_backend.dto.cliente;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteRequestDTO {
    private String nombre;
    private String email;
    private String telefono;
    private Long cuit;
    private Long usuarioId;
}