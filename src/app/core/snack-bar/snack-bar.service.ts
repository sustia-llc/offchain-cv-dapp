import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MySnackBarComponent } from './my-snack-bar/my-snack-bar.component';
import { SnackBar } from './snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {

  static readonly SNACKBAR_DELAY: number = 2000;

  constructor(private matSnackBar: MatSnackBar) { }

  show(messageInfo: SnackBar): void {
    console.log(`SNACK BAR TO OPEN`);
    this.matSnackBar.openFromComponent(MySnackBarComponent, {
      data: {
        message: messageInfo.message,
      },
      duration: SnackBarService.SNACKBAR_DELAY,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: messageInfo.panelClass
    });
  }
  
}
