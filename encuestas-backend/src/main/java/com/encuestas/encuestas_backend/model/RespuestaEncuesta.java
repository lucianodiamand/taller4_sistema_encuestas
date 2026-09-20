package com.encuestas.encuestas_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Una fila nace cuando el encuestador genera el enlace, y se completa cuando el encuestado envía una respuesta.
 * El "codigo" es el token que va en la URL / el QR. 
 */

@Entity
@Table(name = "respuestas_encuesta")
@Getter
@Setter
@NoArgsConstructor
public class RespuestaEncuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UUID aleatorio: imposible de adivinar. Es el "enlace de un solo uso" (no es autoincremental para evitar que un encuestado malintencionado altere los resultados respondiendo varias encuestas "adivinando" los enlaces).
    @Column(nullable = false, unique = true)
    private String codigo = UUID.randomUUID().toString();

    // Momento en que se generó el enlace (sirve para ordenar y para estadísticas).
    // No interviene en la expiración: el enlace deja de valer cuando la Encuesta deja de estar disponible.
    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // null hasta que el encuestado envía la encuesta
    private LocalDateTime fechaRespuesta;

    // null hasta que se envía; después PENDIENTE, y el encuestador la pasa a APROBADA o RECHAZADA
    @Enumerated(EnumType.STRING)
    private EstadoRespuesta estado;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<RespuestaPregunta> respuestas;

    @ManyToOne
    @JoinColumn(name = "encuesta_id", nullable = false)
    private Encuesta encuesta;

    // El encuestador es un Usuario con rol ENCUESTADOR
    @ManyToOne
    @JoinColumn(name = "encuestador_id", nullable = false)
    private Usuario encuestador;

    public boolean estaRespondida() {
        return fechaRespuesta != null;
    }
}