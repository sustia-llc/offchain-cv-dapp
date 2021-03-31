import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import * as SnackBarActions from './snack-bar.actions';
import { SnackBarService } from './snack-bar.service';

@Injectable()
export class SnackBarEffects {

  static readonly SNACKBAR_DELAY: number = 7000;

  constructor(private readonly actions$: Actions, private notifier: SnackBarService) { }

  openSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SnackBarActions.open),
        map(action => action.payload),
        tap(payload => this.notifier.show(payload))
      ),
    { dispatch: false }

  );
}
