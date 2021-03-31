import { v4 as uuid } from 'uuid';
import { createAction, props } from '@ngrx/store';
import { ProposalFilter } from './proposals-state';
import { Proposal, UserConviction } from './proposal';

export const proposalAdd = createAction('[Proposals] Add', props<{ proposal: Proposal }>());
export const proposalAddSuccess =
  createAction('[Proposals] Create Proposal Success', props<{ proposal: Proposal }>());

export const loadConvictionStateDoc = createAction('[Proposals] Load Conviction State Doc');
export const loadConvictionStateDocSuccess = createAction('[Proposals] Conviction State Proposals Success', props<{ proposals: Proposal[] }>());

export const loadProposal = createAction('[Proposals] Load Proposal', props<{ documentdid: String }>());
export const loadProposalSuccess = createAction('[Proposals] Load Proposal Success', props<{ proposal: Proposal }>());

export const loadUserConviction = createAction('[Proposals] Load User Conviction');
export const loadUserConvictionSuccess = createAction('[Proposals] Load User Conviction Success', props<{ userConviction: UserConviction }>());

export const updateUserConviction = createAction('[Proposals] Update User Conviction');
export const updateUserConvictionSuccess = createAction('[Proposals] Update User Conviction Success');

export const updateUserCVAllocation = createAction('[Proposals] Update User CV Allocation', props<{ proposals: Proposal[] }>());

export const proposalFilter = createAction(
  '[Proposals] Filter',
  props<{ filter: ProposalFilter }>()
);
