package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.cliente.ClienteRequestDTO;
import com.encuestas.encuestas_backend.dto.cliente.ClienteResponseDTO;
import com.encuestas.encuestas_backend.model.Cliente;
import com.encuestas.encuestas_backend.model.Usuario;
import com.encuestas.encuestas_backend.repository.ClienteRepository;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream().map(ClienteResponseDTO::new).collect(Collectors.toList());
    }

    public ClienteResponseDTO guardar(ClienteRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + dto.getUsuarioId()));

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setCuit(dto.getCuit());
        cliente.setUsuario(usuario);

        Cliente guardado = clienteRepository.save(cliente);
        return new ClienteResponseDTO(guardado);
    }
}