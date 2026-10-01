import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-filtro-estado',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  templateUrl: './filtro-estado.html',
  styleUrl: './filtro-estado.css',
})
export class FiltroEstado {
  @Input() valor = 'TODOS';
  @Input() etiquetaActivos = 'Activos';
  @Input() etiquetaInactivos = 'Inactivos';

  @Output() valorChange = new EventEmitter<string>();
}