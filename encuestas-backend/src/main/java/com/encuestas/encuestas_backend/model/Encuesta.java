package com.encuestas.encuestas_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "encuestas")
@Getter
@Setter
@NoArgsConstructor
public class Encuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    private String restricciones;

    @Column(nullable = false)
    private Boolean disponible = false;    // true = disponible, false = cerrada. Es false por defecto para que solo se active cuando está completa con todas sus preguntas definitivas creadas. Una vez que esta activa ya no deberiamos poder cambiar las preguntas (porque "romperia" las respuestaEncuesta ya generadas)
    //TODO: que el service no permita editar preguntas de una encuesta que ya recibió respuestas

    @Column(nullable = false)
    private Boolean activo = true;        // baja lógica

    @Column(nullable = false)
    private LocalDate fechaCreacion = LocalDate.now();

    // Hibernate guarda la lista de Pregunta como JSON.
    // En PostgreSQL elige jsonb solo; en H2 usa su tipo JSON. No hace falta especificar nada con columnDefinition.
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Pregunta> preguntas = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)   // el usuario (admin) que la creó
    private Usuario usuario;
}