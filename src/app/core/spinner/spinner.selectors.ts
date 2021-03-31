import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpinnerState } from './spinner-state';
import { selectSpinnerState } from '../core.state';

export const getSpinnerShow = createSelector(
    selectSpinnerState,
    (state: SpinnerState) => state.show
  );
