import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ta030202Component } from './ta030202.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030202Component }
];

@NgModule({
  declarations: [Ta030202Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030202Module { }
