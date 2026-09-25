package com.encuestas.encuestas_backend.config;

import com.encuestas.encuestas_backend.model.*;
import com.encuestas.encuestas_backend.repository.ClienteRepository;
import com.encuestas.encuestas_backend.repository.EncuestaRepository;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Evita duplicar los datos si reiniciás la app varias veces
        if (usuarioRepository.count() > 0) {
            System.out.println("DataInitializer: ya hay datos cargados, se omite la carga inicial.");
            return;
        }

        System.out.println("DataInitializer: cargando datos de prueba...");

        // --- Usuarios ---
        Usuario admin = new Usuario();
        admin.setEmail("admin@test.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setNombre("Carla");
        admin.setApellido("Gómez");
        admin.setRol(Rol.ADMIN);
        admin.setActivo(true);
        admin = usuarioRepository.save(admin);

        Usuario encuestador = new Usuario();
        encuestador.setEmail("encuestador@test.com");
        encuestador.setPassword(passwordEncoder.encode("encuestador123"));
        encuestador.setNombre("Felipe");
        encuestador.setApellido("Marquez");
        encuestador.setRol(Rol.ENCUESTADOR);
        encuestador.setActivo(true);
        encuestador = usuarioRepository.save(encuestador);

        Usuario encuestador2 = new Usuario();
        encuestador2.setEmail("encuestador2@test.com");
        encuestador2.setPassword(passwordEncoder.encode("encuestador123"));
        encuestador2.setNombre("Teresa");
        encuestador2.setApellido("Sanchez");
        encuestador2.setRol(Rol.ENCUESTADOR);
        encuestador2.setActivo(true);
        encuestador2 = usuarioRepository.save(encuestador2);

        // --- Clientes ---
        Cliente cliente1 = new Cliente();
        cliente1.setNombre("Supermercado Norte");
        cliente1.setEmail("contacto@superNorte.com");
        cliente1.setTelefono("3415551234");
        cliente1.setCuit(30712345678L);
        cliente1.setActivo(true);
        cliente1.setUsuario(admin);
        cliente1 = clienteRepository.save(cliente1);

        Cliente cliente2 = new Cliente();
        cliente2.setNombre("Farmacia del Sol");
        cliente2.setEmail("contacto@farmaciaDelSol.com");
        cliente2.setTelefono("3415552345");
        cliente2.setCuit(30798765432L);
        cliente2.setActivo(true);
        cliente2.setUsuario(admin);
        cliente2 = clienteRepository.save(cliente2);

        Cliente cliente3 = new Cliente();
        cliente3.setNombre("Librería Central");
        cliente3.setEmail("contacto@libreriaCentral.com");
        cliente3.setTelefono("3415553456");
        cliente3.setCuit(30755511122L);
        cliente3.setActivo(true);
        cliente3.setUsuario(admin);
        cliente3 = clienteRepository.save(cliente3);

        List<Cliente> clientes = List.of(cliente1, cliente2, cliente3);

        // --- Encuestas: 6 en total, 2 por cada cliente ---
        for (int i = 0; i < clientes.size(); i++) {
            Cliente clienteActual = clientes.get(i);

            for (int j = 1; j <= 2; j++) {
                Encuesta encuesta = new Encuesta();
                encuesta.setTitulo("Encuesta de satisfacción " + j + " - " + clienteActual.getNombre());
                encuesta.setDescripcion("Encuesta de prueba generada automáticamente");
                encuesta.setEstado(EstadoEncuesta.ACTIVA);
                encuesta.setCliente(clienteActual);
                encuesta.setUsuario(admin);
                encuesta.setPreguntas(crearPreguntasDePrueba());

                encuestaRepository.save(encuesta);
            }
        }

        System.out.println("DataInitializer: datos de prueba cargados correctamente.");
    }

    private List<Pregunta> crearPreguntasDePrueba() {
        List<Pregunta> preguntas = new ArrayList<>();

        Pregunta p1 = new Pregunta();
        p1.setOrden(1);
        p1.setTexto("¿Cómo calificarías tu experiencia?");
        p1.setTipo(TipoPregunta.ESCALA);
        preguntas.add(p1);

        Pregunta p2 = new Pregunta();
        p2.setOrden(2);
        p2.setTexto("¿Qué mejorarías?");
        p2.setTipo(TipoPregunta.TEXTO_LIBRE);
        preguntas.add(p2);

        Pregunta p3 = new Pregunta();
        p3.setOrden(3);
        p3.setTexto("¿Volverías a comprar?");
        p3.setTipo(TipoPregunta.OPCION_UNICA);
        p3.setOpciones(List.of("Sí", "No", "Tal vez"));
        preguntas.add(p3);

        return preguntas;
    }
}