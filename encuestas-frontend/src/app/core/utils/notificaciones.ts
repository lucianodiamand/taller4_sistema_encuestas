import { MatSnackBar } from '@angular/material/snack-bar';

export function notificarExito(snack: MatSnackBar, mensaje: string) {
  snack.open(mensaje, 'Cerrar', { duration: 3000, panelClass: 'snack-exito' });
}

export function notificarError(snack: MatSnackBar, mensaje: string) {
  snack.open(mensaje, 'Cerrar', { duration: 4000, panelClass: 'snack-error' });
}