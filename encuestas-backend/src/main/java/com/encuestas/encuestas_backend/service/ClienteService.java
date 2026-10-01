package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.cliente.ClienteEditRequestDTO;
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
        return clienteRepository.findByEliminadoFalse()   // cambia acá: antes era findAll()
                .stream()
                .map(ClienteResponseDTO::new)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO guardar(ClienteRequestDTO dto, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setCuit(dto.getCuit());
        cliente.setUsuario(usuario);

        Cliente guardado = clienteRepository.save(cliente);
        return new ClienteResponseDTO(guardado);
    }

    //Metodos para editar o desactivar un Cliente
    public ClienteResponseDTO editar(Long id, ClienteEditRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setCuit(dto.getCuit());
        cliente.setTelefono(dto.getTelefono());
        cliente.setActivo(dto.getActivo());
        // "usuario" (el creador original) queda afuera de este endpoint a propósito

        Cliente actualizado = clienteRepository.save(cliente);
        return new ClienteResponseDTO(actualizado);
    }

    public void desactivar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        cliente.setActivo(false);
        clienteRepository.save(cliente);
    }

    public void activar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        cliente.setActivo(true);
        clienteRepository.save(cliente);
    }

    public void eliminar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        cliente.setEliminado(true);
        cliente.setActivo(false);
        clienteRepository.save(cliente);
    }
}