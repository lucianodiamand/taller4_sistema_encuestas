package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.usuario.UsuarioEditRequestDTO;
import com.encuestas.encuestas_backend.dto.usuario.UsuarioRequestDTO;
import com.encuestas.encuestas_backend.dto.usuario.UsuarioResponseDTO;
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
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listarTodos();
    }

    @PostMapping
    public UsuarioResponseDTO crear(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.guardar(dto);
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO editar(@PathVariable Long id, @RequestBody UsuarioEditRequestDTO dto) {
        return usuarioService.editar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
    }

    @PatchMapping("/{id}/desactivar")
    public void desactivar(@PathVariable Long id) {
        usuarioService.desactivar(id);
    }

    @PatchMapping("/{id}/activar")
    public void activar(@PathVariable Long id) {
        usuarioService.activar(id);
    }
}