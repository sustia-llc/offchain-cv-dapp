import { SettingsState, NIGHT_MODE_THEME } from './settings-state';
import * as SettingsActions from './settings.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: SettingsState = {
  language: 'en',
  theme: 'DEFAULT-THEME',
  autoNightMode: false,
  nightTheme: NIGHT_MODE_THEME,
  stickyHeader: true,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  elementsAnimations: true,
  hour: 0
};

const reducer = createReducer(
  initialState,
  on(
    SettingsActions.changeLanguage,
    SettingsActions.changeTheme,
    SettingsActions.changeAutoNightMode,
    SettingsActions.changeStickyHeader,
    SettingsActions.changeAnimationsPage,
    SettingsActions.changeAnimationsElements,
    SettingsActions.changeHour,
    (state, action) => ({ ...state, ...action })
  ),
  on(
    SettingsActions.changeAnimationsPageDisabled,
    (state, { pageAnimationsDisabled }) => ({
      ...state,
      pageAnimationsDisabled,
      pageAnimations: false
    })
  )
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
