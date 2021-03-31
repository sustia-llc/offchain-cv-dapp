import { Injectable } from '@angular/core';
import { serializeError } from 'serialize-error';
import { Router } from '@angular/router';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { switchMap, map, mapTo, tap, catchError } from 'rxjs/operators';

import { IdxProviderService } from './idx-provider.service';

import * as AuthActions from './auth.actions';
import * as ErrorActions from '../error-handler/error.actions';
import * as SnackBarActions from '../snack-bar/snack-bar.actions';
import * as SpinnerActions from '../spinner/spinner.actions';

import { AppearanceColor, SnackBar } from '../snack-bar/snack-bar';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class AuthEffects {

  idxConnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxConnect),
      switchMap(action => from(this.idxProviderService.authenticate())),
      tap(did => console.log(`Connected with DID: ${did}`)),
      map(did => AuthActions.idxConnectSuccess({ did: did })),

      catchError((error) =>
        of(this.handleError(error)),
      )
    )
  );

  showAuthSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxConnectSuccess),
      map(() => {
        const msg: SnackBar = {
          message: "Successfully Authenticated with Ceramic",
          panelClass: AppearanceColor.Success
        };
        return SnackBarActions.open({ payload: msg })
      })
    )
  );

  showUpdateBasicProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxUpdateBasicProfileSuccess),
      map(() => {
        const msg: SnackBar = {
          message: "Successfully Saved BasicProfile with Ceramic",
          panelClass: AppearanceColor.Success
        };
        return SnackBarActions.open({ payload: msg })
      })
    )
  );

  idxLoadBasicProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxConnectSuccess, AuthActions.idxLoadBasicProfile),
      switchMap(action => from(this.idxProviderService.loadProfile())),
      tap(basicProfile => console.log(`Loaded Basic Profile`)),
      map(basicProfile => AuthActions.idxLoadBasicProfileSuccess({
        basicProfile: basicProfile
      })),
      catchError((error) =>
        of(this.handleError(error), SpinnerActions.hide()),
      )
    )
  );

  idxUpdateBasicProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxUpdateBasicProfile),
      switchMap(action => from(this.idxProviderService.updateProfile(action.name))),
      tap(name => console.log(`Updated Basic Profile: ${name}`)),
      map(name => {
        return AuthActions.idxUpdateBasicProfileSuccess({ name: name });
      }),
      catchError((error) =>
        of(this.handleError(error), SpinnerActions.hide()),
      )
    )
  );

  showSpinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxConnectSuccess, AuthActions.idxUpdateBasicProfile),
      mapTo(SpinnerActions.show())
    )
  );

  hideSpinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.idxLoadBasicProfileSuccess, AuthActions.idxUpdateBasicProfileSuccess),
      mapTo(SpinnerActions.hide())
    )
  );

  connectRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticationRedirect),
        tap(_ => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  // FIXME: Logout
  // logout = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(AuthActions.idxDisconnect),
  //       tap(() => {
  //         this.router.navigate(['']);
  //         this.idxProviderService.setItem(AUTH_KEY, {
  //           isAuthenticated: false
  //         });
  //       })
  //     ),
  //   { dispatch: false }
  // );

  private handleError(error: Error) {
    const friendlyErrorMessage = serializeError(error).message;
    return ErrorActions.errorMessage({ errorMsg: friendlyErrorMessage });
  }

  constructor(
    private actions$: Actions,
    private idxProviderService: IdxProviderService,
    private router: Router
  ) { }
}
