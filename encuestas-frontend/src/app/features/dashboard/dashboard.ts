import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatIconModule, MatDialogModule],
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

  // Exponemos el enum para poder compararlo en el template
  protected readonly estados = EstadoEncuesta;

  rolActual: Rol | null = this.authService.currentUserRole();

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
    this.clienteService.obtenerTodos().subscribe((data) => this.clientes.set(data));
    this.encuestaService.obtenerTodas().subscribe((data) => this.encuestas.set(data));
    this.usuarioService.obtenerEncuestadores().subscribe((data) => this.encuestadores.set(data));
    this.respuestaService
      .obtenerPendientes()
      .subscribe((data) => this.respuestasPendientes.set(data));
    console.log('Datos cargados: ', {
      clientes: this.clientes(),
      encuestas: this.encuestas(),
      encuestadores: this.encuestadores(),
    });
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
    this.encuestaService.cambiarEstado(encuesta.id, nuevoEstado).subscribe((actualizada) => {
      this.encuestas.set(this.encuestas().map((e) => (e.id === actualizada.id ? actualizada : e)));
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
        titulo: `${accion.toUpperCase()} ${tipoEntidad}`,
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
          this.clienteService.eliminar(entidad.id).subscribe(() => this.cargarDatos());
        if (tipoEntidad === 'Encuestador')
          this.usuarioService.eliminar(entidad.id).subscribe(() => this.cargarDatos());
        if (tipoEntidad === 'Encuesta')
          this.encuestaService.eliminar(entidad.id).subscribe(() => this.cargarDatos());
        return;
      }

      // Crear y modificar: el modal ya guardó y devuelve la entidad. Recargamos los datos.
      this.cargarDatos();
    });
  }

  validarRespuesta(idRespuesta: number, estado: 'aprobada' | 'rechazada') {
    this.respuestaService.validar(idRespuesta, estado).subscribe(() => {
      this.respuestaService
        .obtenerPendientes()
        .subscribe((data) => this.respuestasPendientes.set(data));
    });
  }

  logout() {
    this.authService.logout();
  }
}
