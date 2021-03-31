import { createSelector } from '@ngrx/store';

import { selectAuthState } from '../core.state';
import { AuthState } from './auth-state';

export const auth = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

export const isAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.idxConnected
);

export const did = createSelector(
  selectAuthState,
  (state: AuthState) => state.did
);

export const basicProfile = createSelector(
  selectAuthState,
  (state: AuthState) => state.basicProfile
);


