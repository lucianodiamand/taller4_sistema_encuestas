package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController            // combina @Controller + @ResponseBody: devuelve JSON directamente
@RequestMapping("/api/usuarios")   // prefijo común para todos los endpoints de esta clase
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping                // GET /api/usuarios
    public List<Usuario> listar() {
        return usuarioService.listarTodos();
    }

    @PostMapping                // POST /api/usuarios
    public Usuario crear(@RequestBody Usuario usuario) {
        return usuarioService.guardar(usuario);
    }
}