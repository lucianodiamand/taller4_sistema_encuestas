import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RespuestaEncuesta } from '../../models/respuesta-encuesta-interface';

@Component({
  selector: 'app-lista-respuestas-pendientes',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-respuestas-pendientes.html',
  styleUrl: './lista-respuestas-pendientes.css',
})
export class ListaRespuestasPendientes {
  @Input() respuestas: RespuestaEncuesta[] = [];
  @Output() ver = new EventEmitter<RespuestaEncuesta>();
}