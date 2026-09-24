package com.encuestas.encuestas_backend.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.ArrayList;
import java.util.List;

@Converter
public class RespuestaListConverter implements AttributeConverter<List<RespuestaPregunta>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<RespuestaPregunta> respuestas) {
        try {
            return objectMapper.writeValueAsString(respuestas);
        } catch (Exception e) {
            throw new RuntimeException("Error al convertir respuestas a JSON", e);
        }
    }

    @Override
    public List<RespuestaPregunta> convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isEmpty()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(json, new TypeReference<List<RespuestaPregunta>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error al leer respuestas desde JSON", e);
        }
    }
}