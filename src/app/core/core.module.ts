import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';

import { environment } from '../../environments/environment';

import {
  AppState,
  reducers,
  metaReducers,
  selectRouterState
} from './core.state';

import * as AuthActions from '../core/auth/auth.actions';
import { AuthEffects } from './auth/auth.effects';
import * as AuthSelectors from './auth/auth.selectors';

import * as SettingsActions from '../core/settings/settings.actions';
import { SettingsEffects } from './settings/settings.effects';
import * as SettingsSelectors from '../core/settings/settings.selectors';

import * as ErrorActions from '../core/error-handler/error.actions';

import * as SnackBarActions from '../core/snack-bar/snack-bar.actions';
import { SnackBarEffects } from './snack-bar/snack-bar.effects';

import * as SpinnerActions from '../core/spinner/spinner.actions';
import { SpinnerEffects } from './spinner/spinner.effects';
import * as SpinnerSelectors from '../core/spinner/spinner.selectors';

import { MySnackBarComponent } from './snack-bar/my-snack-bar/my-snack-bar.component';

// import { AuthGuardService } from './auth/auth-guard.service';
import { TitleService } from './title/title.service';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  routeAnimations
} from './animations/route.animations';
import { AnimationsService } from './animations/animations.service';
import { AppErrorHandler } from './error-handler/app-error-handler.service';
import { CustomSerializer } from './router/custom-serializer';
import { LocalStorageService } from './local-storage/local-storage.service';
import { HttpErrorInterceptor } from './http-interceptors/http-error.interceptor';

import { MatButtonModule } from '@angular/material/button';
import {
  faCog,
  faBars,
  faRocket,
  faPowerOff,
  faUserCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

export {
  TitleService,
  AuthActions,
  AuthSelectors,
  ErrorActions,
  SettingsActions,
  SettingsSelectors,
  SnackBarActions,
  SpinnerActions,
  SpinnerSelectors,
  routeAnimations,
  AppState,
  LocalStorageService,
  ROUTE_ANIMATIONS_ELEMENTS,
  AnimationsService,
  // AuthGuardService,
  selectRouterState,
};

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    FormsModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,

    // ngrx
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AuthEffects,
      SettingsEffects,
      SpinnerEffects,
      SnackBarEffects
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: 'Off-chain Conviction Voting'
        }),

    // 3rd party
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [MySnackBarComponent],
  entryComponents: [
    MySnackBarComponent,
    MatSpinner
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  exports: [
    // angular
    FormsModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,

    // 3rd party
    FontAwesomeModule,
    TranslateModule
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    faIconLibrary: FaIconLibrary
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
    faIconLibrary.addIcons(
      faCog,
      faBars,
      faRocket,
      faPowerOff,
      faUserCircle,
      faPlayCircle,
      faGithub,
      faMediumM,
      faTwitter,
      faInstagram,
      faYoutube
    );
  }
}
