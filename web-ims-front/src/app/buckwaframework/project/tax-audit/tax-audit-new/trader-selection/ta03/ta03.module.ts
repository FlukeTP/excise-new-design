import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ButtonFooterReportModule } from './button-footer-report/button-footer-report.module';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: "01", loadChildren: './ta0301/ta0301.module#Ta0301Module' },
  { path: "02", loadChildren: './ta0302/ta0302.module#Ta0302Module' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonFooterReportModule
  ],
  exports: [RouterModule],
})
export class Ta03Module { }
