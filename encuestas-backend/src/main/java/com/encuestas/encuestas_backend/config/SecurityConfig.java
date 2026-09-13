package com.encuestas.encuestas_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Desactivamos CSRF por ahora (es una protección pensada para apps con sesiones
                // y formularios HTML; nosotros vamos a usar JWT, así que no aplica igual)
                .csrf(csrf -> csrf.disable())

                // Le decimos qué endpoints son públicos y cuáles no
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().permitAll() // TEMPORAL: todo público hasta que armemos JWT
                )

                // La consola de H2 usa <iframe>, y Spring por defecto los bloquea. Se lo permitimos.
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}