import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030119Component } from './ta030119.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030119Component }
];
@NgModule({
  declarations: [Ta030119Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ]
})
export class Ta030119Module { }
