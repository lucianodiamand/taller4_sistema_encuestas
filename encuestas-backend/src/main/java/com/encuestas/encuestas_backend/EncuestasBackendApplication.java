package com.encuestas.encuestas_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EncuestasBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EncuestasBackendApplication.class, args);
	}

}
