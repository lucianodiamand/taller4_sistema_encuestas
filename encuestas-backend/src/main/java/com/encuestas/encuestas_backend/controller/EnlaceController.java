package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.enlace.EnlaceRequestDTO;
import com.encuestas.encuestas_backend.dto.enlace.EnlaceResponseDTO;
import com.encuestas.encuestas_backend.service.EnlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enlaces")
public class EnlaceController {

    @Autowired
    private EnlaceService enlaceService;

    @PostMapping
    public EnlaceResponseDTO generar(@RequestBody EnlaceRequestDTO dto) {
        return enlaceService.generar(dto);
    }
}