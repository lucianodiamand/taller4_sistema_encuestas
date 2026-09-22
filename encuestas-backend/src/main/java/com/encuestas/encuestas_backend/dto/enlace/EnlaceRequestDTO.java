package com.encuestas.encuestas_backend.dto.enlace;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnlaceRequestDTO {
    private Long encuestaId;
    private Long encuestadorId;
}