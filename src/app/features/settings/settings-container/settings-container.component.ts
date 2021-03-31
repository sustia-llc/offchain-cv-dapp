import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions, AuthSelectors, ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { AuthState } from '../../../core/auth/auth-state';
import { BasicProfile } from 'src/app/core/auth/basic-profile';

import { SettingsActions, SettingsSelectors } from '../../../core/core.module';

import { SettingsState, State } from '../../../core/settings/settings-state';

@Component({
  selector: 'aw3s-settings',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsContainerComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  settings$: Observable<SettingsState>;
  auth$: Observable<AuthState>;
  basicProfile$: Observable<BasicProfile>;

  themes = [
    { value: 'DEFAULT-THEME', label: 'blue' },
    { value: 'LIGHT-THEME', label: 'light' },
    { value: 'NATURE-THEME', label: 'nature' },
    { value: 'BLACK-THEME', label: 'dark' }
  ];

  languages = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'sk', label: 'Slovenčina' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'pt-br', label: 'Português' },
    { value: 'zh-cn', label: '简体中文' },
    { value: 'he', label: 'עברית' }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.settings$ = this.store.pipe(select(SettingsSelectors.settings));
    this.auth$ = this.store.pipe(select(AuthSelectors.auth));
    this.basicProfile$ = this.store.pipe(select(AuthSelectors.basicProfile));
  }

  updateProfile(data) {
    this.store.dispatch(AuthActions.idxUpdateBasicProfile({name: data.name}));
  };

  onLanguageSelect({ value: language }) {
    this.store.dispatch(SettingsActions.changeLanguage({ language }));
  }

  onThemeSelect({ value: theme }) {
    this.store.dispatch(SettingsActions.changeTheme({ theme }));
  }

  onAutoNightModeToggle({ checked: autoNightMode }) {
    this.store.dispatch(SettingsActions.changeAutoNightMode({ autoNightMode }));
  }

  onStickyHeaderToggle({ checked: stickyHeader }) {
    this.store.dispatch(SettingsActions.changeStickyHeader({ stickyHeader }));
  }

  onPageAnimationsToggle({ checked: pageAnimations }) {
    this.store.dispatch(SettingsActions.changeAnimationsPage({ pageAnimations }));
  }

  onElementsAnimationsToggle({ checked: elementsAnimations }) {
    this.store.dispatch(
      SettingsActions.changeAnimationsElements({ elementsAnimations })
    );
  }
}
