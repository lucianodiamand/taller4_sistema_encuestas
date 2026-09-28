package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.usuario.UsuarioEditRequestDTO;
import com.encuestas.encuestas_backend.dto.usuario.UsuarioRequestDTO;
import com.encuestas.encuestas_backend.dto.usuario.UsuarioResponseDTO;
import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service                 // le dice a Spring "esto es un componente de lógica de negocio, manejalo vos"
public class UsuarioService {

    @Autowired            // Spring inyecta automáticamente una instancia de UsuarioRepository acá
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;   // Spring nos inyecta el Bean que creamos arriba

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream().map(UsuarioResponseDTO::new).collect(Collectors.toList());
    }

    public UsuarioResponseDTO guardar(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setRol(dto.getRol());

        Usuario guardado = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(guardado);
    }

    //Metodos para editar o desactivar (eliminado soft) un Usuario
    public UsuarioResponseDTO editar(Long id, UsuarioEditRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setEmail(dto.getEmail());
        usuario.setActivo(dto.getActivo());
        // "rol" y "password" quedan afuera de este endpoint a propósito

        Usuario actualizado = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(actualizado);
    }

    public void desactivar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    public void activar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }
}