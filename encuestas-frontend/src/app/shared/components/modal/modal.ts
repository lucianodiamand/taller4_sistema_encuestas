import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ClienteService } from '../../../core/services/cliente';
import { UsuarioService } from '../../../core/services/usuario';
import { EncuestaService } from '../../../core/services/encuesta';
import { EstadoEncuesta } from '../../models/estado-encuesta';
import { Rol } from '../../models/rol';
import { DatosModal } from '../../models/modal-interface';
import { Cliente } from '../../models/cliente-interface';
import { Usuario } from '../../models/usuario-interface';
import { Encuesta } from '../../models/encuesta-interface';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private encuestaService = inject(EncuestaService);

  // Exponemos los enums para usarlos en los <mat-select> del template
  protected readonly roles = Rol;
  protected readonly estados = EstadoEncuesta;

  // Formulario reactivo según el tipo de entidad (acciones "modificar" y "crear")
  form: FormGroup = this.fb.group({});

  // Clientes disponibles para el select de la encuesta (signal para que el select se actualice solo)
  clientes = signal<Cliente[]>([]);

  errorMessage = '';

  // true si el modal muestra el formulario (crear/modificar), false en ver/eliminar
  get esFormulario(): boolean {
    return this.data.tipoAccion === 'modificar' || this.data.tipoAccion === 'crear';
  }

  // Campos formateados para la vista "ver" (etiqueta + valor legibles)
  get camposVer(): { etiqueta: string; valor: string }[] {
    const entidad = this.data.entidad;
    if (!entidad) return [];

    const mapas: Record<string, [campo: string, etiqueta: string][]> = {
      Cliente: [
        ['nombre', 'Nombre'],
        ['email', 'Email'],
        ['telefono', 'Teléfono'],
        ['cuit', 'CUIT'],
        ['activo', 'Activo'],
        ['usuarioNombre', 'Creado por'],
      ],
      Encuestador: [
        ['nombre', 'Nombre'],
        ['apellido', 'Apellido'],
        ['email', 'Email'],
        ['rol', 'Rol'],
        ['activo', 'Activo'],
      ],
      Encuesta: [
        ['titulo', 'Título'],
        ['descripcion', 'Descripción'],
        ['clienteNombre', 'Cliente'],
        ['estado', 'Estado'],
        ['fechaCreacion', 'Creada el'],
        ['usuarioNombre', 'Creador'],
      ],
      Respuesta: [
        ['codigo', 'Código'],
        ['encuesta_id', 'Encuesta #'],
        ['fecha', 'Fecha'],
        ['estado', 'Estado'],
      ],
    };

    const pares = mapas[this.data.tipoEntidad] ?? [];
    return pares.map(([campo, etiqueta]) => ({
      etiqueta,
      valor: this.formatearValor(entidad[campo]),
    }));
  }

  // Deja los valores presentables: Sí/No, '-', fecha corta, arrays como cantidad
  private formatearValor(valor: any): string {
    if (valor === null || valor === undefined || valor === '') return '-';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (Array.isArray(valor)) return valor.length > 0 ? `${valor.length} elemento(s)` : '-';
    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) return valor.slice(0, 10);
    return String(valor);
  }

  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: DatosModal,
  ) {
    this.inicializar();
  }

  private inicializar() {
    // Para crear/modificar una encuesta hace falta el listado de clientes
    if (this.data.tipoEntidad === 'Encuesta') {
      this.clienteService.obtenerTodos().subscribe((data) => this.clientes.set(data));
    }

    if (this.data.tipoAccion !== 'modificar' && this.data.tipoAccion !== 'crear') {
      return;
    }

    if (this.data.tipoEntidad === 'Cliente') {
      const c: Cliente | null = this.data.entidad;
      this.form = this.fb.group({
        nombre: [c?.nombre ?? '', Validators.required],
        email: [c?.email ?? '', [Validators.required, Validators.email]],
        cuit: [c ? String(c.cuit) : '', [Validators.required, Validators.pattern('^[0-9]+$')]],
        telefono: [c?.telefono ?? ''],
        activo: [c?.activo ?? true],
      });
    } else if (this.data.tipoEntidad === 'Encuestador') {
      const u: Usuario | null = this.data.entidad;
      this.form = this.fb.group({
        nombre: [u?.nombre ?? '', Validators.required],
        apellido: [u?.apellido ?? '', Validators.required],
        email: [u?.email ?? '', [Validators.required, Validators.email]],
        // La contraseña solo es obligatoria al crear (u == null)
        password: ['', u ? [] : Validators.required],
        activo: [u?.activo ?? true],
      });
    } else if (this.data.tipoEntidad === 'Encuesta') {
      const e: Encuesta | null = this.data.entidad;
      this.form = this.fb.group({
        titulo: [e?.titulo ?? '', Validators.required],
        descripcion: [e?.descripcion ?? ''],
        clienteId: [e?.clienteId ?? '', Validators.required],
        estado: [e?.estado ?? EstadoEncuesta.ACTIVA, Validators.required],
      });
    }
  }

  // Guarda (crea o modifica) y cierra el diálogo devolviendo la entidad guardada.
  // El dashboard usa ese valor para recargar los datos.
  confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardar().subscribe({
      next: (guardado) => this.dialogRef.close(guardado),
      error: () => (this.errorMessage = 'No se pudo guardar. Inténtalo de nuevo.'),
    });
  }

  // Cada caso construye el payload con los campos válidos de su interfaz
  guardar(): Observable<unknown> {
    const datos = this.form.getRawValue();
    const editando = this.data.entidad != null;
    const id = this.data.entidad?.id;

    switch (this.data.tipoEntidad) {
      case 'Cliente':
        if (editando) {
          return this.clienteService.modificar(id, {
            nombre: datos.nombre,
            email: datos.email,
            telefono: datos.telefono || null,
            cuit: Number(datos.cuit),
            activo: datos.activo,
          });
        }
        return this.clienteService.crear({
          nombre: datos.nombre,
          email: datos.email,
          telefono: datos.telefono || null,
          cuit: Number(datos.cuit),
          usuarioId: 1, // el mock asume que crea el admin (id 1)
        });
      case 'Encuestador':
        if (editando) {
          return this.usuarioService.modificar(id, {
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
          });
        }
        return this.usuarioService.crear({
          nombre: datos.nombre,
          apellido: datos.apellido,
          email: datos.email,
          password: datos.password,
          // El formulario no tiene el campo rol: asumimos encuestador
          rol: datos.rol ?? Rol.ENCUESTADOR,
        });
      case 'Encuesta':
        if (editando) {
          return this.encuestaService.modificar(id, {
            titulo: datos.titulo,
            descripcion: datos.descripcion || null,
            clienteId: Number(datos.clienteId),
            estado: datos.estado,
          });
        }
        return this.encuestaService.crear({
          titulo: datos.titulo,
          descripcion: datos.descripcion || null,
          clienteId: Number(datos.clienteId),
          usuarioId: 1, // el mock asume que crea el admin (id 1)
          preguntas: [], // la edición de preguntas se agrega más adelante
        });
      default:
        // 'ver' y 'eliminar' no guardan datos
        return of(undefined);
    }
  }

  cerrar(confirmado: boolean): void {
    this.dialogRef.close(confirmado);
  }
}
