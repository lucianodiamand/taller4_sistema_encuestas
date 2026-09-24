package com.encuestas.encuestas_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "respuestas_encuesta")
@Getter
@Setter
@NoArgsConstructor
public class RespuestaEncuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoRespuesta estadoValidacion = EstadoRespuesta.PENDIENTE;

    @Column(nullable = false)
    private LocalDateTime fechaRespuesta = LocalDateTime.now();

    @Convert(converter = RespuestaListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private List<RespuestaPregunta> respuestas = new ArrayList<>();

    // Un solo Enlace se corresponde con, como mucho, una RespuestaEncuesta.
    // A través de este campo también accedemos a Encuesta y Encuestador (enlace.getEncuesta(), enlace.getEncuestador()),
    // sin duplicar esas referencias acá.
    @OneToOne
    @JoinColumn(name = "enlace_id", nullable = false, unique = true)
    private Enlace enlace;

    // IMPORTANTE (RNF04): a propósito, NO guardamos ningún dato identificatorio
    // del encuestado (sin IP, sin nombre, sin email, sin nada). El anonimato es
    // una regla de negocio explícita del sistema.
}