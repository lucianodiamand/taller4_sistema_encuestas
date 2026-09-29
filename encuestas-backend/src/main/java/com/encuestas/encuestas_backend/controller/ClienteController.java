package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.cliente.ClienteEditRequestDTO;
import com.encuestas.encuestas_backend.dto.cliente.ClienteRequestDTO;
import com.encuestas.encuestas_backend.dto.cliente.ClienteResponseDTO;
import com.encuestas.encuestas_backend.security.AuthUtil;
import com.encuestas.encuestas_backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private AuthUtil authUtil;   // nuevo

    @GetMapping
    public List<ClienteResponseDTO> listar() {
        return clienteService.listarTodos();
    }

    @PostMapping
    public ClienteResponseDTO crear(@RequestBody ClienteRequestDTO dto) {
        return clienteService.guardar(dto, authUtil.obtenerUsuarioActualId());
    }

    @PutMapping("/{id}")
    public ClienteResponseDTO editar(@PathVariable Long id, @RequestBody ClienteEditRequestDTO dto) {
        return clienteService.editar(id, dto);
    }

    @PatchMapping("/{id}/desactivar")
    public void desactivar(@PathVariable Long id) {
        clienteService.desactivar(id);
    }

    @PatchMapping("/{id}/activar")
    public void activar(@PathVariable Long id) {
        clienteService.activar(id);
    }

}