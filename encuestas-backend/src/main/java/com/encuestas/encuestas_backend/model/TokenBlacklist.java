package com.encuestas.encuestas_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "token_blacklist")
@Getter
@Setter
@NoArgsConstructor
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    // Guardamos también la expiración original del token, para poder
    // limpiar la tabla después (no tiene sentido guardar un token bloqueado
    // para siempre si de todas formas ya iba a vencer solo)
    @Column(nullable = false)
    private LocalDateTime fechaExpiracionToken;
}