import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DatosModal } from '../../models/modal-interface';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: DatosModal
  ) {}

  cerrar(confirmado: boolean): void {
    this.dialogRef.close(confirmado);
  }
}
