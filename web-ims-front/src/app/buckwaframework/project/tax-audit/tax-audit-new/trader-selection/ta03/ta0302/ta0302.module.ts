import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0302Component } from './ta0302.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonFooterReportModule } from '../button-footer-report/button-footer-report.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ta0302Service } from './ts0302.service';

const routes: Routes = [
  { path: "", component: Ta0302Component },
  {
    path: '', component: Ta0302Component,
    children: [
      { path: "01", loadChildren: './ta030201/ta030201.module#Ta030201Module' },
      { path: "02", loadChildren: './ta030202/ta030202.module#Ta030202Module' },
      { path: "03", loadChildren: './ta030203/ta030203.module#Ta030203Module' },
    ]
  },
];

@NgModule({
  declarations: [Ta0302Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule   
  ],
  exports: [RouterModule],
  providers: [Ta0302Service]
})
export class Ta0302Module { }
