package com.encuestas.encuestas_backend.config;

import com.encuestas.encuestas_backend.security.JwtAuthenticationFilter;
import com.encuestas.encuestas_backend.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                // Sin sesiones: cada request se autentica solo con su token, el server no "recuerda" nada
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos, sin necesidad de token
                        // TODO: Quitar en produccion el permitAll() para h2 y Swagger
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/publico/**").permitAll()

                        // Endpoints protegidos por rol
                        // TODO: Revisar request en base a roles
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                        .requestMatchers("/api/clientes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/encuestas/*/estadisticas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/encuestas/*/exportar-csv").hasRole("ADMIN")   // nueva línea, ANTES de las de abajo
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/encuestas/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/encuestas/**").hasRole("ADMIN")
                        .requestMatchers("/api/enlaces/**").hasRole("ENCUESTADOR")
                        // .requestMatchers("/api/respuestas/**").hasRole("ENCUESTADOR")

                        // Cualquier otro endpoint: alcanza con estar logueado (cualquier rol)
                        .anyRequest().authenticated()
                )

                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Registramos nuestro filtro para que corra ANTES del filtro estándar de Spring Security
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Necesario para que el AuthController pueda usar authenticationManager.authenticate(...)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
}