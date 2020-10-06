import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030111Component } from './ta030111.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030111Component }
];

@NgModule({
  declarations: [Ta030111Component],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030111Module { }
