import { v4 as uuid } from 'uuid';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, combineReducers, createReducer, on } from '@ngrx/store';
import { State, ProposalState } from './proposals-state';
import * as ProposalActions from './proposal.actions';
import { Proposal } from './proposal';
import { ProposalsModule } from './proposals.module';

export const adapter: EntityAdapter<Proposal> = createEntityAdapter<Proposal>({
  selectId: (proposal: Proposal) => proposal.proposal,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  filter: 'ALL'
});

//reducers referenced in proposals.module.ts: StoreModule.forFeature("proposal", reducers)
export function reducers(state: ProposalState | undefined, action: Action) {
  return combineReducers({
    proposals: reducer
  })(state, action);
}

const reducer = createReducer(
  initialState,
  on(ProposalActions.loadConvictionStateDocSuccess, (state, { proposals }) => adapter.addMany(proposals, state)),
  on(ProposalActions.loadProposalSuccess, (state, { proposal }) => adapter.updateOne({ id: proposal.proposal, changes: proposal }, state)),
  on(ProposalActions.loadUserConvictionSuccess, (state, { userConviction }) => adapter.upsertMany(userConviction.convictions.map((proposal) => Object.assign({}, proposal)), state)),
  on(ProposalActions.loadUserConvictionSuccess, (state, { userConviction }) => adapter.updateMany(userConviction.proposals.map((proposalid) => Object.assign({}, {id: proposalid.toString(), changes: { owner: true }})), state)),
  on(ProposalActions.updateUserCVAllocation, (state, { proposals }) => adapter.updateMany(proposals.map((proposal) => Object.assign({}, {id: proposal.proposal.toString(), changes: {allocation: proposal.allocation}})), state)),
  on(ProposalActions.proposalAddSuccess, (state, { proposal }) => adapter.addOne(proposal, state)),
  on(ProposalActions.proposalFilter, (state, { filter }) => ({
    ...state,
    filter: filter
  }))
);

export function proposalReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
