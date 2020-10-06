import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { MgReportResultComponent } from './mgReportResult.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { Mgc021Component } from './mgc02-1/mgc02-1.component';
import { Mgc022Component } from './mgc02-2/mgc02-2.component';
import { Mgc023Component } from './mgc02-3/mgc02-3.component';

const routes: Routes = [
    { path: '', component: MgReportResultComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule
  ],
  declarations: [
    MgReportResultComponent,
    Mgc021Component,
    Mgc022Component,
    Mgc023Component
  ],
  exports: [RouterModule]
})
export class MgReportResultComponentModule {


  
 }