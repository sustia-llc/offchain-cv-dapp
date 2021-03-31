import { createReducer, on } from '@ngrx/store';
import * as ErrorActions from './error.actions';

export interface ErrorState {
  error: string | null;
}

const initialState: ErrorState = {
  error: null
};

export const reducer = createReducer(
  initialState,
  on(ErrorActions.errorMessage, (state, { errorMsg }) => ({
    ...state,
     error: errorMsg
    })),
);

export const getError = (state: ErrorState) => state.error;
