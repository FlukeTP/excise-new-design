import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030112Component } from './ta030112.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030112Component }, 
];

@NgModule({
  declarations: [Ta030112Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports:[RouterModule]
})
export class Ta030112Module { }
