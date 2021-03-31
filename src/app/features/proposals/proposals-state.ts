import { EntityState } from "@ngrx/entity";
import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { AppState } from "src/app/core/core.module";
import { Proposal } from "./proposal";
import { proposalReducer } from "./proposal.reducer";

export type ProposalFilter = 'ALL' | 'EXECUTED' | 'ACTIVE' | 'CANCELLED';

//referenced in proposals.module.ts: StoreModule.forFeature("proposal", reducers)
export interface ProposalAppState extends AppState {
  proposal: ProposalState;
}

export interface ProposalState {
  proposals: State;
}

export interface State extends EntityState<Proposal> {
  // additional state property
  filter: ProposalFilter;
}
