import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-buscador-ordenador',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './buscador-ordenador.html',
  styleUrl: './buscador-ordenador.css',
})
export class BuscadorOrdenador {
  @Input() etiquetaBusqueda = '';
  @Input() etiquetaNombre = 'Nombre';
  @Input() termino = '';
  @Input() orden = 'id_desc';

  @Output() terminoChange = new EventEmitter<string>();
  @Output() ordenChange = new EventEmitter<string>();
}