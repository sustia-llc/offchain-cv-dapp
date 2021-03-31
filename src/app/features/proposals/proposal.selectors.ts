import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ProposalAppState, ProposalState, State } from "./proposals-state";

import * as fromProposals from './proposal.reducer';

export const selectProposalState = createFeatureSelector<ProposalAppState, ProposalState>(
  'proposal'
);

export const getProposalEntitiesState = createSelector(selectProposalState, state => state.proposals);

export const {
  selectIds: getProposalKeys,
  selectEntities: getProposalEntities,
  selectAll: getAllProposals,
  selectTotal: getTotalProposals,
} = fromProposals.adapter.getSelectors(getProposalEntitiesState);

