import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { environment } from '../../environments/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { authReducer } from './auth/auth.reducer';
import { AuthState } from './auth/auth-state';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsState } from './settings/settings-state';
import { RouterState } from './router/router-state';
import { spinnerReducer } from './spinner/spinner.reducer';
import { SpinnerState } from './spinner/spinner-state';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  settings: settingsReducer,
  router: routerReducer,
  spinner: spinnerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];

if (!environment.production) {
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  'auth'
);

export const selectSettingsState = createFeatureSelector<
  AppState,
  SettingsState
>('settings');

export const selectRouterState = createFeatureSelector<
  AppState,
  RouterReducerState<RouterState>
>('router');

export const selectSpinnerState = createFeatureSelector<
  AppState,
  SpinnerState
>('spinner');

export interface AppState {
  auth: AuthState;
  settings: SettingsState;
  router: RouterReducerState<RouterState>;
  spinner: SpinnerState;
}
