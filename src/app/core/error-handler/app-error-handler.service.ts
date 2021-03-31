import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { serializeError } from 'serialize-error';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { AppearanceColor } from '../snack-bar/snack-bar';

@Injectable({ providedIn: 'root' })
export class AppErrorHandler extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
   }

  handleError(error: Error | HttpErrorResponse) {

    const notifier = this.injector.get(SnackBarService);
    let message: string;

    if (error instanceof HttpErrorResponse) {

      message = error.message;
    } else {
      message = serializeError(error).message;
    }

    notifier.show({
      message,
      panelClass: AppearanceColor.Error
    });

    super.handleError(error);

  }

}
