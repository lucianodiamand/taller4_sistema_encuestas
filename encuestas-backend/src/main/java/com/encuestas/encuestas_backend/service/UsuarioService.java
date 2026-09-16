package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service                 // le dice a Spring "esto es un componente de lógica de negocio, manejalo vos"
public class UsuarioService {

    @Autowired            // Spring inyecta automáticamente una instancia de UsuarioRepository acá
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;   // Spring nos inyecta el Bean que creamos arriba

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario guardar(Usuario usuario) {
        // Encriptamos la contraseña ANTES de guardar
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);
        return usuarioRepository.save(usuario);
    }
}