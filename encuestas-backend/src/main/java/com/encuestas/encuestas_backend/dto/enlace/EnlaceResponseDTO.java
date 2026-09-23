package com.encuestas.encuestas_backend.dto.enlace;

import com.encuestas.encuestas_backend.model.Enlace;
import com.encuestas.encuestas_backend.model.EstadoEnlace;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class EnlaceResponseDTO {
    private Long id;
    private String token;
    private EstadoEnlace estado;
    private LocalDateTime fechaCreacion;
    private Long encuestaId;
    private String encuestaTitulo;
    private String urlCompleta;
    private String qrCodeBase64;

    public EnlaceResponseDTO(Enlace enlace) {
        this.id = enlace.getId();
        this.token = enlace.getToken();
        this.estado = enlace.getEstado();
        this.fechaCreacion = enlace.getFechaCreacion();
        this.encuestaId = enlace.getEncuesta().getId();
        this.encuestaTitulo = enlace.getEncuesta().getTitulo();
        this.urlCompleta = "http://localhost:4200/responder/" + enlace.getToken();
    }
}