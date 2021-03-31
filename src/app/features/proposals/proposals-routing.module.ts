import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProposalsComponent } from './proposals/proposals.component';

const routes: Routes = [
  {
    path: '',
    component: ProposalsComponent,
    data: { title: 'aw3s.menu.proposals' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalsRoutingModule {}
