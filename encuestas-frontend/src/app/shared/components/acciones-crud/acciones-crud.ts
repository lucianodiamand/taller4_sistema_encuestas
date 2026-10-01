import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-acciones-crud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './acciones-crud.html',
  styleUrl: './acciones-crud.css',
})
export class AccionesCrud {
  @Input() mostrarVer = true;
  @Input() mostrarEditar = true;
  @Input() mostrarEliminar = true;

  @Output() ver = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();
}