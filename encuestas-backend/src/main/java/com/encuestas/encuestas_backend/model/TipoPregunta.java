package com.encuestas.encuestas_backend.model;

public enum TipoPregunta {
    TEXTO_LIBRE,      // el encuestado escribe una respuesta abierta
    OPCION_UNICA,     // elige 1 de varias opciones (radio button)
    OPCION_MULTIPLE,  // elige varias opciones (checkbox)
    ESCALA,         // por ejemplo, del 1 al 5
    EMAIL,
    NUMERO,
    TELEFONO
}
