import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth';
import { ClienteService } from '../../core/services/cliente';
import { EncuestaService } from '../../core/services/encuesta';
import { RespuestaService } from '../../core/services/respuesta';
import { UsuarioService } from '../../core/services/usuario';
import { Modal } from '../../shared/components/modal/modal';
import { Cliente } from '../../shared/models/cliente-interface';
import { Encuesta } from '../../shared/models/encuesta-interface';
import { EstadoEncuesta } from '../../shared/models/estado-encuesta';
import { RespuestaEncuesta } from '../../shared/models/respuesta-encuesta-interface';
import { Rol } from '../../shared/models/rol';
import { Usuario } from '../../shared/models/usuario-interface';
import { EstadoRespuesta } from '../../shared/models/estado-respuesta';
import { notificarExito, notificarError } from '../../core/utils/notificaciones';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule, 
    MatSlideToggleModule, 
    MatButtonToggleModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatBadgeModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private encuestaService = inject(EncuestaService);
  private respuestaService = inject(RespuestaService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  // Exponemos el enum para poder compararlo en el template
  protected readonly estados = EstadoEncuesta;
  protected readonly estadoResp = EstadoRespuesta;

  rolActual: Rol | null = this.authService.currentUserRole();
  emailUsuario = this.authService.currentUserEmail;
  usuarioInfo = signal<{ nombre: string; apellido: string } | null>(this.authService.getCurrentUserNombreCompleto());
  nombreUsuario = this.authService.currentUserNombre; 
  apellidoUsuario = this.authService.currentUserApellido;
  filtroEncuestas = signal<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS');
  filtroEncuestadores = signal<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS');
  filtroClientes = signal<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS');
  terminoBusquedaEncuestas = signal<string>('');
  terminoBusquedaEncuestadores = signal<string>('');
  terminoBusquedaClientes = signal<string>('');
  ordenEncuestas = signal<'id_asc' | 'id_desc' | 'nombre_asc' | 'nombre_desc'>('id_desc');
  ordenEncuestadores = signal<'id_asc' | 'id_desc' | 'nombre_asc' | 'nombre_desc'>('id_desc');
  ordenClientes = signal<'id_asc' | 'id_desc' | 'nombre_asc' | 'nombre_desc'>('id_desc');

  // Listas que se llenan al cargar los servicios (cargarDatos).
  // Se usan signals para que la vista se actualice sola al cambiar su valor.
  clientes = signal<Cliente[]>([]);
  encuestas = signal<Encuesta[]>([]);
  encuestadores = signal<Usuario[]>([]);
  respuestasPendientes = signal<RespuestaEncuesta[]>([]);

  ngOnInit() {
    this.cargarDatos();
  }

  // Simula la carga que haría la app contra la API
  cargarDatos() {
    this.encuestaService.obtenerTodas().subscribe((data) => this.encuestas.set(data));
    this.respuestaService.obtenerPendientes().subscribe((data) => {
      console.log('Respuestas pendientes cargadas: ', data);
      this.respuestasPendientes.set(data);
    });

    // Solo ADMIN carga clientes y encuestadores (con backend real, encuestador recibe 403)
    if (this.rolActual === Rol.ADMIN) {
      this.clienteService.obtenerTodos().subscribe((data) => this.clientes.set(data));
      this.usuarioService.obtenerEncuestadores().subscribe((data) => {
        this.encuestadores.set(data);
      });
    }

    console.log('Datos cargados: ', {
      clientes: this.clientes(),
      encuestas: this.encuestas(),
      encuestadores: this.encuestadores(),
    });
  }

// 2. Actualizamos las señales computadas
  encuestasFiltradas = computed(() => {
    const filtroEstado = this.filtroEncuestas();
    const termino = this.terminoBusquedaEncuestas().toLowerCase().trim();
    const orden = this.ordenEncuestas();
    
    // Clonamos el array para no mutar el original con el .sort()
    let lista = [...this.encuestas()];

    if (filtroEstado === 'ACTIVOS') lista = lista.filter(e => e.estado === this.estados.ACTIVA);
    if (filtroEstado === 'INACTIVOS') lista = lista.filter(e => e.estado === this.estados.CERRADA);
    
    if (termino) {
      lista = lista.filter(e => e.titulo.toLowerCase().includes(termino) || e.clienteNombre.toLowerCase().includes(termino));
    }

    // Aplicamos el ordenamiento
    return lista.sort((a, b) => {
      if (orden === 'id_asc') return a.id - b.id;
      if (orden === 'id_desc') return b.id - a.id;
      if (orden === 'nombre_asc') return a.titulo.localeCompare(b.titulo); // Compara strings (A-Z)
      if (orden === 'nombre_desc') return b.titulo.localeCompare(a.titulo); // Compara strings (Z-A)
      return 0;
    });
  });

  encuestadoresFiltrados = computed(() => {
    const filtroEstado = this.filtroEncuestadores();
    const termino = this.terminoBusquedaEncuestadores().toLowerCase().trim();
    const orden = this.ordenEncuestadores();
    let lista = [...this.encuestadores()];

    if (filtroEstado === 'ACTIVOS') lista = lista.filter(e => e.activo === true);
    if (filtroEstado === 'INACTIVOS') lista = lista.filter(e => e.activo === false);

    if (termino) {
      lista = lista.filter(e => e.nombre.toLowerCase().includes(termino) || e.apellido.toLowerCase().includes(termino) || e.email.toLowerCase().includes(termino));
    }

    return lista.sort((a, b) => {
      if (orden === 'id_asc') return a.id - b.id;
      if (orden === 'id_desc') return b.id - a.id;
      if (orden === 'nombre_asc') return a.nombre.localeCompare(b.nombre);
      if (orden === 'nombre_desc') return b.nombre.localeCompare(a.nombre);
      return 0;
    });
  });

  clientesFiltrados = computed(() => {
    const filtroEstado = this.filtroClientes();
    const termino = this.terminoBusquedaClientes().toLowerCase().trim();
    const orden = this.ordenClientes();
    let lista = [...this.clientes()];

    if (filtroEstado === 'ACTIVOS') lista = lista.filter(c => c.activo === true);
    if (filtroEstado === 'INACTIVOS') lista = lista.filter(c => c.activo === false);

    if (termino) {
      lista = lista.filter(c => c.nombre.toLowerCase().includes(termino) || c.email.toLowerCase().includes(termino));
    }

    return lista.sort((a, b) => {
      if (orden === 'id_asc') return a.id - b.id;
      if (orden === 'id_desc') return b.id - a.id;
      if (orden === 'nombre_asc') return a.nombre.localeCompare(b.nombre);
      if (orden === 'nombre_desc') return b.nombre.localeCompare(a.nombre);
      return 0;
    });
  });


  nombreCompleto(): string | null{
      return `${this.nombreUsuario()} ${this.apellidoUsuario()}`;
  }

  // Redirige al detalle de la encuesta (reemplaza al modal "ver")
  verEncuesta(encuesta: Encuesta) {
    this.router.navigate(['/encuestas', encuesta.id]);
  }

  // Navega al editor para crear una nueva encuesta
  nuevaEncuesta() {
    this.router.navigate(['/encuestas/nueva']);
  }

  // Navega al editor para modificar una encuesta existente
  editarEncuesta(encuesta: Encuesta) {
    this.router.navigate(['/encuestas', encuesta.id, 'editar']);
  }

  // Cambia el estado de la encuesta (activa <-> cerrada) usando el servicio
  cambiarEstado(encuesta: Encuesta) {
    const nuevoEstado =
      encuesta.estado === EstadoEncuesta.ACTIVA ? EstadoEncuesta.CERRADA : EstadoEncuesta.ACTIVA;

    this.encuestaService.cambiarEstado(encuesta.id, nuevoEstado).subscribe({
      next: (actualizada) => {
        this.encuestas.set(this.encuestas().map((e) => (e.id === actualizada.id ? actualizada : e)));
        notificarExito(this.snack, `Encuesta ${nuevoEstado === EstadoEncuesta.ACTIVA ? 'activada' : 'cerrada'} correctamente`);
      },
      error: () => notificarError(this.snack, 'No se pudo cambiar el estado de la encuesta'),
    });
  }

  // Apertura de Modales
  abrirModal( 
    entidad: any,
    tipoEntidad: string,
    accion: 'ver' | 'modificar' | 'eliminar' | 'crear',
  ) {
    const dialogRef = this.dialog.open(Modal, {
      width: '650px',
      maxWidth: '90vw',
      data: {
        titulo: accion,
        tipoAccion: accion,
        entidad: entidad,
        tipoEntidad: tipoEntidad,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      // Si el modal se cierra con cancelar o en la cruz, el resultado es undefined/false
      if (!resultado) {
        return;
      }

      // Eliminar: el modal solo confirma (true); acá se ejecuta la baja
      if (accion === 'eliminar') {
        if (tipoEntidad === 'Cliente')
          this.clienteService.eliminar(entidad.id).subscribe({
            next: () => {
              notificarExito(this.snack, 'Cliente eliminado correctamente');
              this.cargarDatos();
            },
            error: () => notificarError(this.snack, 'No se pudo eliminar el cliente'),
          });
        if (tipoEntidad === 'Encuestador')
          this.usuarioService.eliminar(entidad.id).subscribe({
            next: () => {
              notificarExito(this.snack, 'Encuestador eliminado correctamente');
              this.cargarDatos();
            },
            error: () => notificarError(this.snack, 'No se pudo eliminar el encuestador'),
          });
        if (tipoEntidad === 'Encuesta')
          this.encuestaService.eliminar(entidad.id).subscribe({
            next: () => {
              notificarExito(this.snack, 'Encuesta eliminada correctamente');
              this.cargarDatos();
            },
            error: () => notificarError(this.snack, 'No se pudo eliminar la encuesta'),
          });
        return;
      }

      // Crear y modificar: el modal ya guardó y devuelve la entidad. Recargamos los datos.
      this.cargarDatos();
      notificarExito(this.snack, `${tipoEntidad} guardado correctamente`);
    });
  }

  validarRespuesta(idRespuesta: number, estado: EstadoRespuesta) {
    this.respuestaService.validar(idRespuesta, estado).subscribe({
      next: () => {
        this.respuestaService.obtenerPendientes().subscribe((data) => this.respuestasPendientes.set(data));
        notificarExito(this.snack, `Respuesta ${estado === EstadoRespuesta.APROBADA ? 'aprobada' : 'rechazada'} correctamente`);
      },
      error: () => notificarError(this.snack, 'No se pudo validar la respuesta'),
    });
  }

  // Navega a la página de detalle de respuesta
  verRespuesta(res: RespuestaEncuesta) {
    this.router.navigate(['/respuestas', res.id]);
  }

  logout() {
    this.authService.logout();
  }
}