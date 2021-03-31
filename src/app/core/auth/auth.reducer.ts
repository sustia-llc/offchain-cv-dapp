import { AuthState } from './auth-state';
import * as AuthActions from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';

const initialState: AuthState = {
  idxConnected: false,
  did: null,
  basicProfile: null,
};

const reducer = createReducer(
  initialState,
  on(AuthActions.idxConnectSuccess, (state, { did }) => ({
    ...state,
    idxConnected: true,
    did: did
  })),
  on(AuthActions.idxLoadBasicProfileSuccess, (state, { basicProfile }) => ({
    ...state,
    basicProfile: basicProfile,
  })),    
  on(AuthActions.idxUpdateBasicProfileSuccess, (state, { name }) => ({
    ...state,
    basicProfile: {name: name},
  })),    
  on(AuthActions.idxDisconnect, (state) => ({
    ...state,
    idxConnected: false,
    did: null,
    basicProfile: null,
  }))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
