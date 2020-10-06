import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030105Component } from './ta030105.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030105Component }
];

@NgModule({
  declarations: [Ta030105Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030105Module { }
