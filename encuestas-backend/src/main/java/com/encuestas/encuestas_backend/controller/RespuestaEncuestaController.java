package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.respuesta.RespuestaEncuestaResponseDTO;
import com.encuestas.encuestas_backend.model.EstadoRespuesta;
import com.encuestas.encuestas_backend.security.AuthUtil;
import com.encuestas.encuestas_backend.service.RespuestaEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/respuestas")
public class RespuestaEncuestaController {

    @Autowired
    private RespuestaEncuestaService respuestaEncuestaService;

    @Autowired
    private AuthUtil authUtil;   // nuevo

    @GetMapping("/pendientes")
    public List<RespuestaEncuestaResponseDTO> listarPendientes() {
        return respuestaEncuestaService.listarPendientesPorEncuestador(authUtil.obtenerUsuarioActualId());
    }

    @PatchMapping("/{id}/estado")
    public RespuestaEncuestaResponseDTO validar(
            @PathVariable Long id,
            @RequestParam EstadoRespuesta nuevoEstado) {
        return respuestaEncuestaService.validar(id, authUtil.obtenerUsuarioActualId(), nuevoEstado);
    }
}