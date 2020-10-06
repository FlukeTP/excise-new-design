import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { AnalysisPage } from './analysis.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from '../../../common/components';

const routes: Routes = [
  { path: '', component: AnalysisPage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule],
  declarations: [AnalysisPage
  ],
  exports: [RouterModule]
})
export class AnalysisPageModule { }