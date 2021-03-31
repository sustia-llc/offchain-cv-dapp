import { Injectable } from '@angular/core';
import { serializeError } from 'serialize-error';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import { map, mapTo, tap, switchMap, catchError, concatMap, mergeMap } from 'rxjs/operators';

import * as ErrorActions from '../../core/error-handler/error.actions';
import * as SnackBarActions from '../../core/snack-bar/snack-bar.actions';
import * as SpinnerActions from '../../core/spinner/spinner.actions';
import { AppearanceColor, SnackBar } from '../../core/snack-bar/snack-bar';

import * as ProposalSelectors from './proposal.selectors'
import * as ProposalActions from './proposal.actions';
import { ProposalService } from './proposal.service';
import { ProposalAppState } from './proposals-state';
import { AuthActions } from 'src/app/core/core.module';

@Injectable()
export class ProposalEffects {

  constructor(
    private store$: Store<ProposalAppState>,
    private proposalSrv: ProposalService,
    private actions$: Actions
  ) {}

  createProposal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.proposalAdd),
      switchMap((action) => from(this.proposalSrv.createProposal(action.proposal))),
      tap(proposal => console.log(`Created Proposal with id:` + JSON.stringify(proposal))),
      map((proposal) => {
        return ProposalActions.proposalAddSuccess({ proposal: proposal });
      })
    )
  );

  showCreateProposalSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.proposalAddSuccess),
      map(() => {
        const msg: SnackBar = {
          message: "Successfully created Proposal",
          panelClass: AppearanceColor.Success
        };
        return SnackBarActions.open({ payload: msg })
      })
    )
  );

  updateUserConvictionAllocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.updateUserCVAllocation),
      map(() => {
        return ProposalActions.updateUserConviction()
      })
    )
  );

  updateUserConvictionNewProposal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.proposalAddSuccess, ProposalActions.updateUserConviction),
      mergeMap( (action) =>
        this.store$.pipe(
          select(ProposalSelectors.getAllProposals),
          map((proposals) =>  this.proposalSrv.setUserConviction(proposals)),
        )
      ),
      map(() => { return ProposalActions.updateUserConvictionSuccess(); })
    )
  );

  showUserConvictionUpdateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.updateUserConvictionSuccess),
      map(() => {
        const msg: SnackBar = {
          message: "User Conviction Updated",
          panelClass: AppearanceColor.Success
        };
        return SnackBarActions.open({ payload: msg })
      }),
    )
  );

  loadConvictionStateDoc$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProposalActions.loadConvictionStateDoc, AuthActions.idxConnectSuccess),
    concatMap(() =>
      this.proposalSrv.getConvictionStateDoc().pipe(
        tap(proposals => console.log('proposals:', proposals)),
        map(proposals => ProposalActions.loadConvictionStateDocSuccess({ proposals }))
      )
    )
  ));

  loadProposalsDetail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProposalActions.loadConvictionStateDocSuccess),
    mergeMap((action) => from(action.proposals)),
      tap(proposal => console.log('loading proposal:', proposal.proposal)),
      map(proposal => ProposalActions.loadProposal({ documentdid: proposal.proposal}))
  ));

  loadUserConviction$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProposalActions.loadConvictionStateDocSuccess),
    mergeMap((action) =>
      this.proposalSrv.getUserConviction().pipe(
        tap(userconviction => console.log('userconviction:', userconviction)),
        map( (userconviction) => {
          if (userconviction != null) {
            return ProposalActions.loadUserConvictionSuccess({ userConviction: userconviction })
          } else {
            const msg: SnackBar = {
              message: "User Conviction Document is Empty",
              panelClass: AppearanceColor.Warn
            };
            return SnackBarActions.open({ payload: msg })
          }
        })
      )
    )
  ));

  loadUserConvictionsProposalsDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.loadUserConvictionSuccess),
      mergeMap((action) => from(action.userConviction.convictions)),
        tap(proposal => console.log('loading proposal:', proposal.proposal)),
        map(proposal => ProposalActions.loadProposal({ documentdid: proposal.proposal}))
    )
  );

  //mergeMap when the sequence of requests doesn't matter
  loadProposal$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProposalActions.loadProposal),
    mergeMap((action) =>
      this.proposalSrv.getProposal( action.documentdid ).pipe(
        tap(proposal => console.log('proposal:', proposal)),
        map(proposal => {
          //set documentID
          if (proposal.proposal == null) {
            proposal.proposal = action.documentdid.toString()
          }
          return ProposalActions.loadProposalSuccess({ proposal })
        })
      )
    )
  ));

  showSpinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.proposalAdd, ProposalActions.updateUserCVAllocation),
      mapTo(SpinnerActions.show())
    )
  );

  hideSpinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalActions.updateUserConvictionSuccess),
      mapTo(SpinnerActions.hide())
    )
  );

  private handleError(error: Error) {
    const friendlyErrorMessage = serializeError(error).message;
    return ErrorActions.errorMessage({ errorMsg: friendlyErrorMessage });
  }

}

