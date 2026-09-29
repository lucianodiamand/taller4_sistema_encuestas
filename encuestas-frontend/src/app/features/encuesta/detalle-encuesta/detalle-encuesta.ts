import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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

@Component({
  selector: 'app-detalle-encuesta',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ListaPreguntas],
  templateUrl: './detalle-encuesta.html',
  styleUrl: './detalle-encuesta.css',
})
export class DetalleEncuesta implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private encuestaService = inject(EncuestaService);
  private respuestaService = inject(RespuestaService);

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
      this.respuestaService.obtenerEstadisticas(encuesta.id).subscribe((stats) => {
        this.estadisticas.set(stats);
      });
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
    this.respuestaService.validar(idRespuesta, estado).subscribe(() => {
      const enc = this.encuesta();
      if (enc) this.cargarPendientes(enc.id);
    });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}