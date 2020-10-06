import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030106Component } from './ta030106.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030106Component }
];

@NgModule({
  declarations: [Ta030106Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030106Module { }
