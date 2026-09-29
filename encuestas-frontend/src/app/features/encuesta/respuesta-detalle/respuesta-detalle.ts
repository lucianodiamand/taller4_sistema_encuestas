import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RespuestaService } from '../../../core/services/respuesta';
import { RespuestaEncuesta } from '../../../shared/models/respuesta-encuesta-interface';
import { EstadoRespuesta } from '../../../shared/models/estado-respuesta';
import { notificarExito, notificarError } from '../../../core/utils/notificaciones';

@Component({
  selector: 'app-respuesta-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './respuesta-detalle.html',
  styleUrl: './respuesta-detalle.css',
})
export class RespuestaDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private respuestaService = inject(RespuestaService);
  private snack = inject(MatSnackBar);

  protected readonly estados = EstadoRespuesta;

  respuesta = signal<RespuestaEncuesta | null>(null);
  errorCarga = signal(false);
  validando = signal(false);

  private origen = '';

  ngOnInit() {
    this.origen = this.route.snapshot.queryParamMap.get('origen') ?? '';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorCarga.set(true);
      return;
    }

    this.respuestaService.obtenerPorId(id).subscribe({
      next: (respuesta) => this.respuesta.set(respuesta),
      error: () => this.errorCarga.set(true),
    });
  }

  validar(estado: 'aprobada' | 'rechazada') {
    const resp = this.respuesta();
    if (!resp || resp.estadoValidacion !== EstadoRespuesta.PENDIENTE || this.validando()) {
      return;
    }
    this.validando.set(true);

    this.respuestaService.validar(resp.id, estado === 'aprobada' ? EstadoRespuesta.APROBADA : EstadoRespuesta.RECHAZADA).subscribe({
      next: () => {
        // Actualizar estado local para que el badge y botones desaparezcan
        this.respuesta.update((r) => r ? { ...r, estadoValidacion: estado === 'aprobada' ? EstadoRespuesta.APROBADA : EstadoRespuesta.RECHAZADA } : null);
        notificarExito(this.snack, `Respuesta ${estado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente`);
        this.validando.set(false);
        // Volver a la pantalla de origen automáticamente
        this.volver();
      },
      error: () => {
        notificarError(this.snack, 'Error al validar la respuesta. Inténtalo de nuevo.');
        this.validando.set(false);
      },
    });
  }

  volver() {
    if (this.origen === 'encuesta') {
      const resp = this.respuesta();
      if (resp?.encuestaId) {
        this.router.navigate(['/encuestas', resp.encuestaId]);
        return;
      }
    }
    this.router.navigate(['/dashboard']);
  }
}