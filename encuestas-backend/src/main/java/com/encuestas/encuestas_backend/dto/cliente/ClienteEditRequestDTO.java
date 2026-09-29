package com.encuestas.encuestas_backend.dto.cliente;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteEditRequestDTO {
    private String nombre;
    private String email;
    private Long cuit;
    private String telefono;
    private Boolean activo;
}