import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { ProposalEffects } from './proposal.effects';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalsRoutingModule } from './proposals-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from '../../../environments/environment';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { reducers } from './proposal.reducer';

@NgModule({
  declarations: [ProposalsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProposalsRoutingModule,
    StoreModule.forFeature("proposal", reducers),   
    EffectsModule.forFeature([ProposalEffects])
  ]
})
export class ProposalsModule { }
