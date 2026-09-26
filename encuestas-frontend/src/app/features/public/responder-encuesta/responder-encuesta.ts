import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EnlaceService } from '../../../core/services/enlace';
import { RespuestaService } from '../../../core/services/respuesta';
import { Encuesta } from '../../../shared/models/encuesta-interface';
import { Pregunta } from '../../../shared/models/pregunta-interface';
import { TipoPregunta } from '../../../shared/models/tipo-pregunta';
import { RespuestaEnviada, RespuestaPregunta } from '../../../shared/models/respuesta-enviada-interface';

@Component({
  selector: 'app-responder-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './responder-encuesta.html',
  styleUrl: './responder-encuesta.css',
})
export class ResponderEncuesta implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private enlaceService = inject(EnlaceService);
  private respuestaService = inject(RespuestaService);

  protected readonly tipos = TipoPregunta;

  encuesta = signal<Encuesta | null>(null);
  errorTipo = signal<'INVALIDO' | 'USADO' | 'CERRADA' | null>(null);
  finalizada = signal(false);
  errorMessage = '';

  respuestas = this.fb.array<AbstractControl>([]);

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.enlaceService.obtenerPorToken(token).subscribe({
      next: (encuesta) => {
        if (!encuesta) {
          this.errorTipo.set('INVALIDO');
          return;
        }
        // Verificar si la encuesta está activa (ya validado en servicio mock)
        this.encuesta.set(encuesta);
        this.construirFormulario(encuesta.preguntas);
      },
      error: (err) => {
        const msg = err?.message ?? 'INVALIDO';
        switch (msg) {
          case 'ENLACE_INVALIDO':
            this.errorTipo.set('INVALIDO');
            break;
          case 'ENLACE_USADO':
            this.errorTipo.set('USADO');
            break;
          case 'ENCUESTA_CERRADA':
            this.errorTipo.set('CERRADA');
            break;
          default:
            this.errorTipo.set('INVALIDO');
        }
      },
    });
  }

  private construirFormulario(preguntas: Pregunta[]) {
    this.respuestas.clear();

    for (const p of preguntas) {
      switch (p.tipo) {
        case TipoPregunta.TEXTO_LIBRE:
          this.respuestas.push(this.fb.control('', Validators.required));
          break;
        case TipoPregunta.EMAIL:
          this.respuestas.push(this.fb.control('', [Validators.required, Validators.email]));
          break;
        case TipoPregunta.NUMERO:
          this.respuestas.push(this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]));
          break;
        case TipoPregunta.TELEFONO:
          this.respuestas.push(this.fb.control('', Validators.required));
          break;
        case TipoPregunta.ESCALA:
          this.respuestas.push(this.fb.control(3, Validators.required)); // valor por defecto 3 (centro de 1-5)
          break;
        case TipoPregunta.OPCION_UNICA:
          this.respuestas.push(this.fb.control('', Validators.required));
          break;
        case TipoPregunta.OPCION_MULTIPLE:
          // Array de checkboxes: un FormControl por opción
          const checkboxes = this.fb.array(
            p.opciones.map(() => this.fb.control(false)),
            alMenosUnaOpcion
          );
          this.respuestas.push(checkboxes);
          break;
        default:
          this.respuestas.push(this.fb.control('', Validators.required));
      }
    }
  }

  // Helpers para el template: evitan anidar formArrayName/formGroupName
  getControl(i: number): FormControl {
    return this.respuestas.at(i) as FormControl;
  }

  getCheckboxes(i: number): FormArray {
    return this.respuestas.at(i) as FormArray;
  }

  getCheckbox(i: number, oi: number): FormControl {
    return this.getCheckboxes(i).at(oi) as FormControl;
  }

  enviar() {
    this.errorMessage = '';

    if (this.respuestas.invalid) {
      this.respuestas.markAllAsTouched();
      this.errorMessage = 'Completá todas las preguntas obligatorias.';
      return;
    }

    const encuesta = this.encuesta();
    if (!encuesta) return;

    const respuestas: RespuestaPregunta[] = encuesta.preguntas.map((p, i) => {
      const control = this.respuestas.at(i);
      let valor: string | number | string[];

      if (p.tipo === TipoPregunta.OPCION_MULTIPLE) {
        const checks = (control as FormArray).value as boolean[];
        valor = p.opciones.filter((_, oi) => checks[oi]);
      } else {
        valor = control.value;
      }

      return { preguntaOrden: p.orden, valor };
    });

    const datos: RespuestaEnviada = {
      token: this.route.snapshot.paramMap.get('token') ?? '',
      encuestaId: encuesta.id,
      respuestas,
    };

    this.respuestaService.enviar(datos).subscribe({
      next: () => {
        this.enlaceService.marcarRespondido(datos.token).subscribe({
          next: () => this.finalizada.set(true),
          error: () => (this.errorMessage = 'Error al marcar el enlace.'),
        });
      },
      error: () => (this.errorMessage = 'No se pudo enviar la respuesta. Inténtalo de nuevo.'),
    });
  }
}

// Validador custom: al menos un checkbox true en el FormArray
function alMenosUnaOpcion(control: AbstractControl): { [key: string]: boolean } | null {
  const arr = control as FormArray;
  const alguno = arr.controls.some((c) => c.value === true);
  return alguno ? null : { alMenosUnaOpcion: true };
}