import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
  deps: [MatSnackBarModule],
})
export class SnackbarService {
  snackbar = inject(MatSnackBar);

  openSnackbar(message: string, action = 'close') {
    this.snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: 'snack-bg'
    });
  }
}
