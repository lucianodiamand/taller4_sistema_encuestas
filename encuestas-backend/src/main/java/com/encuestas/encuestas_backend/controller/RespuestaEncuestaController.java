package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.respuesta.RespuestaEncuestaResponseDTO;
import com.encuestas.encuestas_backend.model.EstadoRespuesta;
import com.encuestas.encuestas_backend.service.RespuestaEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/respuestas")
public class RespuestaEncuestaController {

    @Autowired
    private RespuestaEncuestaService respuestaEncuestaService;

    @GetMapping("/pendientes")
    public List<RespuestaEncuestaResponseDTO> listarPendientes(@RequestParam Long encuestadorId) {
        return respuestaEncuestaService.listarPendientesPorEncuestador(encuestadorId);
    }

    @PatchMapping("/{id}/estado")
    public RespuestaEncuestaResponseDTO validar(
            @PathVariable Long id,
            @RequestParam Long encuestadorId,
            @RequestParam EstadoRespuesta nuevoEstado) {
        return respuestaEncuestaService.validar(id, encuestadorId, nuevoEstado);
    }
}