import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as fromStore from '../core.state';
import { Store, select } from '@ngrx/store';
import { SpinnerOverlayService } from './spinner-overlay.service';

import * as SpinnerSelectors from './spinner.selectors';

@Injectable()
export class SpinnerEffects {

    constructor(
      private store$: Store<fromStore.AppState>,
      private spinner: SpinnerOverlayService) {}

    handleSpinner$ = createEffect(
      () =>
        this.store$.pipe(
          select(SpinnerSelectors.getSpinnerShow),
          tap( isShow => {
            isShow ? this.spinner.show() : this.spinner.hide()
          }
        )),
        { dispatch: false }
    );
}
