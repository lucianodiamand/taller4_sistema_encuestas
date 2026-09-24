import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';
import { EncuestaService } from '../../../core/services/encuesta';
import { RespuestaService } from '../../../core/services/respuesta';
import { EnlaceService } from '../../../core/services/enlace';
import { ListaPreguntas } from '../../../shared/components/lista-preguntas/lista-preguntas';
import { Encuesta } from '../../../shared/models/encuesta-interface';
import { EstadisticasEncuesta } from '../../../shared/models/estadisticas-encuesta';
import { EstadoEncuesta } from '../../../shared/models/estado-encuesta';
import { Enlace } from '../../../shared/models/enlace-interface';
import { RespuestaEncuesta } from '../../../shared/models/respuesta-encuesta-interface';
import { Rol } from '../../../shared/models/rol';

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
  private enlaceService = inject(EnlaceService);

  // Exponemos los enums para compararlos en el template
  protected readonly estados = EstadoEncuesta;
  protected readonly roles = Rol;

  rolActual = this.authService.currentUserRole();

  encuesta = signal<Encuesta | null>(null);
  estadisticas = signal<EstadisticasEncuesta | null>(null);
  pendientes = signal<RespuestaEncuesta[]>([]);
  enlaceGenerado = signal<Enlace | null>(null);
  copiado = signal(false);
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

  // Genera un enlace de un solo uso + QR (solo encuestador y con encuesta activa, RN01)
  generarQR() {
    const encuesta = this.encuesta();
    if (!encuesta || !this.esEncuestador || encuesta.estado !== EstadoEncuesta.ACTIVA) {
      return;
    }
    this.enlaceService.generar(encuesta.id, encuesta.titulo).subscribe((enlace) => {
      this.enlaceGenerado.set(enlace);
    });
  }

  validarRespuesta(respuesta: RespuestaEncuesta, estado: 'aprobada' | 'rechazada') {
    this.respuestaService.validar(respuesta.id, estado).subscribe(() => {
      const encuesta = this.encuesta();
      if (encuesta) {
        this.cargarPendientes(encuesta.id);
      }
    });
  }

  copiarEnlace() {
    const enlace = this.enlaceGenerado();
    if (!enlace?.urlCompleta) return;
    navigator.clipboard?.writeText(enlace.urlCompleta);
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}