package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.publico.EncuestaPublicaDTO;
import com.encuestas.encuestas_backend.dto.publico.EnviarRespuestaDTO;
import com.encuestas.encuestas_backend.service.RespuestaEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publico")
public class RespuestaPublicaController {

    @Autowired
    private RespuestaEncuestaService respuestaEncuestaService;

    @GetMapping("/encuestas/{token}")
    public EncuestaPublicaDTO obtenerEncuesta(@PathVariable String token) {
        return respuestaEncuestaService.obtenerEncuestaPorToken(token);
    }

    @PostMapping("/encuestas/{token}/responder")
    public void responder(@PathVariable String token, @RequestBody EnviarRespuestaDTO dto) {
        respuestaEncuestaService.responder(token, dto);
    }
}