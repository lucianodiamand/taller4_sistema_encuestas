package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.encuesta.EncuestaRequestDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EncuestaResponseDTO;
import com.encuestas.encuestas_backend.service.EncuestaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * X ahora: solo listar, obtener y crear.
 *
 * TEMPORAL: "usuarioId" (quién ejecuta la acción) viaja como parámetro en la URL.
 * Cuando armemos JWT se saca de acá y se toma del token.
 *
 */

@RestController
@RequestMapping("/api/encuestas")
@RequiredArgsConstructor
public class EncuestaController {

    private final EncuestaService encuestaService;

    @GetMapping
    public List<EncuestaResponseDTO> listar() {
        return encuestaService.listarTodas();
    }

    @GetMapping("/{id}")
    public EncuestaResponseDTO obtener(@PathVariable Long id) {
        return encuestaService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EncuestaResponseDTO crear(@Valid @RequestBody EncuestaRequestDTO dto,
                                     @RequestParam Long usuarioId) {
        return encuestaService.crear(dto, usuarioId);
    }
}