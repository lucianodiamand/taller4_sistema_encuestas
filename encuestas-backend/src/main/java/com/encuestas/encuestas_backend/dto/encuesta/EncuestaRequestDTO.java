package com.encuestas.encuestas_backend.dto.encuesta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Lo que llega del frontend al crear o editar una encuesta.
 * A propósito NO incluye "preguntas" (se cargan después, una por una)
 * ni "disponible" (una encuesta siempre nace cerrada; se activa con un endpoint aparte).
 *
 * Ubicación: src/main/java/com/encuestas/encuestas_backend/dto/encuesta/EncuestaRequestDTO.java
 */

@Getter
@Setter
public class EncuestaRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255, message = "El nombre no puede superar los 255 caracteres")
    private String nombre;

    @Size(max = 255, message = "La descripción no puede superar los 255 caracteres")
    private String descripcion;

    @Size(max = 255, message = "Las restricciones no pueden superar los 255 caracteres")
    private String restricciones;

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;
}