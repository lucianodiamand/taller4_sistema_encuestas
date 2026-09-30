import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';
import { EncuestaService } from '../../../core/services/encuesta';
import { RespuestaService } from '../../../core/services/respuesta';
import { ListaPreguntas } from '../../../shared/components/lista-preguntas/lista-preguntas';
import { Encuesta } from '../../../shared/models/encuesta-interface';
import { EstadisticasEncuesta } from '../../../shared/models/estadisticas-encuesta';
import { EstadoEncuesta } from '../../../shared/models/estado-encuesta';
import { RespuestaEncuesta } from '../../../shared/models/respuesta-encuesta-interface';
import { Rol } from '../../../shared/models/rol';
import { EstadoRespuesta } from '../../../shared/models/estado-respuesta';
import { notificarExito, notificarError } from '../../../core/utils/notificaciones';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-detalle-encuesta',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ListaPreguntas, MatCardModule],
  templateUrl: './detalle-encuesta.html',
  styleUrl: './detalle-encuesta.css',
})
export class DetalleEncuesta implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private encuestaService = inject(EncuestaService);
  private respuestaService = inject(RespuestaService);
  private snack = inject(MatSnackBar);

  // Exponemos los enums para compararlos en el template
  protected readonly estados = EstadoEncuesta;
  protected readonly roles = Rol;
  protected readonly estadoResp = EstadoRespuesta;

  rolActual = this.authService.currentUserRole();

  encuesta = signal<Encuesta | null>(null);
  estadisticas = signal<EstadisticasEncuesta | null>(null);
  pendientes = signal<RespuestaEncuesta[]>([]);
  errorCarga = signal(false);

  get esEncuestador(): boolean {
    return this.rolActual === Rol.ENCUESTADOR;
  }

  get esAdministrador(): boolean {
    return this.rolActual === Rol.ADMIN;
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorCarga.set(true);
      return;
    }

    this.encuestaService.obtenerPorId(id).subscribe((encuesta) => {
      if (!encuesta) {
        this.errorCarga.set(true);
        return;
      }
      this.encuesta.set(encuesta);

      this.cargarEstadisticas(encuesta.id);
  
      if (this.esEncuestador) {
        this.cargarPendientes(encuesta.id);
      }
    }); 
  }

  private cargarPendientes(encuestaId: number) {
    this.respuestaService.obtenerPendientesDeEncuesta(encuestaId).subscribe((pendientes) => {
      this.pendientes.set(pendientes);
    });
  }

  private cargarEstadisticas (encuestaId: number) {
     this.respuestaService.obtenerEstadisticas(encuestaId).subscribe((stats) => {
        this.estadisticas.set(stats);
      });
  }

  // Navega a la página QR
  verQR() {
    const enc = this.encuesta();
    if (enc) this.router.navigate(['/encuestas', enc.id, 'qr']);
  }

  // Navega a la página de detalle de respuesta
  verRespuesta(res: RespuestaEncuesta) {
    this.router.navigate(['/respuestas', res.id], { queryParams: { origen: 'encuesta' } });
  }

  validarRespuesta(idRespuesta: number, estado: EstadoRespuesta) {
    this.respuestaService.validar(idRespuesta, estado).subscribe({
      next: () => {
        const enc = this.encuesta();
        if (enc) {
          this.cargarPendientes(enc.id);
          this.cargarEstadisticas(enc.id);
        }
        notificarExito(this.snack, `Respuesta ${estado === EstadoRespuesta.APROBADA ? 'aprobada' : 'rechazada'} correctamente`);
      },
      error: () => notificarError(this.snack, 'No se pudo validar la respuesta'),
    });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }



  exportarCsv() {
    const enc = this.encuesta();
    if (!enc) return;
    this.encuestaService.exportarCsv(enc.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `encuesta_${enc.id}_respuestas.csv`;
        a.click();
        URL.revokeObjectURL(url);
        notificarExito(this.snack, 'CSV exportado correctamente');
      },
      error: () => notificarError(this.snack, 'No se pudo exportar el CSV.'),
    });
  }


}