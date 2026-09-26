package com.encuestas.encuestas_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI encuestasOpenAPI() {
        final String schemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("API Sistema de Encuestas")
                        .description("API REST para la gestión de encuestas, clientes, usuarios y respuestas anónimas.")
                        .version("1.0"))

                // Define el esquema de seguridad: "esta API se autentica con un Bearer Token tipo JWT"
                .components(new Components()
                        .addSecuritySchemes(schemeName, new SecurityScheme()
                                .name(schemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))

                // Aplica ese esquema como requisito por defecto a TODOS los endpoints
                .addSecurityItem(new SecurityRequirement().addList(schemeName));
    }
}