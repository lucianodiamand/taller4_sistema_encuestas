import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ClienteService } from '../../../core/services/cliente';
import { EncuestaService } from '../../../core/services/encuesta';
import { AuthService } from '../../../core/services/auth';
import { Cliente } from '../../../shared/models/cliente-interface';
import { Encuesta } from '../../../shared/models/encuesta-interface';
import { EstadoEncuesta } from '../../../shared/models/estado-encuesta';
import { Pregunta } from '../../../shared/models/pregunta-interface';
import { TipoPregunta } from '../../../shared/models/tipo-pregunta';

@Component({
  selector: 'app-editor-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './editor-encuesta.html',
  styleUrl: './editor-encuesta.css',
})
export class EditorEncuesta implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private encuestaService = inject(EncuestaService);
  private authService = inject(AuthService);

  protected readonly estados = EstadoEncuesta;
  protected readonly tipos = TipoPregunta;
  protected readonly tiposPregunta = [
    { value: TipoPregunta.TEXTO_LIBRE, label: 'Texto' },
    { value: TipoPregunta.OPCION_MULTIPLE, label: 'Checkbox' },
    { value: TipoPregunta.OPCION_UNICA, label: 'Radio' },
    { value: TipoPregunta.EMAIL, label: 'Email' },
    { value: TipoPregunta.NUMERO, label: 'Número' },
    { value: TipoPregunta.ESCALA, label: 'Rango (1-5)' },
    { value: TipoPregunta.TELEFONO, label: 'Teléfono' },
  ];

  modoEdicion = false;
  idEncuesta: number | null = null;
  clientes = signal<Cliente[]>([]);
  errorMessage = '';
  errorCarga = false;

  form: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: [''],
    clienteId: ['', Validators.required],
    estado: [EstadoEncuesta.ACTIVA, Validators.required],
    preguntas: this.fb.array([]),
  });

  ngOnInit() {
    this.clienteService.obtenerTodos().subscribe((data) => this.clientes.set(data));

    this.modoEdicion = this.route.snapshot.paramMap.has('id');
    if (this.modoEdicion) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.idEncuesta = id;
      this.cargarEncuesta(id);
    }
  }

  private cargarEncuesta(id: number) {
    this.encuestaService.obtenerPorId(id).subscribe((encuesta) => {
      if (!encuesta) {
        this.errorCarga = true;
        return;
      }
      this.form.patchValue({
        titulo: encuesta.titulo,
        descripcion: encuesta.descripcion,
        clienteId: encuesta.clienteId,
        estado: encuesta.estado,
      });
      this.setPreguntas(encuesta.preguntas);
    });
  }

  get preguntas(): FormArray {
    return this.form.get('preguntas') as FormArray;
  }

  private nuevaPreguntaFG(pregunta?: Pregunta): FormGroup {
    return this.fb.group({
      texto: [pregunta?.texto ?? '', Validators.required],
      tipo: [pregunta?.tipo ?? TipoPregunta.TEXTO_LIBRE, Validators.required],
      opciones: this.fb.array(
        (pregunta?.opciones ?? []).map((op) => this.fb.control(op, Validators.required))
      ),
    });
  }

  private setPreguntas(preguntas: Pregunta[]) {
    const preguntasFA = this.preguntas;
    preguntasFA.clear();
    for (const p of preguntas) {
      preguntasFA.push(this.nuevaPreguntaFG(p));
    }
  }

  agregarPregunta() {
    this.preguntas.push(this.nuevaPreguntaFG());
  }

  quitarPregunta(index: number) {
    this.preguntas.removeAt(index);
  }

  getOpciones(preguntaIndex: number): FormArray {
    return this.preguntas.at(preguntaIndex).get('opciones') as FormArray;
  }

  agregarOpcion(preguntaIndex: number) {
    this.getOpciones(preguntaIndex).push(this.fb.control('', Validators.required));
  }

  quitarOpcion(preguntaIndex: number, opcionIndex: number) {
    this.getOpciones(preguntaIndex).removeAt(opcionIndex);
  }

  usaOpciones(tipo: TipoPregunta): boolean {
    return tipo === TipoPregunta.OPCION_UNICA || tipo === TipoPregunta.OPCION_MULTIPLE;
  }

  getTitulo(): string {
    return this.modoEdicion ? 'Editar encuesta' : 'Nueva encuesta';
  }

  guardar() {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Completá los campos obligatorios.';
      return;
    }

    for (let i = 0; i < this.preguntas.length; i++) {
      const pg = this.preguntas.at(i) as FormGroup;
      const tipo = pg.get('tipo')?.value as TipoPregunta;
      if (this.usaOpciones(tipo)) {
        const opciones = this.getOpciones(i).value as string[];
        const opcionesValidas = opciones.filter((o) => o.trim() !== '');
        if (opcionesValidas.length === 0) {
          this.form.markAllAsTouched();
          this.errorMessage = `La pregunta ${i + 1} (${this.getLabelTipo(tipo)}) requiere al menos una opción.`;
          return;
        }
      }
    }

    const preguntas: Pregunta[] = this.preguntas.value.map((p: any, idx: number) => ({
      orden: idx + 1,
      texto: p.texto,
      tipo: p.tipo,
      opciones: this.usaOpciones(p.tipo)
        ? p.opciones.filter((o: string) => o.trim() !== '')
        : [],
    }));

    const datos = {
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion || null,
      clienteId: Number(this.form.value.clienteId),
      estado: this.form.value.estado,
      preguntas,
    };

    if (this.modoEdicion && this.idEncuesta !== null) {
      this.encuestaService.modificar(this.idEncuesta, datos).subscribe({
        next: (guardada) => this.router.navigate(['/encuestas', guardada.id]),
        error: () => (this.errorMessage = 'No se pudo modificar la encuesta.'),
      });
    } else {
      const usuarioId = this.authService.currentUserId() ?? 1;
      this.encuestaService
        .crear({ ...datos, usuarioId })
        .subscribe({
          next: (guardada) => this.router.navigate(['/encuestas', guardada.id]),
          error: () => (this.errorMessage = 'No se pudo crear la encuesta.'),
        });
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }

  private getLabelTipo(tipo: TipoPregunta): string {
    const t = this.tiposPregunta.find((x) => x.value === tipo);
    return t?.label ?? String(tipo);
  }
}