import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../common/services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from '../../../../common/components';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int0307Component } from './int0307.component';


const routes: Routes = [
  { path: '', component: Int0307Component, canActivate: [AuthGuard] }
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
    Int0307Component
  ],
  exports: [RouterModule]
})
export class Int0307Module { }
