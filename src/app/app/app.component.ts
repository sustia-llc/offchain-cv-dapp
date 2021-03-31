import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment as env } from '../../environments/environment';

import {
  routeAnimations,
  LocalStorageService,
  AuthActions,
  SettingsActions,
  AuthSelectors,
  SettingsSelectors
} from '../core/core.module';
import { BasicProfile } from '../core/auth/basic-profile';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  year = new Date().getFullYear();

  languages = ['en', 'de', 'sk', 'fr', 'es', 'pt-br', 'zh-cn', 'he'];
  navigation = [
    { link: 'proposals', label: 'aw3s.menu.proposals' },
    { link: 'about', label: 'aw3s.menu.about' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'aw3s.menu.settings' }
  ];

  isAuthenticated$: Observable<boolean>;
  basicProfile$: Observable<BasicProfile>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;

  constructor(
    private store: Store,
    private storageService: LocalStorageService
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        SettingsActions.changeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.isAuthenticated$ = this.store.pipe(select(AuthSelectors.isAuthenticated));
    this.basicProfile$ = this.store.pipe(select(AuthSelectors.basicProfile));
    this.stickyHeader$ = this.store.pipe(select(SettingsSelectors.stickyHeader));
    this.language$ = this.store.pipe(select(SettingsSelectors.language));
    this.theme$ = this.store.pipe(select(SettingsSelectors.effectiveTheme));
  }

  onLoginClick() {
    this.store.dispatch(AuthActions.idxConnect());
  }

  onLogoutClick() {
    this.store.dispatch(AuthActions.idxDisconnect());
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(SettingsActions.changeLanguage({ language }));
  }
}
