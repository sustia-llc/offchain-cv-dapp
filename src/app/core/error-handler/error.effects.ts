import { Injectable } from '@angular/core';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import * as ErrorActions from './error.actions';
import * as SnackBarActions from '../snack-bar/snack-bar.actions';
import { AppearanceColor, SnackBar } from '../snack-bar/snack-bar';

@Injectable()
export class ErrorEffects {

    constructor(private readonly actions$: Actions) {
    }

    handleError$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(ErrorActions.errorMessage),
          map(action => action.errorMsg),
          tap(errorMsg => console.error('Got error:', errorMsg)),
          map(errorMsg => {
            const msg: SnackBar = {
              message: errorMsg,
              panelClass: AppearanceColor.Error
            };
            return SnackBarActions.open({payload: msg});
          } )
        )

    );

}
