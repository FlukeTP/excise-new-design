import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { SelectNewFormComponent } from './select-new-form.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: SelectNewFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [SelectNewFormComponent],
  exports: [RouterModule]
})
export class SelectNewFormComponentModule { }