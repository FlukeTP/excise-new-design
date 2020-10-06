import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030107Component } from './ta030107.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030107Component }
];

@NgModule({
  declarations: [Ta030107Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030107Module { }
