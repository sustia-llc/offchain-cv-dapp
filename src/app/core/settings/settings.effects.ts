import { ActivationEnd, Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { select, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, merge, of } from 'rxjs';
import {
  tap,
  withLatestFrom,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

import { selectSettingsState } from '../core.state';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AnimationsService } from '../animations/animations.service';
import { TitleService } from '../title/title.service';

import * as SettingsActions from './settings.actions';
import * as SettingsSelectors from './settings.selectors';

import { State } from './settings-state';

export const SETTINGS_KEY = 'SETTINGS';

const INIT = of('aw3s-init-effect-trigger');

@Injectable()
export class SettingsEffects {
  hour = 0;

  changeHour = this.ngZone.runOutsideAngular(() =>
    setInterval(() => {
      const hour = new Date().getHours();
      if (hour !== this.hour) {
        this.hour = hour;
        this.ngZone.run(() =>
          this.store.dispatch(SettingsActions.changeHour({ hour }))
        );
      }
    }, 60_000)
  );

  persistSettings = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SettingsActions.changeAnimationsElements,
          SettingsActions.changeAnimationsPage,
          SettingsActions.changeAnimationsPageDisabled,
          SettingsActions.changeAutoNightMode,
          SettingsActions.changeLanguage,
          SettingsActions.changeStickyHeader,
          SettingsActions.changeTheme
        ),
        withLatestFrom(this.store.pipe(select(selectSettingsState))),
        tap(([action, settings]) =>
          this.localStorageService.setItem(SETTINGS_KEY, settings)
        )
      ),
    { dispatch: false }
  );

  updateRouteAnimationType = createEffect(
    () =>
      merge(
        INIT,
        this.actions$.pipe(
          ofType(
            SettingsActions.changeAnimationsElements,
            SettingsActions.changeAnimationsPage
          )
        )
      ).pipe(
        withLatestFrom(
          combineLatest([
            this.store.pipe(select(SettingsSelectors.pageAnimations)),
            this.store.pipe(select(SettingsSelectors.elementsAnimations))
          ])
        ),
        tap(([action, [pageAnimations, elementsAnimations]]) =>
          this.animationsService.updateRouteAnimationType(
            pageAnimations,
            elementsAnimations
          )
        )
      ),
    { dispatch: false }
  );

  updateTheme = createEffect(
    () =>
      merge(INIT, this.actions$.pipe(ofType(SettingsActions.changeTheme))).pipe(
        withLatestFrom(this.store.pipe(select(SettingsSelectors.effectiveTheme))),
        tap(([action, effectiveTheme]) => {
          const classList = this.overlayContainer.getContainerElement()
            .classList;
          const toRemove = Array.from(classList).filter((item: string) =>
            item.includes('-theme')
          );
          if (toRemove.length) {
            classList.remove(...toRemove);
          }
          classList.add(effectiveTheme);
        })
      ),
    { dispatch: false }
  );

  setTranslateServiceLanguage = createEffect(
    () =>
      this.store.pipe(
        select(SettingsSelectors.language),
        distinctUntilChanged(),
        tap((language) => this.translateService.use(language))
      ),
    { dispatch: false }
  );

  setTitle = createEffect(
    () =>
      merge(
        this.actions$.pipe(ofType(SettingsActions.changeLanguage)),
        this.router.events.pipe(
          filter((event) => event instanceof ActivationEnd)
        )
      ).pipe(
        tap(() => {
          this.titleService.setTitle(
            this.router.routerState.snapshot.root,
            this.translateService
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private router: Router,
    private overlayContainer: OverlayContainer,
    private localStorageService: LocalStorageService,
    private titleService: TitleService,
    private animationsService: AnimationsService,
    private translateService: TranslateService,
    private ngZone: NgZone
  ) {}
}
