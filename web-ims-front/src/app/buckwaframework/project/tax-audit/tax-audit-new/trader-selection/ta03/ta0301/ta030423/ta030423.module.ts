import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030423Component } from './ta030423.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030423Component }
];
@NgModule({
  declarations: [Ta030423Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ]
})
export class Ta030423Module { }
