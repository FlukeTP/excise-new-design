import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030114Component } from './ta030114.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ta03011401Component } from './ta03011401/ta03011401.component';
import { Ta03011402Component } from './ta03011402/ta03011402.component';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: "", component: Ta030114Component },
  { path: "1", component: Ta03011401Component },
  { path: "2", component: Ta03011402Component },
]
@NgModule({
  declarations: [Ta030114Component, Ta03011401Component, Ta03011402Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    ButtonFooterReportModule
  ],
  exports: [RouterModule]
})
export class Ta030114Module { }
