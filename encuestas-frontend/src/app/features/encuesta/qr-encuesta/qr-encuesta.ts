import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EncuestaService } from '../../../core/services/encuesta';
import { EnlaceService } from '../../../core/services/enlace';
import { Encuesta } from '../../../shared/models/encuesta-interface';
import { Enlace } from '../../../shared/models/enlace-interface';
import { EstadoEncuesta } from '../../../shared/models/estado-encuesta';

@Component({
  selector: 'app-qr-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './qr-encuesta.html',
  styleUrl: './qr-encuesta.css',
})
export class QrEncuesta implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private encuestaService = inject(EncuestaService);
  private enlaceService = inject(EnlaceService);

  protected readonly estados = EstadoEncuesta;

  encuesta = signal<Encuesta | null>(null);
  enlace = signal<Enlace | null>(null);
  errorCarga = signal(false);
  errorGenerar = signal(false);
  copiado = signal(false);
  generando = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorCarga.set(true);
      return;
    }

    this.encuestaService.obtenerPorId(id).subscribe({
      next: (encuesta) => {
        if (!encuesta) {
          this.errorCarga.set(true);
          return;
        }
        this.encuesta.set(encuesta);
        if (encuesta.estado === EstadoEncuesta.ACTIVA) {
          this.generarEnlace();
        }
      },
      error: () => this.errorCarga.set(true),
    });
  }

  private generarEnlace() {
    const enc = this.encuesta();
    if (!enc) return;
    this.generando.set(true);
    this.enlaceService.generar(enc.id, enc.titulo).subscribe({
      next: (enlace) => {
        this.enlace.set(enlace);
        this.generando.set(false);
      },
      error: () => {
        this.errorGenerar.set(true);
        this.generando.set(false);
      },
    });
  }

  copiarEnlace() {
    const link = this.enlace()?.urlCompleta;
    if (!link) return;
    navigator.clipboard?.writeText(link);
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }

  volver() {
    const enc = this.encuesta();
    this.router.navigate(enc ? ['/encuestas', enc.id] : ['/dashboard']);
  }
}