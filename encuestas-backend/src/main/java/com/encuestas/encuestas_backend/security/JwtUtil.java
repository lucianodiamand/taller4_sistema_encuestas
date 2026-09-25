package com.encuestas.encuestas_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Genera un token nuevo para un usuario, incluyendo su rol como "claim" extra
    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extraerEmail(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public String extraerRol(String token) {
        return extraerClaim(token, claims -> claims.get("rol", String.class));
    }

    private <T> T extraerClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    public boolean esTokenValido(String token, String email) {
        try {
            String emailDelToken = extraerEmail(token);
            Date expiracion = extraerClaim(token, Claims::getExpiration);
            return emailDelToken.equals(email) && expiracion.after(new Date());
        } catch (Exception e) {
            return false;   // token corrupto, mal firmado, o vencido
        }
    }
}