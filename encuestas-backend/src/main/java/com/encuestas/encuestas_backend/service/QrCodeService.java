package com.encuestas.encuestas_backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QrCodeService {

    private static final int ANCHO = 300;
    private static final int ALTO = 300;

    //!IMPORTANT Para que los pibes usen el QR desde el Angular lo tienen que hacer asi
    //<img [src]="'data:image/png;base64,' + qrCodeBase64" />

    // Genera un QR a partir de un texto (en nuestro caso, la URL del enlace)
    // y lo devuelve codificado en Base64, listo para mandar en un JSON.
    public String generarQrBase64(String texto) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(texto, BarcodeFormat.QR_CODE, ANCHO, ALTO);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] imagenBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(imagenBytes);

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error al generar el código QR", e);
        }
    }
}