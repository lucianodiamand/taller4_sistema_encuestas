package com.encuestas.encuestas_backend.service;

import com.encuestas.encuestas_backend.dto.enlace.EnlaceRequestDTO;
import com.encuestas.encuestas_backend.dto.enlace.EnlaceResponseDTO;
import com.encuestas.encuestas_backend.model.*;
import com.encuestas.encuestas_backend.repository.EnlaceRepository;
import com.encuestas.encuestas_backend.repository.EncuestaRepository;
import com.encuestas.encuestas_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnlaceService {

    @Autowired
    private EnlaceRepository enlaceRepository;

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private QrCodeService qrCodeService;

    public EnlaceResponseDTO generar(EnlaceRequestDTO dto) {
        Encuesta encuesta = encuestaRepository.findById(dto.getEncuestaId())
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id: " + dto.getEncuestaId()));

        // RN01: no se pueden generar enlaces para una encuesta que no esté activa
        if (encuesta.getEstado() != EstadoEncuesta.ACTIVA) {
            throw new RuntimeException("No se pueden generar enlaces para una encuesta que no está activa.");
        }

        Usuario encuestador = usuarioRepository.findById(dto.getEncuestadorId())
                .orElseThrow(() -> new RuntimeException("Encuestador no encontrado con id: " + dto.getEncuestadorId()));

        Enlace enlace = new Enlace();
        enlace.setToken(Enlace.generarToken());
        enlace.setEncuesta(encuesta);
        enlace.setEncuestador(encuestador);

        Enlace guardado = enlaceRepository.save(enlace);

        EnlaceResponseDTO responseDTO = new EnlaceResponseDTO(guardado);
        responseDTO.setQrCodeBase64(qrCodeService.generarQrBase64(responseDTO.getUrlCompleta()));

        return responseDTO;
    }

    // Se usa cuando el encuestado accede a la URL pública (próximo paso, junto con RespuestaEncuesta)
    public Enlace validarYObtener(String token) {
        Enlace enlace = enlaceRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Enlace no encontrado o inválido."));

        // RF11: un enlace ya respondido no puede reutilizarse
        if (enlace.getEstado() == EstadoEnlace.RESPONDIDO) {
            throw new RuntimeException("Este enlace ya fue utilizado.");
        }

        // RN02: un enlace de una encuesta que ya no está activa no puede ser respondido,
        // aunque el encuestado tenga la URL guardada
        if (enlace.getEncuesta().getEstado() != EstadoEncuesta.ACTIVA) {
            throw new RuntimeException("La encuesta asociada a este enlace ya no está activa.");
        }

        return enlace;
    }
}