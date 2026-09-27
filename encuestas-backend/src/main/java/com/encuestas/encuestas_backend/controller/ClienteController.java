package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.cliente.ClienteRequestDTO;
import com.encuestas.encuestas_backend.dto.cliente.ClienteResponseDTO;
import com.encuestas.encuestas_backend.model.Cliente;
import com.encuestas.encuestas_backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<ClienteResponseDTO> listar() {
        return clienteService.listarTodos();
    }

    @PostMapping
    public ClienteResponseDTO crear(@RequestBody ClienteRequestDTO dto) {
        return clienteService.guardar(dto);
    }
}