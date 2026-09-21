package com.encuestas.encuestas_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI encuestasOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Sistema de Encuestas")
                        .description("API REST para la gestión de encuestas, clientes, usuarios y respuestas anónimas.")
                        .version("1.0"));
    }
}