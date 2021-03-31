import { Action, createReducer, on } from '@ngrx/store';
import { SpinnerState } from './spinner-state';
import * as SpinnerActions from './spinner.actions';

const initialState: SpinnerState = {
  show: false
};

export const reducer = createReducer(
  initialState,
    on(SpinnerActions.show, state => ({
      ...state,
      show: true
    })),

    on(SpinnerActions.hide, state => ({
      ...state,
      show: false,
    })),
);

export function spinnerReducer(
  state: SpinnerState | undefined,
  action: Action
) {
  return reducer(state, action);
}
