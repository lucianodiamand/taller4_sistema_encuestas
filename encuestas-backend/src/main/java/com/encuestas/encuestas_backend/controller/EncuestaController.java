package com.encuestas.encuestas_backend.controller;

import com.encuestas.encuestas_backend.dto.encuesta.EncuestaRequestDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EncuestaResponseDTO;
import com.encuestas.encuestas_backend.dto.encuesta.EstadisticasEncuestaDTO;
import com.encuestas.encuestas_backend.model.EstadoEncuesta;
import com.encuestas.encuestas_backend.service.EncuestaService;
import com.encuestas.encuestas_backend.service.EstadisticasService;
import com.encuestas.encuestas_backend.service.RespuestaEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.nio.charset.StandardCharsets;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@RequestMapping("/api/encuestas")
public class EncuestaController {

    @Autowired
    private EncuestaService encuestaService;

    @GetMapping
    public List<EncuestaResponseDTO> listar() {
        return encuestaService.listarTodas();
    }

    @PatchMapping("/{id}/estado")
    public EncuestaResponseDTO cambiarEstado(@PathVariable Long id, @RequestParam EstadoEncuesta nuevoEstado) {
        return encuestaService.cambiarEstado(id, nuevoEstado);
    }

    @PostMapping
    public EncuestaResponseDTO crear(@RequestBody EncuestaRequestDTO dto) {
        return encuestaService.guardar(dto);
    }

    @Autowired
    private RespuestaEncuestaService respuestaEncuestaService;   // nuevo

    @GetMapping("/{id}/exportar-csv")
    public ResponseEntity<byte[]> exportarCsv(@PathVariable Long id) {
        String csv = respuestaEncuestaService.generarCsv(id);

        // El BOM (\uFEFF) al principio es un detalle práctico: sin él, Excel a veces
        // rompe los acentos y la "ñ" al abrir el archivo directamente.
        byte[] contenido = ("\uFEFF" + csv).getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "encuesta_" + id + "_respuestas.csv");

        return new ResponseEntity<>(contenido, headers, HttpStatus.OK);
    }
    @Autowired
    private EstadisticasService estadisticasService;   // nuevo

    @GetMapping("/{id}/estadisticas")
    public EstadisticasEncuestaDTO obtenerEstadisticas(@PathVariable Long id) {
        return estadisticasService.obtenerEstadisticas(id);
    }

}