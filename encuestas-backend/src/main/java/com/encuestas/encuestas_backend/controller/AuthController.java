package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.auth.LoginRequestDTO;
import com.encuestas.encuestas_backend.dto.auth.LoginResponseDTO;
import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import com.encuestas.encuestas_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {
        try {
            // Esto es lo que efectivamente valida email + password (usando nuestro
            // UserDetailsServiceImpl + el PasswordEncoder, ambos configurados como Beans)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Email o contraseña incorrectos.");
        }

        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().name());

        return new LoginResponseDTO(token, usuario.getEmail(), usuario.getRol().name(), usuario.getId());
    }
}