import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { ParameterGroupPage } from './parameterGroup';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: ParameterGroupPage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [ParameterGroupPage],
  exports: [RouterModule]
})
export class ParameterGroupPageModule { }