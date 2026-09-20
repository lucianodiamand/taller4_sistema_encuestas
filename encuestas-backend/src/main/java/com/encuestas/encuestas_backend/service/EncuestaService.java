package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.encuesta.EncuestaRequestDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EncuestaResponseDTO;
import com.encuestas.encuestas_backend.model.Cliente;
import com.encuestas.encuestas_backend.model.Encuesta;
import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.ClienteRepository;
import com.encuestas.encuestas_backend.repository.EncuestaRepository;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * X ahora: solo consultar y crear encuestas. 
 * 
 * TODO: ir sumando metodos y coso.
 *
 * TEMPORAL: "usuarioId" es quién ejecuta la acción y llega como parámetro.
 * Cuando armemos JWT va a salir del token del usuario logueado.
 *
 */

@Service
@RequiredArgsConstructor
public class EncuestaService {

    private final EncuestaRepository encuestaRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    // ------------------------------------------------------------------
    // Consultas
    // ------------------------------------------------------------------

    public List<EncuestaResponseDTO> listarTodas() {
        return encuestaRepository.findByActivoTrue()
                .stream()
                .map(EncuestaResponseDTO::new)
                .toList();
    }

    public EncuestaResponseDTO obtenerPorId(Long id) {
        return new EncuestaResponseDTO(buscarEncuestaActiva(id));
    }

    // ------------------------------------------------------------------
    // Crear
    // ------------------------------------------------------------------

    @Transactional
    public EncuestaResponseDTO crear(EncuestaRequestDTO dto, Long usuarioId) {
        Usuario creador = buscarUsuarioHabilitado(usuarioId);
        Cliente cliente = buscarClienteActivo(dto.getClienteId());

        Encuesta encuesta = new Encuesta();
        encuesta.setNombre(dto.getNombre());
        encuesta.setDescripcion(dto.getDescripcion());
        encuesta.setRestricciones(dto.getRestricciones());
        encuesta.setCliente(cliente);
        encuesta.setUsuario(creador);
        // "disponible" queda en false (valor por defecto de la entidad): nace como borrador

        return new EncuestaResponseDTO(encuestaRepository.save(encuesta));
    }

    // ------------------------------------------------------------------
    // Métodos auxiliares (privados)
    // ------------------------------------------------------------------

    private Encuesta buscarEncuestaActiva(Long id) {
        return encuestaRepository.findById(id)
                .filter(Encuesta::getActivo)   // una encuesta dada de baja se trata como inexistente
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Encuesta no encontrada con id: " + id));
    }

    private Cliente buscarClienteActivo(Long id) {
        return clienteRepository.findById(id)
                .filter(Cliente::getActivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Cliente no encontrado con id: " + id));
    }

    private Usuario buscarUsuarioHabilitado(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con id: " + id));
        if (!usuario.getActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El usuario está dado de baja");
        }
        return usuario;
    }
}