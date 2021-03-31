import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsContainerComponent } from './settings-container/settings-container.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsContainerComponent,
    data: { title: 'aw3s.menu.settings' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
