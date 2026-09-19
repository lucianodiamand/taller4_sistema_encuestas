package com.encuestas.encuestas_backend.config;

import com.encuestas.encuestas_backend.model.Cliente;
import com.encuestas.encuestas_backend.model.Rol;
import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.ClienteRepository;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Carga datos de prueba cada vez que arranca la aplicación.
 
@Component
@RequiredArgsConstructor   // Lombok: genera el constructor con los campos final, y Spring inyecta por ahí
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Si ya hay usuarios (por ejemplo, si algún día usan PostgreSQL con ddl-auto=update),
        // no volvemos a cargar todo y evitamos duplicados.
        if (usuarioRepository.count() > 0) {
            return;
        }

        Usuario admin = crearUsuario("admin@test.com", "admin123", "Admin", "Sistema", Rol.ADMIN);
        Usuario enc1 = crearUsuario("ana@test.com", "clave123", "Ana", "García", Rol.ENCUESTADOR);
        Usuario enc2 = crearUsuario("luis@test.com", "clave123", "Luis", "Pérez", Rol.ENCUESTADOR);

        crearCliente("Empresa XYZ SA", "contacto@xyz.com", "3411234567", 30123456789L, admin);
        crearCliente("Empresa ABC", "contacto@abc.com", "3411112222", 30987654321L, admin);

        System.out.println("=== Datos de prueba cargados ===");
        System.out.println("ADMIN:       " + admin.getEmail() + " / admin123");
        System.out.println("ENCUESTADOR: " + enc1.getEmail() + " / clave123");
        System.out.println("ENCUESTADOR: " + enc2.getEmail() + " / clave123");
    }

    private Usuario crearUsuario(String email, String passwordPlano, String nombre, String apellido, Rol rol) {
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(passwordPlano));   // siempre encriptada, igual que en el Service
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setRol(rol);
        return usuarioRepository.save(u);
    }

    private Cliente crearCliente(String nombre, String email, String telefono, Long cuit, Usuario creador) {
        Cliente c = new Cliente();
        c.setNombre(nombre);
        c.setEmail(email);
        c.setTelefono(telefono);
        c.setCuit(cuit);
        c.setUsuario(creador);
        return clienteRepository.save(c);
    }
}