import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { MgcontrolComponent } from './mgcontrol.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { FormsModule } from '@angular/forms';
import { Mgc011Component } from '../mgc01/mgc01-1/mgc01-1.component';
import { Mgc012Component } from '../mgc01/mgc01-2/mgc01-2.component';
import { Mgc013Component } from '../mgc01/mgc01-3/mgc01-3.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';


const routes: Routes = [
    { path: '', component: MgcontrolComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes),
      CommonModule,
      FormsModule,
      BreadcrumbModule
    ],
  declarations: [
    MgcontrolComponent,
    Mgc011Component,
    Mgc012Component,
    Mgc013Component,
  ],
  exports: [RouterModule]
})
export class MgcontrolComponentModule { }