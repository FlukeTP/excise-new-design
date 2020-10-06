import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { ParameterInfoPage } from './parameterInfo';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: ParameterInfoPage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [ParameterInfoPage],
  exports: [RouterModule]
})
export class ParameterInfoPageModule { }