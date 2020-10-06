import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta03011701Component } from './ta03011701.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta03011701Component }
];

@NgModule({
  declarations: [Ta03011701Component],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta03011701Module { }
