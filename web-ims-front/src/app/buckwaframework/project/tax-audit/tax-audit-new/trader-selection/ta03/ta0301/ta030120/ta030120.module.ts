import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030120Component } from './ta030120.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030120Component }
];

@NgModule({
  declarations: [Ta030120Component],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030120Module { }
