package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.encuesta.EncuestaEditRequestDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EncuestaRequestDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EncuestaResponseDTO;
import com.encuestas.encuestas_backend.dto.encuesta.PreguntaDTO;
import com.encuestas.encuestas_backend.model.*;
import com.encuestas.encuestas_backend.repository.ClienteRepository;
import com.encuestas.encuestas_backend.repository.EncuestaRepository;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EncuestaService {

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<EncuestaResponseDTO> listarTodas() {
        return encuestaRepository.findAll()
                .stream()
                .map(EncuestaResponseDTO::new)
                .collect(Collectors.toList());
    }

    public EncuestaResponseDTO obtenerPorId(Long id) {
        Encuesta encuesta = encuestaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id: " + id));
        return new EncuestaResponseDTO(encuesta);
    }

    public EncuestaResponseDTO guardar(EncuestaRequestDTO dto, Long usuarioId) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + dto.getClienteId()));

        if (cliente.getEliminado()) {
            throw new RuntimeException("No se puede crear una encuesta para un cliente eliminado.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        Encuesta encuesta = new Encuesta();
        encuesta.setTitulo(dto.getTitulo());
        encuesta.setDescripcion(dto.getDescripcion());
        encuesta.setCliente(cliente);
        encuesta.setUsuario(usuario);
        encuesta.setPreguntas(convertirPreguntas(dto.getPreguntas()));

        Encuesta guardada = encuestaRepository.save(encuesta);
        return new EncuestaResponseDTO(guardada);
    }

    public EncuestaResponseDTO cambiarEstado(Long id, EstadoEncuesta nuevoEstado) {
        Encuesta encuesta = encuestaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id: " + id));

        encuesta.setEstado(nuevoEstado);
        Encuesta actualizada = encuestaRepository.save(encuesta);
        return new EncuestaResponseDTO(actualizada);
    }

    // Convierte la lista de PreguntaDTO (lo que llega del front) en List<Pregunta> (lo que se guarda)
    private List<Pregunta> convertirPreguntas(List<PreguntaDTO> preguntasDTO) {
        return preguntasDTO.stream()
                .map(dto -> {
                    Pregunta pregunta = new Pregunta();
                    pregunta.setOrden(dto.getOrden());
                    pregunta.setTexto(dto.getTexto());
                    pregunta.setTipo(dto.getTipo());
                    pregunta.setOpciones(dto.getOpciones());
                    return pregunta;
                })
                .collect(Collectors.toList());
    }

    public EncuestaResponseDTO editar(Long id, EncuestaEditRequestDTO dto) {
        Encuesta encuesta = encuestaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id: " + id));

        // Regla de negocio: una vez que la encuesta recibió su primera respuesta,
        // ya no se puede editar (evita inconsistencias con respuestas ya guardadas,
        // que hacen referencia a las preguntas por su "orden")

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + dto.getClienteId()));

        if (cliente.getEliminado()) {
            throw new RuntimeException("No se puede asociar la encuesta a un cliente eliminado.");
        }

        encuesta.setTitulo(dto.getTitulo());
        encuesta.setDescripcion(dto.getDescripcion());
        encuesta.setCliente(cliente);
        if (!encuesta.getInicializada()) { //si no esta inicializada cambia todo, si esta inicializada solo podemos cambiar titulo, descripcion y cliente
        encuesta.setPreguntas(convertirPreguntas(dto.getPreguntas()));
        }
        // "usuario" (el creador) y "estado" quedan afuera de este endpoint a propósito

        Encuesta actualizada = encuestaRepository.save(encuesta);
        return new EncuestaResponseDTO(actualizada);
    }
}