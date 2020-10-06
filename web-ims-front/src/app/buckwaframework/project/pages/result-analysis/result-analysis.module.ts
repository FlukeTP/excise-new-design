import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { ResultAnalysisPage } from './result-analysis.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from '../../../common/components';

const routes: Routes = [
    { path: '', component: ResultAnalysisPage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), 
    CommonModule,
    FormsModule,
    BreadcrumbModule
  ],
  declarations: [ResultAnalysisPage],
  exports: [RouterModule]
})
export class ResultAnalysisPageModule { }