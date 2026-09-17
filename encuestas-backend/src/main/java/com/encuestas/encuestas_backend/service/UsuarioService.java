package com.encuestas.encuestas_backend.service;

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
}