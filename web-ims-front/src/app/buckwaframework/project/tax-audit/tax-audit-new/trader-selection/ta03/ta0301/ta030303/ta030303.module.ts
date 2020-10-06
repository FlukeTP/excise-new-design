import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030303Component } from './ta030303.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030303Component }
];

@NgModule({
  declarations: [Ta030303Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030303Module { }
