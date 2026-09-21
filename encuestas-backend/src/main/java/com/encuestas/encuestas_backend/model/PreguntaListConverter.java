package com.encuestas.encuestas_backend.model;

import tools.jackson.core.type.TypeReference;

import tools.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.ArrayList;
import java.util.List;

@Converter
public class PreguntaListConverter implements AttributeConverter<List<Pregunta>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Java -> Base de datos: convierte la lista a un String JSON
    @Override
    public String convertToDatabaseColumn(List<Pregunta> preguntas) {
        try {
            return objectMapper.writeValueAsString(preguntas);
        } catch (Exception e) {
            throw new RuntimeException("Error al convertir preguntas a JSON", e);
        }
    }

    // Base de datos -> Java: convierte el String JSON de vuelta a una lista
    @Override
    public List<Pregunta> convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isEmpty()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(json, new TypeReference<List<Pregunta>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error al leer preguntas desde JSON", e);
        }
    }
}