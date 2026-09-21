import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth'; 
import { ClienteService } from '../../core/services/cliente';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  rolActual = this.authService.currentUserRole();
  clientes = this.clienteService.clientes;

  // Datos Dummy
  encuestas = [
    { id: 101, descripcion: 'Satisfacción Q1', estado: 'Activa', cant_preguntas: 10 },
    { id: 102, descripcion: 'Clima Laboral', estado: 'Cerrada', cant_preguntas: 5 }
  ];

  encuestadores = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', cuit: 20333333339 },
    { id: 2, nombre: 'María', apellido: 'Gómez', cuit: 27444444441 }
  ];

  respuestasPendientes = [
    { id: 501, encuesta_id: 101, fecha: '2024-05-10', codigo: 'ABC-123' },
    { id: 502, encuesta_id: 101, fecha: '2024-05-11', codigo: 'XYZ-987' }
  ];

  // Acciones de navegación
  navegarA(ruta: string, id: number) {
    this.router.navigate([ruta, id]);
  }

  // Apertura de Modales
  abrirModal(entidad: any, tipoEntidad: string, accion: 'ver' | 'modificar' | 'eliminar') {
    const dialogRef = this.dialog.open(Modal, {
      data: {
        titulo: `${accion.toUpperCase()} ${tipoEntidad}`,
        tipoAccion: accion,
        entidad: entidad
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado && accion === 'eliminar') {
        if (tipoEntidad === 'Cliente') {
          this.clienteService.eliminar(entidad.id);
        }
        // Aquí iría la lógica para eliminar encuestadores si existiera el servicio
      }
    });
  }

  generarQR(idEncuesta: number) {
    console.log('Generando QR para encuesta:', idEncuesta);
    // Lógica futura para QR
  }

  validarRespuesta(idRespuesta: number, estado: 'aprobada' | 'rechazada') {
    console.log(`Respuesta ${idRespuesta} marcada como ${estado}`);
    this.respuestasPendientes = this.respuestasPendientes.filter(r => r.id !== idRespuesta);
  }

  logout() {
    this.authService.logout();
  }
}