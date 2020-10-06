import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../common/services';
import { FormsModule, ReactiveFormsModule } from '../../../../../../../node_modules/@angular/forms';
import { BreadcrumbModule } from '../../../../common/components';
import { Int0301Component } from './int0301.component';
import { Int030101Component } from './int030101/int030101.component';
import { Int030102Component } from './int030102/int030102.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int030103Component } from './int030103/int030103.component';


const routes: Routes = [
  { path: '', component: Int0301Component, canActivate: [AuthGuard] },
  { path: '01', component: Int030101Component, canActivate: [AuthGuard] },
  { path: '02', component: Int030102Component, canActivate: [AuthGuard] },
  { path: '03', component: Int030103Component, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    SharedModule,
    ReactiveFormsModule

  ],
  declarations: [
    Int0301Component,
    Int030101Component,
    Int030102Component,
    Int030103Component
  ],
  exports: [RouterModule]
})
export class Int0301Module { }