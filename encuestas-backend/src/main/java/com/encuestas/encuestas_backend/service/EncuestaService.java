package com.encuestas.encuestas_backend.service;

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

    public EncuestaResponseDTO guardar(EncuestaRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + dto.getClienteId()));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + dto.getUsuarioId()));

        Encuesta encuesta = new Encuesta();
        encuesta.setTitulo(dto.getTitulo());
        encuesta.setDescripcion(dto.getDescripcion());
        encuesta.setCliente(cliente);
        encuesta.setUsuario(usuario);
        encuesta.setPreguntas(convertirPreguntas(dto.getPreguntas()));
        // el "estado" arranca en ACTIVA por defecto (definido en la entidad), no hace falta setearlo acá

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
}