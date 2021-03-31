import { createSelector } from '@ngrx/store';

import { SettingsState } from './settings-state';
import { selectSettingsState } from '../core.state';

export const settings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state
);

export const stickyHeader = createSelector(
  settings,
  (state: SettingsState) => state.stickyHeader
);

export const language = createSelector(
  settings,
  (state: SettingsState) => state.language
);

export const theme = createSelector(
  settings,
  (settings) => settings.theme
);

export const pageAnimations = createSelector(
  settings,
  (settings) => settings.pageAnimations
);

export const elementsAnimations = createSelector(
  settings,
  (settings) => settings.elementsAnimations
);

export const autoNightMode = createSelector(
  settings,
  (settings) => settings.autoNightMode
);

export const nightTheme = createSelector(
  settings,
  (settings) => settings.nightTheme
);

export const hour = createSelector(
  settings,
  (settings) => settings.hour
);

export const isNightHour = createSelector(
  autoNightMode,
  hour,
  (autoNightMode, hour) => autoNightMode && (hour >= 21 || hour <= 7)
);

export const effectiveTheme = createSelector(
  theme,
  nightTheme,
  isNightHour,
  (theme, nightTheme, isNightHour) =>
    (isNightHour ? nightTheme : theme).toLowerCase()
);
