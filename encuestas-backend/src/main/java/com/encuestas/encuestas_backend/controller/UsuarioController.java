package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.usuario.UsuarioRequestDTO;
import com.encuestas.encuestas_backend.dto.usuario.UsuarioResponseDTO;
import com.encuestas.encuestas_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController            // combina @Controller + @ResponseBody: devuelve JSON directamente
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@RequestMapping("/api/usuarios")   // prefijo común para todos los endpoints de esta clase
public class UsuarioController { //TODO: /api/usuarios recuperar propio usuario y cambiar contrasenia

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping                // GET /api/usuarios
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listarTodos();
    }

    @PostMapping
    public UsuarioResponseDTO crear(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.guardar(dto);
    }
}