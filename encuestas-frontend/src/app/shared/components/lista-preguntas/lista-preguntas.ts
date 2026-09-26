import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pregunta } from '../../models/pregunta-interface';
import { TipoPregunta } from '../../models/tipo-pregunta';

// Render read-only de las preguntas de una encuesta.
// Se comparte entre la vista de detalle (admin/encuestador) y, más adelante,
// la vista pública de respuesta (ahí se agregará el modo editable).
@Component({
  selector: 'app-lista-preguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-preguntas.html',
  styleUrl: './lista-preguntas.css',
})
export class ListaPreguntas {
  @Input() preguntas: Pregunta[] = [];

  // Expone el enum para comparar el tipo en el template
  protected readonly tipos = TipoPregunta;

  etiquetaTipo(tipo: TipoPregunta): string {
    switch (tipo) {
      case TipoPregunta.TEXTO_LIBRE:
        return 'Texto libre';
      case TipoPregunta.OPCION_UNICA:
        return 'Opción única';
      case TipoPregunta.OPCION_MULTIPLE:
        return 'Opción múltiple';
      case TipoPregunta.ESCALA:
        return 'Escala';
      case TipoPregunta.EMAIL:
        return 'Email';
      case TipoPregunta.NUMERO:
        return 'Número';
      case TipoPregunta.TELEFONO:
        return 'Teléfono';
      default:
        return String(tipo);
    }
  }
}