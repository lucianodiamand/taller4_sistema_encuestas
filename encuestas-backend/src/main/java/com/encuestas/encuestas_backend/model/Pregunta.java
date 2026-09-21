package com.encuestas.encuestas_backend.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Pregunta {
    private Integer orden;
    private String texto;
    private TipoPregunta tipo;
    private List<String> opciones = new ArrayList<>();  // solo aplica si es OPCION_UNICA/MULTIPLE
}