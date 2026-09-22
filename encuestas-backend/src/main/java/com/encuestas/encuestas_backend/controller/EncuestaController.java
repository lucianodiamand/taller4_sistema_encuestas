package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.encuesta.EncuestaRequestDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EncuestaResponseDTO;
import com.encuestas.encuestas_backend.model.EstadoEncuesta;
import com.encuestas.encuestas_backend.service.EncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@RequestMapping("/api/encuestas")
public class EncuestaController {

    @Autowired
    private EncuestaService encuestaService;

    @GetMapping
    public List<EncuestaResponseDTO> listar() {
        return encuestaService.listarTodas();
    }

    @PatchMapping("/{id}/estado")
    public EncuestaResponseDTO cambiarEstado(@PathVariable Long id, @RequestParam EstadoEncuesta nuevoEstado) {
        return encuestaService.cambiarEstado(id, nuevoEstado);
    }

    @PostMapping
    public EncuestaResponseDTO crear(@RequestBody EncuestaRequestDTO dto) {
        return encuestaService.guardar(dto);
    }
}