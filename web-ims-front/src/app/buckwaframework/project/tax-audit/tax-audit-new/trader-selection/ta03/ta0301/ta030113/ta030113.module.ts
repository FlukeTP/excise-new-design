import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030113Component } from './ta030113.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030113Component }, 
];
@NgModule({
  declarations: [Ta030113Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports : [
    RouterModule
  ]
})
export class Ta030113Module { }
